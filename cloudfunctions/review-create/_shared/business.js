const { assertRequired, clone, nowIso } = require("./helpers");
const {
  getStore,
  ensureUser,
  addBeanLog,
  isFavorite,
  toggleFavorite,
  createSubmission,
  createReview,
  buildRanking,
  searchSnacks,
  computeDashboard,
} = require("./mock-store");

function getUserId(event, context) {
  return (
    event.userId ||
    event.openid ||
    (context && context.OPENID) ||
    "user_demo"
  );
}

function loginInit(event = {}, context = {}) {
  const userId = getUserId(event, context);
  const user = ensureUser(userId);
  return {
    user: clone(user),
    serverTime: nowIso(),
  };
}

function homeFeed() {
  const store = getStore();
  const ranking = store.dailyRankings.length ? store.dailyRankings : buildRanking();
  const featured = ranking
    .slice(0, 10)
    .map((row) => store.snacks.get(row.snackId))
    .filter(Boolean)
    .map((item) => ({
      id: item.id,
      name: item.name,
      coverImage: item.coverImage,
      recommendIndex: item.recommendIndex,
      couponPrice: item.cpsInfo.couponPrice,
      tags: item.topKeywords.slice(0, 3),
    }));

  return {
    banners: clone(store.banners),
    categories: clone(store.categories),
    featured,
    ranking: clone(ranking.slice(0, 20)),
    topics: clone(store.topicFeeds),
  };
}

function snackDetail(event = {}, context = {}) {
  assertRequired(event.snackId, "snackId");
  const store = getStore();
  const snack = store.snacks.get(event.snackId);
  if (!snack || snack.status !== "published") {
    const error = new Error("snack not found");
    error.code = "NOT_FOUND";
    throw error;
  }

  const userId = getUserId(event, context);
  snack.stats.viewCount += 1;
  snack.updatedAt = nowIso();

  const reviews = Array.from(store.reviews.values())
    .filter((item) => item.snackId === snack.id && item.status === "published")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 20);

  return {
    snack: clone(snack),
    reviews: clone(reviews),
    isFavorite: isFavorite(userId, snack.id),
    recommendSnacks: Array.from(store.snacks.values())
      .filter((item) => item.status === "published" && item.id !== snack.id)
      .slice(0, 6)
      .map((item) => ({
        id: item.id,
        name: item.name,
        coverImage: item.coverImage,
        recommendIndex: item.recommendIndex,
      })),
  };
}

function snackSearch(event = {}) {
  const page = Number(event.page || 1);
  const pageSize = Number(event.pageSize || 20);
  const data = searchSnacks(
    event.keyword || "",
    event.categoryId || "",
    event.sort || "recommend",
    page,
    pageSize
  );
  return {
    page,
    pageSize,
    total: data.total,
    list: clone(data.list),
  };
}

function submissionCreate(event = {}, context = {}) {
  assertRequired(event.submissionType, "submissionType");
  assertRequired(event.payload, "payload");
  const userId = getUserId(event, context);

  const submission = createSubmission({
    submissionType: event.submissionType,
    userId,
    payload: event.payload,
  });

  return {
    submission: clone(submission),
    message: "submission created",
  };
}

function reviewCreate(event = {}, context = {}) {
  assertRequired(event.snackId, "snackId");
  assertRequired(event.content, "content");
  const userId = getUserId(event, context);

  const store = getStore();
  const snack = store.snacks.get(event.snackId);
  if (!snack || snack.status !== "published") {
    const error = new Error("snack not found");
    error.code = "NOT_FOUND";
    throw error;
  }

  const review = createReview({
    snackId: event.snackId,
    userId,
    content: event.content,
    rating: Number(event.rating || 5),
    tasteTags: event.tasteTags || [],
    sceneTags: event.sceneTags || [],
    images: event.images || [],
  });

  return {
    review: clone(review),
    message: "review created and waiting for audit",
  };
}

function favoriteToggle(event = {}, context = {}) {
  assertRequired(event.snackId, "snackId");
  const userId = getUserId(event, context);
  ensureUser(userId);
  const favorite = toggleFavorite(userId, event.snackId);
  return {
    snackId: event.snackId,
    isFavorite: favorite,
  };
}

function beansRedeem(event = {}, context = {}) {
  assertRequired(event.rewardId, "rewardId");
  const userId = getUserId(event, context);
  const store = getStore();
  const user = ensureUser(userId);
  const reward = store.rewards.find((item) => item.id === event.rewardId);
  if (!reward) {
    const error = new Error("reward not found");
    error.code = "NOT_FOUND";
    throw error;
  }
  if (reward.stock <= 0) {
    const error = new Error("reward out of stock");
    error.code = "OUT_OF_STOCK";
    throw error;
  }
  if (user.beansBalance < reward.beanCost) {
    const error = new Error("insufficient beans");
    error.code = "INSUFFICIENT_BEANS";
    throw error;
  }

  reward.stock -= 1;
  addBeanLog(userId, -reward.beanCost, "reward_redeem", reward.id);
  const order = {
    id: `redeem_${Date.now()}`,
    userId,
    rewardId: reward.id,
    rewardName: reward.name,
    beanCost: reward.beanCost,
    status: "created",
    createdAt: nowIso(),
  };
  store.redemptionOrders.push(order);
  return {
    order: clone(order),
    beansBalance: ensureUser(userId).beansBalance,
  };
}

function adminAuditSubmit(event = {}) {
  assertRequired(event.targetType, "targetType");
  assertRequired(event.targetId, "targetId");
  assertRequired(event.action, "action");

  const store = getStore();
  const action = event.action;
  const result = {};

  if (event.targetType === "submission") {
    const submission = store.submissions.get(event.targetId);
    if (!submission) {
      const error = new Error("submission not found");
      error.code = "NOT_FOUND";
      throw error;
    }
    if (submission.status !== "pending") {
      const error = new Error("submission already audited");
      error.code = "INVALID_STATE";
      throw error;
    }
    submission.status = action === "approve" ? "approved" : "rejected";
    submission.auditReason = event.reason || "";
    submission.updatedAt = nowIso();

    if (action === "approve") {
      if (submission.submissionType === "new_snack") {
        const payload = submission.payload;
        const snackId = `snack_${Date.now()}`;
        store.snacks.set(snackId, {
          id: snackId,
          name: payload.name,
          brand: payload.brand || "Unknown Brand",
          barcode: payload.barcode || "",
          categoryIds: payload.categoryIds || [],
          emotionTags: payload.emotionTags || [],
          topKeywords: payload.topKeywords || [],
          coverImage: payload.coverImage || "",
          gallery: payload.gallery || [],
          priceRange: payload.priceRange || { min: 0, max: 0 },
          aiSummary: payload.aiSummary || "",
          aiReasons: payload.aiReasons || [],
          recommendIndex: Number(payload.recommendIndex || 70),
          status: "published",
          sourceType: "ugc",
          cpsInfo: payload.cpsInfo || {
            platform: "mock-affiliate",
            buyLink: "",
            couponPrice: 0,
            originPrice: 0,
          },
          stats: {
            viewCount: 0,
            favoriteCount: 0,
            reviewCount: 0,
            buyClickCount: 0,
          },
          createdBy: submission.userId,
          publishedAt: nowIso(),
          createdAt: nowIso(),
          updatedAt: nowIso(),
        });
        submission.rewardBeans = 10;
        addBeanLog(submission.userId, 10, "submission_approved", submission.id);
        result.newSnackId = snackId;
      }
      if (submission.submissionType === "photo_only") {
        submission.rewardBeans = 2;
        addBeanLog(submission.userId, 2, "photo_submission_approved", submission.id);
      }
      if (submission.submissionType === "review_only") {
        submission.rewardBeans = 5;
        addBeanLog(submission.userId, 5, "review_submission_approved", submission.id);
      }
    }
  } else if (event.targetType === "review") {
    const review = store.reviews.get(event.targetId);
    if (!review) {
      const error = new Error("review not found");
      error.code = "NOT_FOUND";
      throw error;
    }
    if (review.status !== "pending") {
      const error = new Error("review already audited");
      error.code = "INVALID_STATE";
      throw error;
    }
    review.status = action === "approve" ? "published" : "rejected";
    review.updatedAt = nowIso();
    if (action === "approve") {
      const snack = store.snacks.get(review.snackId);
      if (snack) {
        snack.stats.reviewCount += 1;
        snack.updatedAt = nowIso();
      }
      addBeanLog(review.userId, 5, "review_approved", review.id);
    }
  } else {
    const error = new Error("unsupported targetType");
    error.code = "BAD_REQUEST";
    throw error;
  }

  store.auditRecords.push({
    id: `audit_${Date.now()}`,
    targetType: event.targetType,
    targetId: event.targetId,
    action,
    reason: event.reason || "",
    createdAt: nowIso(),
  });

  return {
    ok: true,
    result,
  };
}

function rankingSync() {
  const rows = buildRanking();
  return {
    count: rows.length,
    rankings: clone(rows),
  };
}

function aiGenerateSummary(event = {}) {
  const name = event.name || "Unknown Snack";
  const tags = event.topKeywords || [];
  const tone = tags.length ? tags.join(", ") : "crispy, tasty, rebuy";
  return {
    summary: `${name} is a user-loved snack with ${tone} profile and strong rebuy intent.`,
    reasons: [
      "Balanced flavor and texture",
      "Fits casual snack scenes",
      "Good coupon value",
    ],
    tags: tags.length ? tags : ["rebuy", "snack"],
  };
}

function cpsBuildLink(event = {}) {
  const snackId = event.snackId || "unknown";
  const source = event.source || "mini-program";
  return {
    snackId,
    source,
    buyLink: `https://example.com/cps/${snackId}?source=${encodeURIComponent(
      source
    )}`,
    expireAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
  };
}

function dashboard() {
  return computeDashboard();
}

module.exports = {
  loginInit,
  homeFeed,
  snackDetail,
  snackSearch,
  submissionCreate,
  reviewCreate,
  favoriteToggle,
  beansRedeem,
  adminAuditSubmit,
  rankingSync,
  aiGenerateSummary,
  cpsBuildLink,
  dashboard,
};

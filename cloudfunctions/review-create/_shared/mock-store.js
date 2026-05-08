const { clone, createId, nowIso } = require("./helpers");

const DEFAULT_CATEGORIES = [
  { id: "cat_overtime", name: "加班续命", type: "emotion" },
  { id: "cat_night", name: "深夜追剧", type: "emotion" },
  { id: "cat_date", name: "约会加分", type: "emotion" },
  { id: "cat_relax", name: "解压神器", type: "emotion" },
];

const DEFAULT_TASKS = [
  { code: "DISCOVER_FIRST", title: "发现宝藏", rewardBeans: 10 },
  { code: "HARDCORE_REVIEW", title: "硬核安利", rewardBeans: 5 },
  { code: "PHOTO_UPLOAD", title: "种草晒图", rewardBeans: 2 },
  { code: "DAILY_CHECKIN", title: "每日签到", rewardBeans: 1 },
];

function createSeedSnacks() {
  const now = nowIso();
  return [
    {
      id: "snack_01",
      name: "海盐薯片",
      brand: "馋嘴猫甄选",
      barcode: "690000000001",
      categoryIds: ["cat_relax"],
      emotionTags: ["解压", "追剧"],
      topKeywords: ["酥脆", "海盐", "回购"],
      coverImage: "https://example.com/snack-01.jpg",
      gallery: [],
      priceRange: { min: 9.9, max: 12.9 },
      aiSummary: "薄脆不油腻，咸淡平衡，越吃越上头。",
      aiReasons: [
        "口感酥脆",
        "咸度适中",
        "回购率高",
      ],
      recommendIndex: 92,
      status: "published",
      sourceType: "seed",
      cpsInfo: {
        platform: "mock-affiliate",
        buyLink: "https://example.com/cps/snack_01",
        couponPrice: 9.9,
        originPrice: 12.9,
      },
      stats: {
        viewCount: 120,
        favoriteCount: 18,
        reviewCount: 2,
        buyClickCount: 8,
      },
      createdBy: "system",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "snack_02",
      name: "抹茶夹心威化",
      brand: "喵爪零食铺",
      barcode: "690000000002",
      categoryIds: ["cat_night"],
      emotionTags: ["深夜", "甜口"],
      topKeywords: ["抹茶", "威化", "下午茶"],
      coverImage: "https://example.com/snack-02.jpg",
      gallery: [],
      priceRange: { min: 15.9, max: 19.9 },
      aiSummary: "抹茶香气浓郁，夹心细腻，甜而不腻。",
      aiReasons: [
        "抹茶味足",
        "层次丰富",
        "办公室囤货友好",
      ],
      recommendIndex: 88,
      status: "published",
      sourceType: "seed",
      cpsInfo: {
        platform: "mock-affiliate",
        buyLink: "https://example.com/cps/snack_02",
        couponPrice: 15.9,
        originPrice: 19.9,
      },
      stats: {
        viewCount: 95,
        favoriteCount: 11,
        reviewCount: 1,
        buyClickCount: 5,
      },
      createdBy: "system",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function createSeedReviews() {
  const now = nowIso();
  return [
    {
      id: "review_01",
      snackId: "snack_01",
      userId: "user_demo",
      content: "真的很脆，追剧一会就能吃完一包。",
      rating: 5,
      tasteTags: ["酥脆"],
      sceneTags: ["追剧"],
      images: [],
      status: "published",
      isFeatured: true,
      likeCount: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "review_02",
      snackId: "snack_01",
      userId: "user_demo_2",
      content: "很适合办公室下午茶，解馋不负担。",
      rating: 4,
      tasteTags: ["咸香"],
      sceneTags: ["办公室"],
      images: [],
      status: "published",
      isFeatured: false,
      likeCount: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "review_03",
      snackId: "snack_02",
      userId: "user_demo",
      content: "夹心很绵密，甜度刚刚好。",
      rating: 4,
      tasteTags: ["香甜"],
      sceneTags: ["下午茶"],
      images: [],
      status: "published",
      isFeatured: false,
      likeCount: 1,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function createEmptyState() {
  return {
    users: new Map(),
    snacks: new Map(),
    reviews: new Map(),
    submissions: new Map(),
    favorites: new Set(),
    beanLogs: [],
    rewards: [
      { id: "reward_01", name: "试吃券", beanCost: 20, stock: 1000 },
      { id: "reward_02", name: "大额优惠券", beanCost: 50, stock: 100 },
    ],
    redemptionOrders: [],
    tasks: clone(DEFAULT_TASKS),
    categories: clone(DEFAULT_CATEGORIES),
    banners: [
      {
        id: "banner_01",
        title: "今日宝藏零食",
        image: "https://example.com/banner-01.jpg",
      },
    ],
    dailyRankings: [],
    cpsClickLogs: [],
    topicFeeds: [
      { id: "topic_01", title: "办公室零食精选", snackIds: ["snack_01"] },
    ],
    auditRecords: [],
  };
}

const state = createEmptyState();

function resetMockStore() {
  const fresh = createEmptyState();
  Object.keys(fresh).forEach((key) => {
    state[key] = fresh[key];
  });

  createSeedSnacks().forEach((snack) => state.snacks.set(snack.id, snack));
  createSeedReviews().forEach((review) => state.reviews.set(review.id, review));

  state.users.set("user_demo", {
    id: "user_demo",
    nickName: "Demo User",
    avatarUrl: "",
    role: "user",
    status: "active",
    beansBalance: 30,
    favoritesCount: 0,
    submissionCount: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
}

function ensureUser(userId) {
  let user = state.users.get(userId);
  if (!user) {
    user = {
      id: userId,
      nickName: "New User",
      avatarUrl: "",
      role: "user",
      status: "active",
      beansBalance: 0,
      favoritesCount: 0,
      submissionCount: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    state.users.set(userId, user);
  }
  return user;
}

function addBeanLog(userId, delta, reason, relatedId) {
  const user = ensureUser(userId);
  user.beansBalance += delta;
  user.updatedAt = nowIso();
  state.beanLogs.push({
    id: createId("beanlog"),
    userId,
    delta,
    reason,
    relatedId: relatedId || "",
    createdAt: nowIso(),
  });
  return user.beansBalance;
}

function isFavorite(userId, snackId) {
  return state.favorites.has(`${userId}:${snackId}`);
}

function toggleFavorite(userId, snackId) {
  const key = `${userId}:${snackId}`;
  const snack = state.snacks.get(snackId);
  if (!snack || snack.status !== "published") {
    const error = new Error("snack not found");
    error.code = "NOT_FOUND";
    throw error;
  }

  if (state.favorites.has(key)) {
    state.favorites.delete(key);
    snack.stats.favoriteCount = Math.max(0, snack.stats.favoriteCount - 1);
    ensureUser(userId).favoritesCount = Math.max(
      0,
      ensureUser(userId).favoritesCount - 1
    );
    return false;
  }

  state.favorites.add(key);
  snack.stats.favoriteCount += 1;
  ensureUser(userId).favoritesCount += 1;
  return true;
}

function getPublishedSnacks() {
  return Array.from(state.snacks.values()).filter(
    (item) => item.status === "published"
  );
}

function createSubmission(payload) {
  const id = createId("submission");
  const record = {
    id,
    submissionType: payload.submissionType,
    userId: payload.userId,
    payload: payload.payload,
    status: "pending",
    auditReason: "",
    rewardBeans: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  state.submissions.set(id, record);
  ensureUser(payload.userId).submissionCount += 1;
  return record;
}

function createReview(payload) {
  const id = createId("review");
  const record = {
    id,
    snackId: payload.snackId,
    userId: payload.userId,
    content: payload.content,
    rating: payload.rating,
    tasteTags: payload.tasteTags || [],
    sceneTags: payload.sceneTags || [],
    images: payload.images || [],
    status: "pending",
    isFeatured: false,
    likeCount: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  state.reviews.set(id, record);
  return record;
}

function computeDashboard() {
  const snacks = getPublishedSnacks();
  const today = nowIso().slice(0, 10);
  const todaySubmissions = Array.from(state.submissions.values()).filter((s) =>
    s.createdAt.startsWith(today)
  ).length;
  const todayReviews = Array.from(state.reviews.values()).filter((r) =>
    r.createdAt.startsWith(today)
  ).length;
  return {
    totalUsers: state.users.size,
    totalSnacks: snacks.length,
    totalReviews: Array.from(state.reviews.values()).filter(
      (item) => item.status === "published"
    ).length,
    todaySubmissions,
    todayReviews,
    topSnacks: snacks
      .slice()
      .sort((a, b) => b.recommendIndex - a.recommendIndex)
      .slice(0, 10)
      .map((item) => ({
        id: item.id,
        name: item.name,
        recommendIndex: item.recommendIndex,
      })),
  };
}

function buildRanking() {
  const rows = getPublishedSnacks()
    .slice()
    .sort((a, b) => b.recommendIndex - a.recommendIndex)
    .map((item, index) => ({
      rank: index + 1,
      snackId: item.id,
      snackName: item.name,
      recommendIndex: item.recommendIndex,
    }));
  state.dailyRankings = rows;
  return rows;
}

function searchSnacks(keyword, categoryId, sort, page, pageSize) {
  let rows = getPublishedSnacks();
  const text = (keyword || "").trim().toLowerCase();
  if (text) {
    rows = rows.filter((item) => {
      const source = `${item.name} ${item.brand} ${item.topKeywords.join(" ")}`.toLowerCase();
      return source.includes(text);
    });
  }
  if (categoryId) {
    rows = rows.filter((item) => item.categoryIds.includes(categoryId));
  }

  const sorter = {
    recommend: (a, b) => b.recommendIndex - a.recommendIndex,
    latest: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
    low_price: (a, b) => a.priceRange.min - b.priceRange.min,
    hot: (a, b) => b.stats.viewCount - a.stats.viewCount,
  }[sort || "recommend"];

  rows = rows.slice().sort(sorter);
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const list = rows.slice(start, start + pageSize);
  return { total, list };
}

function getStore() {
  return state;
}

resetMockStore();

module.exports = {
  getStore,
  resetMockStore,
  ensureUser,
  addBeanLog,
  isFavorite,
  toggleFavorite,
  createSubmission,
  createReview,
  computeDashboard,
  buildRanking,
  searchSnacks,
};

const state = {
  cpsOrders: [],
  snackCount: 2,
  userCount: 1,
  reviewCount: 3,
};

function aiGenerateSummary(payload = {}) {
  const name = payload.name || "Unknown Snack";
  const tags = Array.isArray(payload.topKeywords) ? payload.topKeywords : [];
  const merged = tags.length ? tags.join(", ") : "crispy, rich, rebuy";
  return {
    summary: `${name} is a trending snack with ${merged} profile.`,
    reasons: [
      "Easy to match daily snack scenes",
      "Good price after coupon",
      "Positive user feedback",
    ],
    tags: tags.length ? tags : ["snack", "rebuy"],
  };
}

function cpsBuildLink(payload = {}) {
  const snackId = payload.snackId || "unknown";
  const source = payload.source || "mini-program";
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
  return {
    totalUsers: state.userCount,
    totalSnacks: state.snackCount,
    totalReviews: state.reviewCount,
    todaySubmissions: 0,
    todayReviews: 0,
    topSnacks: [
      { id: "snack_01", name: "Sea Salt Potato Chips", recommendIndex: 92 },
      { id: "snack_02", name: "Matcha Cream Wafer", recommendIndex: 88 },
    ],
  };
}

function ingestCpsOrder(payload = {}) {
  const record = {
    id: `cps_${Date.now()}`,
    orderId: payload.orderId || "",
    snackId: payload.snackId || "",
    amount: Number(payload.amount || 0),
    createdAt: new Date().toISOString(),
  };
  state.cpsOrders.push(record);
  return record;
}

module.exports = {
  aiGenerateSummary,
  cpsBuildLink,
  dashboard,
  ingestCpsOrder,
};

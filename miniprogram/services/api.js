const { callFunction } = require("./cloud");

function loginInit(payload) {
  return callFunction("user-login-init", payload);
}

function getHomeFeed() {
  return callFunction("home-feed");
}

function getSnackDetail(snackId) {
  return callFunction("snack-detail", { snackId });
}

function searchSnacks(params) {
  return callFunction("snack-search", params || {});
}

function createSubmission(data) {
  return callFunction("submission-create", data);
}

function createReview(data) {
  return callFunction("review-create", data);
}

function toggleFavorite(snackId) {
  return callFunction("favorite-toggle", { snackId });
}

function redeemBeans(rewardId) {
  return callFunction("beans-redeem", { rewardId });
}

module.exports = {
  loginInit,
  getHomeFeed,
  getSnackDetail,
  searchSnacks,
  createSubmission,
  createReview,
  toggleFavorite,
  redeemBeans,
};

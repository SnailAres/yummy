import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { resetMockStore } = require("../cloudfunctions/_shared/mock-store");
const loginFn = require("../cloudfunctions/user-login-init/index.js").main;
const homeFn = require("../cloudfunctions/home-feed/index.js").main;
const searchFn = require("../cloudfunctions/snack-search/index.js").main;
const detailFn = require("../cloudfunctions/snack-detail/index.js").main;
const submissionFn = require("../cloudfunctions/submission-create/index.js").main;
const auditFn = require("../cloudfunctions/admin-audit-submit/index.js").main;
const favoriteFn = require("../cloudfunctions/favorite-toggle/index.js").main;
const redeemFn = require("../cloudfunctions/beans-redeem/index.js").main;
const reviewFn = require("../cloudfunctions/review-create/index.js").main;
const rankingFn = require("../cloudfunctions/ranking-sync/index.js").main;

async function invoke(handler, event = {}, context = {}) {
  const result = await handler(event, context);
  assert.equal(result.ok, true, result.error ? result.error.message : "unknown");
  return result.data;
}

async function main() {
  resetMockStore();

  const login = await invoke(loginFn, { userId: "user_test" });
  assert.equal(login.user.id, "user_test");

  const home = await invoke(homeFn);
  assert.ok(home.featured.length >= 1);

  const search = await invoke(searchFn, { keyword: "薯片", page: 1, pageSize: 10 });
  assert.ok(search.total >= 1);

  const submission = await invoke(submissionFn, {
    userId: "user_test",
    submissionType: "new_snack",
    payload: {
      name: "Spicy Rice Crackers",
      brand: "Cat Fire",
      barcode: "690000000099",
      topKeywords: ["spicy", "crunchy"],
      categoryIds: ["cat_overtime"],
      coverImage: "https://example.com/snack-99.jpg",
      priceRange: { min: 8.9, max: 13.9 },
      aiSummary: "Hot and crunchy snack for overtime moments.",
      aiReasons: ["Spicy kick", "Crunchy texture", "Budget friendly"],
      recommendIndex: 84
    }
  });
  assert.equal(submission.submission.status, "pending");

  const audit = await invoke(auditFn, {
    targetType: "submission",
    targetId: submission.submission.id,
    action: "approve"
  });
  assert.ok(audit.result.newSnackId);

  const newSnackId = audit.result.newSnackId;
  const detail = await invoke(detailFn, { snackId: newSnackId, userId: "user_test" });
  assert.equal(detail.snack.id, newSnackId);

  const fav1 = await invoke(favoriteFn, { snackId: newSnackId, userId: "user_test" });
  assert.equal(fav1.isFavorite, true);
  const fav2 = await invoke(favoriteFn, { snackId: newSnackId, userId: "user_test" });
  assert.equal(fav2.isFavorite, false);

  const review = await invoke(reviewFn, {
    userId: "user_test",
    snackId: "snack_01",
    content: "Good crunch and balanced salt.",
    rating: 5
  });
  assert.equal(review.review.status, "pending");
  await invoke(auditFn, {
    targetType: "review",
    targetId: review.review.id,
    action: "approve"
  });

  const ranking = await invoke(rankingFn);
  assert.ok(ranking.count >= 2);

  const redeem = await invoke(redeemFn, {
    userId: "user_demo",
    rewardId: "reward_01"
  });
  assert.equal(redeem.order.rewardId, "reward_01");
  assert.ok(redeem.beansBalance >= 0);

  // eslint-disable-next-line no-console
  console.log("verify complete: cloud functions main flow passed");
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});

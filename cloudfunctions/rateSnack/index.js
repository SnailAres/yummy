// cloudfunctions/rateSnack/index.js（修正版）
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { snackId, score } = event;

  if (!snackId || score < 1 || score > 10) {
    throw new Error('无效参数');
  }

  const existing = await db.collection('ratings')
    .where({ userId: OPENID, snackId })
    .get();

  if (existing.data.length > 0) {
    throw new Error('你已经评过分了');
  }

  await db.collection('ratings').add({
    data: { userId: OPENID, snackId, score, createdAt: new Date() }
  });

  const isRecommend = score >= 7;
  await db.collection('snacks').doc(snackId).update({
    data: {
      totalRatings: db.command.inc(1),
      recommendCount: db.command.inc(isRecommend ? 1 : 0)
    }
  });

  return { success: true };
};
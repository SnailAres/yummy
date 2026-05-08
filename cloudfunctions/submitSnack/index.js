const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { name, brand, imageUrl, initialScore, tastes } = event;

  // 校验
  if (!name || !brand || !imageUrl || !tastes) {
    throw new Error('参数缺失');
  }

  // 创建零食记录（状态 pending）
  const snackRes = await db.collection('snacks').add({
    data: {
      name: name.trim(),
      brand: brand.trim(),
      imageUrl,
      tastes,
      status: 'pending',
      totalRatings: 1,
      recommendCount: initialScore >= 6 ? 1 : 0,
      createdAt: new Date()
    }
  });

  // 记录首次评分
  await db.collection('ratings').add({
    data: {
      userId: OPENID,
      snackId: snackRes._id,
      score: initialScore,
      createdAt: new Date()
    }
  });

  return { success: true };
};
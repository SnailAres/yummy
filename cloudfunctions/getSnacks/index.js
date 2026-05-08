const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { id, keyword } = event;
  let query = db.collection('snacks').where({ status: 'approved' });

  if (id) {
    query = query.where({ _id: id });
  } else if (keyword) {
    query = query.where({
      name: db.RegExp({ regexp: keyword.trim(), options: 'i' })
    });
  }

  return await query.get();
};
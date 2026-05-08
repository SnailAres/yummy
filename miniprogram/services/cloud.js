function unwrapResult(result) {
  if (!result || !result.ok) {
    const message =
      (result && result.error && result.error.message) || "cloud function error";
    throw new Error(message);
  }
  return result.data;
}

function callFunction(name, data) {
  return wx.cloud
    .callFunction({
      name,
      data: data || {},
    })
    .then((res) => unwrapResult(res.result));
}

module.exports = {
  callFunction,
};

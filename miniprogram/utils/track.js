function track(eventName, payload) {
  const data = payload || {};
  // eslint-disable-next-line no-console
  console.log("[track]", eventName, data);
}

module.exports = {
  track,
};

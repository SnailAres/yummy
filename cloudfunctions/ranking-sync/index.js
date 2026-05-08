function loadShared(moduleName) {
  try {
    return require("../_shared/" + moduleName);
  } catch (error) {
    return require("./_shared/" + moduleName);
  }
}

const { rankingSync } = loadShared("business");
const { success, failure } = loadShared("response");

exports.main = async () => {
  try {
    return success(rankingSync());
  } catch (error) {
    return failure(error);
  }
};

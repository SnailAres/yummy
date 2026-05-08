function loadShared(moduleName) {
  try {
    return require("../_shared/" + moduleName);
  } catch (error) {
    return require("./_shared/" + moduleName);
  }
}

const { snackSearch } = loadShared("business");
const { success, failure } = loadShared("response");

exports.main = async (event) => {
  try {
    return success(snackSearch(event));
  } catch (error) {
    return failure(error);
  }
};

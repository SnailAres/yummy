function loadShared(moduleName) {
  try {
    return require("../_shared/" + moduleName);
  } catch (error) {
    return require("./_shared/" + moduleName);
  }
}

const { favoriteToggle } = loadShared("business");
const { success, failure } = loadShared("response");

exports.main = async (event, context) => {
  try {
    return success(favoriteToggle(event, context));
  } catch (error) {
    return failure(error);
  }
};

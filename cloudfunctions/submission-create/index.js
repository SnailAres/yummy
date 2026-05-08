function loadShared(moduleName) {
  try {
    return require("../_shared/" + moduleName);
  } catch (error) {
    return require("./_shared/" + moduleName);
  }
}

const { submissionCreate } = loadShared("business");
const { success, failure } = loadShared("response");

exports.main = async (event, context) => {
  try {
    return success(submissionCreate(event, context));
  } catch (error) {
    return failure(error);
  }
};

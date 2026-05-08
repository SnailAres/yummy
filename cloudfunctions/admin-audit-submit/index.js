function loadShared(moduleName) {
  try {
    return require("../_shared/" + moduleName);
  } catch (error) {
    return require("./_shared/" + moduleName);
  }
}

const { adminAuditSubmit } = loadShared("business");
const { success, failure } = loadShared("response");

exports.main = async (event) => {
  try {
    return success(adminAuditSubmit(event));
  } catch (error) {
    return failure(error);
  }
};

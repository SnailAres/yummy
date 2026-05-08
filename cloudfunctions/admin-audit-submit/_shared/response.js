function success(data) {
  return {
    ok: true,
    data,
  };
}

function failure(error) {
  return {
    ok: false,
    error: {
      code: error.code || "INTERNAL_ERROR",
      message: error.message || "unknown error",
    },
  };
}

module.exports = {
  success,
  failure,
};

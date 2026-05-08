function nowIso() {
  return new Date().toISOString();
}

function createId(prefix) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${random}`;
}

function assertRequired(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    const error = new Error(`${fieldName} is required`);
    error.code = "BAD_REQUEST";
    throw error;
  }
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

module.exports = {
  nowIso,
  createId,
  assertRequired,
  clone,
};

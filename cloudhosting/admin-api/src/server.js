const http = require("http");
const { URL } = require("url");
const {
  aiGenerateSummary,
  cpsBuildLink,
  dashboard,
  ingestCpsOrder,
} = require("./service");

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
      if (Buffer.concat(chunks).length > 1024 * 1024) {
        reject(new Error("body too large"));
      }
    });
    req.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(new Error("invalid json body"));
      }
    });
    req.on("error", reject);
  });
}

async function handle(req, res) {
  const method = req.method || "GET";
  const path = new URL(req.url || "/", "http://localhost").pathname;

  try {
    if (method === "GET" && path === "/healthz") {
      sendJson(res, 200, { ok: true, service: "admin-api" });
      return;
    }

    if (method === "POST" && path === "/ai/snack-summary") {
      const body = await readJson(req);
      sendJson(res, 200, { ok: true, data: aiGenerateSummary(body) });
      return;
    }

    if (method === "POST" && path === "/cps/build-link") {
      const body = await readJson(req);
      sendJson(res, 200, { ok: true, data: cpsBuildLink(body) });
      return;
    }

    if (method === "GET" && path === "/admin/dashboard") {
      sendJson(res, 200, { ok: true, data: dashboard() });
      return;
    }

    if (method === "POST" && path === "/webhook/cps/order") {
      const body = await readJson(req);
      const record = ingestCpsOrder(body);
      sendJson(res, 200, { ok: true, data: record });
      return;
    }

    sendJson(res, 404, { ok: false, error: { code: "NOT_FOUND" } });
  } catch (error) {
    sendJson(res, 400, {
      ok: false,
      error: {
        code: "BAD_REQUEST",
        message: error.message,
      },
    });
  }
}

function createServer() {
  return http.createServer(handle);
}

module.exports = {
  createServer,
};

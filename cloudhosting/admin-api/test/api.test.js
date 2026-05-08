const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("http");
const { createServer } = require("../src/server");

function requestJson(port, method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : "";
    const req = http.request(
      {
        host: "127.0.0.1",
        port,
        path,
        method,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          const json = text ? JSON.parse(text) : {};
          resolve({ status: res.statusCode, body: json });
        });
      }
    );
    req.on("error", reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

test("admin-api routes work", async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  const health = await requestJson(port, "GET", "/healthz");
  assert.equal(health.status, 200);
  assert.equal(health.body.ok, true);

  const ai = await requestJson(port, "POST", "/ai/snack-summary", {
    name: "Almond Cookie",
    topKeywords: ["almond", "crispy"],
  });
  assert.equal(ai.status, 200);
  assert.equal(ai.body.ok, true);
  assert.match(ai.body.data.summary, /Almond Cookie/);

  const cps = await requestJson(port, "POST", "/cps/build-link", {
    snackId: "snack_01",
    source: "test",
  });
  assert.equal(cps.status, 200);
  assert.equal(cps.body.ok, true);
  assert.match(cps.body.data.buyLink, /snack_01/);

  const dashboard = await requestJson(port, "GET", "/admin/dashboard");
  assert.equal(dashboard.status, 200);
  assert.equal(dashboard.body.ok, true);
  assert.ok(dashboard.body.data.totalSnacks >= 1);

  const webhook = await requestJson(port, "POST", "/webhook/cps/order", {
    orderId: "order_001",
    snackId: "snack_01",
    amount: 10,
  });
  assert.equal(webhook.status, 200);
  assert.equal(webhook.body.ok, true);
  assert.equal(webhook.body.data.orderId, "order_001");

  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve()))
  );
});

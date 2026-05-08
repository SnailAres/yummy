const { createServer } = require("./server");

const port = Number(process.env.PORT || 80);
const host = process.env.HOST || "0.0.0.0";
const server = createServer();

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`admin-api listening on ${host}:${port}`);
});

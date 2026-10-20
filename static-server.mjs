import http from "node:http";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "0.0.0.0";
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

function localUrls() {
  const urls = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const item of list || []) {
      if (item.family === "IPv4" && !item.internal) {
        urls.push(`http://${item.address}:${PORT}`);
      }
    }
  }
  return [...new Set(urls)];
}

const server = http.createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("This is a read-only website.");
    return;
  }
  try {
    const url = new URL(request.url, `http://${request.headers.host || HOST}`);
    const pathname =
      url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const target = path.resolve(ROOT, `.${pathname}`);
    if (!target.startsWith(`${ROOT}${path.sep}`)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const stat = await fs.stat(target);
    if (!stat.isFile()) throw new Error("Not a file");
    const data = await fs.readFile(target);
    response.writeHead(200, {
      "Content-Type": TYPES[path.extname(target).toLowerCase()] || "application/octet-stream",
      "Content-Length": data.length,
      "Cache-Control": target.endsWith(".html") ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") response.end();
    else response.end(data);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`只读网站已启动：http://127.0.0.1:${PORT}`);
  for (const url of localUrls()) {
    console.log(`同一 Wi-Fi 手机/电脑访问地址：${url}`);
  }
  console.log("按 Ctrl+C 停止服务。");
});

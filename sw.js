/* 理科基礎マスター Service Worker
   - HTML(ページ遷移) と questions.json は network-first（常に最新を取りに行く）
   - アイコン等の静的アセットは cache-first
   - 更新時は VERSION を上げる。新SWは即時有効化し、ページ側で自動リロードする。 */

const VERSION = "rikakiso-v4";          // ★更新のたびに上げる
const APP_CACHE = `${VERSION}-app`;
const DATA_CACHE = `${VERSION}-data`;

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./offline.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())   // 待機せず即インストール
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== APP_CACHE && k !== DATA_CACHE)
            .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())  // 既存ページをすぐ制御下に
  );
});

// ページ側からの即時切り替え要求
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isHTML(req) {
  return req.mode === "navigate" ||
         (req.headers.get("accept") || "").includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // HTML(ページ) は network-first：新しい index.html を常に優先
  if (isHTML(req)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(APP_CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match("./offline.html")))
    );
    return;
  }

  // questions.json も network-first
  if (url.pathname.endsWith("questions.json")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(DATA_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // それ以外（アイコン等）は cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(APP_CACHE).then((c) => c.put(req, copy));
        return res;
      });
    })
  );
});

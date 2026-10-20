(() => {
  "use strict";

  const runtime = window.NJU_FOOD_MAP_RUNTIME;
  const config = window.NJU_CLOUD_CONFIG || {};
  if (!runtime) return;

  const SESSION_KEY = "nju-food-map-auth-v1";
  const MAX_IMAGES = 6;
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
  const state = {
    session: loadStoredSession(),
    user: null,
    reviews: [],
    reviewsLoaded: false,
    loadingReviews: false,
    reviewError: "",
    activePlaceId: null,
    selectedScore: 0,
    existingImages: [],
    pendingFiles: [],
    previewUrls: [],
    authMode: "login",
    authMessage: "",
    authMessageError: false,
    busy: false,
  };

  const authButton = document.getElementById("communityAuthButton");
  const headerStatus = document.getElementById("communityHeaderStatus");
  let authModal;
  let toastTimer;

  function isConfigured() {
    return Boolean(
      String(config.supabaseUrl || "").trim() &&
        String(config.supabaseAnonKey || "").trim(),
    );
  }

  function cloudBaseUrl() {
    return String(config.supabaseUrl || "").replace(/\/+$/, "");
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeImageUrl(value) {
    try {
      const url = new URL(String(value));
      if (!["http:", "https:"].includes(url.protocol) || !isConfigured()) {
        return "";
      }
      const cloudOrigin = new URL(cloudBaseUrl()).origin;
      const bucket = config.storageBucket || "review-images";
      const expectedPath = `/storage/v1/object/public/${bucket}/`;
      return url.origin === cloudOrigin && url.pathname.startsWith(expectedPath)
        ? url.href
        : "";
    } catch {
      return "";
    }
  }

  function loadStoredSession() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      return parsed?.access_token && parsed?.refresh_token ? parsed : null;
    } catch {
      return null;
    }
  }

  function storeSession(value) {
    state.session = value;
    state.user = value?.user || null;
    try {
      if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      // Signing in still works for this tab when storage is unavailable.
    }
    renderAuthState();
  }

  function sessionFromResponse(payload) {
    if (!payload?.access_token || !payload?.refresh_token) return null;
    return {
      ...payload,
      expires_at:
        Date.now() + Math.max(60, Number(payload.expires_in) || 3600) * 1000,
    };
  }

  function userDisplayName(user = state.user) {
    return (
      user?.user_metadata?.display_name ||
      String(user?.email || "").split("@")[0] ||
      "南大食客"
    );
  }

  function apiError(payload, fallback) {
    return (
      payload?.msg ||
      payload?.message ||
      payload?.error_description ||
      payload?.error ||
      fallback ||
      "请求失败"
    );
  }

  function createReviewId() {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((value) => value.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
      .slice(6, 8)
      .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  }

  async function rawRequest(
    path,
    { method = "GET", body, headers = {}, useUserToken = false } = {},
  ) {
    if (!isConfigured()) throw new Error("云端服务尚未配置");
    const requestHeaders = {
      apikey: config.supabaseAnonKey,
      Authorization: `Bearer ${
        useUserToken && state.session?.access_token
          ? state.session.access_token
          : config.supabaseAnonKey
      }`,
      ...headers,
    };
    let payload = body;
    if (body && !(body instanceof Blob) && !(body instanceof FormData)) {
      requestHeaders["Content-Type"] =
        requestHeaders["Content-Type"] || "application/json";
      payload = JSON.stringify(body);
    }
    const response = await fetch(`${cloudBaseUrl()}${path}`, {
      method,
      headers: requestHeaders,
      body: payload,
      cache: "no-store",
    });
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    if (!response.ok) {
      const error = new Error(apiError(data, `请求失败（${response.status}）`));
      error.status = response.status;
      throw error;
    }
    return data;
  }

  async function refreshSession() {
    if (!state.session?.refresh_token) return null;
    const session = sessionFromResponse(
      await rawRequest("/auth/v1/token?grant_type=refresh_token", {
        method: "POST",
        body: { refresh_token: state.session.refresh_token },
      }),
    );
    if (!session) throw new Error("登录状态已失效，请重新登录");
    if (!session.user) session.user = state.session.user;
    storeSession(session);
    return session;
  }

  async function authorizedRequest(path, options = {}) {
    if (!state.session) throw new Error("请先登录");
    if (Number(state.session.expires_at) <= Date.now() + 60_000) {
      await refreshSession();
    }
    try {
      return await rawRequest(path, { ...options, useUserToken: true });
    } catch (error) {
      if (error.status !== 401) throw error;
      await refreshSession();
      return rawRequest(path, { ...options, useUserToken: true });
    }
  }

  async function signIn(email, password) {
    const session = sessionFromResponse(
      await rawRequest("/auth/v1/token?grant_type=password", {
        method: "POST",
        body: { email, password },
      }),
    );
    if (!session) throw new Error("登录响应不完整，请稍后重试");
    storeSession(session);
    return session;
  }

  async function signUp(email, password, displayName) {
    const result = await rawRequest("/auth/v1/signup", {
      method: "POST",
      body: {
        email,
        password,
        data: { display_name: displayName },
      },
    });
    const session = sessionFromResponse(result);
    if (session) {
      storeSession(session);
      return { active: true };
    }
    return { active: false, user: result?.user || null };
  }

  async function signOut() {
    try {
      if (state.session) {
        await authorizedRequest("/auth/v1/logout", { method: "POST" });
      }
    } catch {
      // Local sign-out must still succeed when the network is unavailable.
    }
    storeSession(null);
    state.reviews = [];
    state.reviewsLoaded = false;
    state.activePlaceId = null;
    runtime.applyUserReviewStats({});
    if (authModal && !authModal.hidden) closeAuthModal();
    showToast("已退出登录");
  }

  function normalizeReview(row) {
    return {
      id: row.id,
      placeId: row.place_id,
      userId: row.user_id,
      score: Number(row.score),
      text: row.text,
      author: row.author || "南大食客",
      images: Array.isArray(row.images) ? row.images : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
    };
  }

  function reviewStats() {
    const grouped = new Map();
    state.reviews.forEach((review) => {
      const current = grouped.get(review.placeId) || { total: 0, count: 0 };
      current.total += review.score;
      current.count += 1;
      grouped.set(review.placeId, current);
    });
    return Object.fromEntries(
      [...grouped].map(([placeId, item]) => [
        placeId,
        { average: item.total / item.count, count: item.count },
      ]),
    );
  }

  function applyReviewStats() {
    runtime.applyUserReviewStats(reviewStats());
  }

  async function loadReviews({ silent = false } = {}) {
    if (!isConfigured() || !state.user || state.loadingReviews) return;
    state.loadingReviews = true;
    state.reviewError = "";
    if (!silent && state.activePlaceId) renderReviewSection(state.activePlaceId);
    try {
      const rows = await authorizedRequest(
        "/rest/v1/food_reviews?select=id,place_id,user_id,score,text,author,images,created_at,updated_at&order=created_at.desc&limit=5000",
      );
      state.reviews = Array.isArray(rows) ? rows.map(normalizeReview) : [];
      state.reviewsLoaded = true;
      applyReviewStats();
    } catch (error) {
      state.reviewError = error.message || "评价读取失败";
      if (state.activePlaceId) renderReviewSection(state.activePlaceId);
    } finally {
      state.loadingReviews = false;
    }
  }

  function injectAuthModal() {
    const wrapper = document.createElement("div");
    wrapper.className = "community-modal";
    wrapper.id = "communityAuthModal";
    wrapper.hidden = true;
    wrapper.innerHTML = `
      <button class="community-modal-backdrop" type="button" data-community-close aria-label="关闭登录窗口"></button>
      <section class="community-auth-card" role="dialog" aria-modal="true" aria-labelledby="communityAuthTitle">
        <button class="community-modal-close" type="button" data-community-close aria-label="关闭">
          <svg aria-hidden="true"><use href="#icon-x"></use></svg>
        </button>
        <p class="community-kicker">南大人的美食地图</p>
        <h2 id="communityAuthTitle">登录后一起写评价</h2>
        <p class="community-auth-intro">每位用户对同一家店保留一条可更新评价，其他登录用户可以看到评分、文字和图片。</p>
        <div class="community-auth-tabs" role="tablist">
          <button class="is-active" type="button" data-auth-mode="login">登录</button>
          <button type="button" data-auth-mode="register">注册</button>
        </div>
        <form class="community-auth-form" id="communityAuthForm">
          <label>
            <span>邮箱</span>
            <input name="email" type="email" autocomplete="email" required placeholder="name@example.com" />
          </label>
          <label id="communityNameField" hidden>
            <span>昵称</span>
            <input name="displayName" type="text" maxlength="24" autocomplete="nickname" placeholder="例如：鼓楼饭搭子" />
          </label>
          <label>
            <span>密码</span>
            <input name="password" type="password" minlength="6" autocomplete="current-password" required placeholder="至少 6 位" />
          </label>
          <p class="community-auth-message" id="communityAuthMessage" aria-live="polite"></p>
          <button class="community-primary-button" id="communityAuthSubmit" type="submit">登录</button>
        </form>
        <div class="community-account-panel" id="communityAccountPanel" hidden>
          <strong id="communityAccountName"></strong>
          <small id="communityAccountEmail"></small>
          <button class="community-secondary-button" id="communitySignOut" type="button">退出登录</button>
        </div>
        <p class="community-privacy-note">仅保存邮箱账号、昵称、评分、评价文字和上传图片。请勿上传包含敏感个人信息的照片。</p>
      </section>
    `;
    document.body.append(wrapper);
    authModal = wrapper;
  }

  function openAuthModal(mode = "login") {
    if (!authModal) injectAuthModal();
    state.authMode = mode;
    state.authMessage = "";
    state.authMessageError = false;
    authModal.hidden = false;
    authModal.classList.add("is-open");
    document.body.classList.add("community-modal-open");
    renderAuthModal();
    window.setTimeout(() => {
      authModal
        .querySelector(state.user ? "#communitySignOut" : 'input[name="email"]')
        ?.focus();
    }, 30);
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove("is-open");
    authModal.hidden = true;
    document.body.classList.remove("community-modal-open");
  }

  function setAuthMode(mode) {
    state.authMode = mode === "register" ? "register" : "login";
    state.authMessage = "";
    state.authMessageError = false;
    renderAuthModal();
  }

  function renderAuthModal() {
    if (!authModal) return;
    const isRegister = state.authMode === "register";
    const form = authModal.querySelector("#communityAuthForm");
    const accountPanel = authModal.querySelector("#communityAccountPanel");
    const tabs = authModal.querySelector(".community-auth-tabs");
    const intro = authModal.querySelector(".community-auth-intro");
    const submit = authModal.querySelector("#communityAuthSubmit");
    const message = authModal.querySelector("#communityAuthMessage");
    const nameField = authModal.querySelector("#communityNameField");
    const password = form.elements.password;

    authModal.querySelectorAll("[data-auth-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.authMode === state.authMode);
    });
    form.hidden = Boolean(state.user);
    accountPanel.hidden = !state.user;
    tabs.hidden = Boolean(state.user);
    intro.hidden = Boolean(state.user);
    nameField.hidden = !isRegister;
    submit.textContent = isRegister ? "创建账号" : "登录";
    password.autocomplete = isRegister ? "new-password" : "current-password";
    message.textContent = isConfigured()
      ? state.authMessage
      : "云端服务尚未配置。请先在 cloud-config.js 中填写 Supabase URL 和 anon key。";
    message.classList.toggle(
      "is-error",
      !isConfigured() || state.authMessageError,
    );
    submit.disabled = !isConfigured() || state.busy;
    form.querySelectorAll("input").forEach((input) => {
      input.disabled = !isConfigured() || state.busy;
    });
    if (state.user) {
      authModal.querySelector("#communityAccountName").textContent =
        userDisplayName();
      authModal.querySelector("#communityAccountEmail").textContent =
        state.user.email || "";
    }
  }

  function renderAuthState() {
    if (!authButton || !headerStatus) return;
    const loggedIn = Boolean(state.user);
    authButton.textContent = loggedIn ? userDisplayName() : "登录 / 注册";
    authButton.classList.toggle("is-authenticated", loggedIn);
    authButton.title = loggedIn ? "查看账号或退出登录" : "登录后发布评价和图片";
    headerStatus.textContent = loggedIn
      ? "已登录"
      : isConfigured()
        ? "游客浏览"
        : "待连接云端";
    headerStatus.classList.toggle("is-online", loggedIn);
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    if (state.busy || !isConfigured()) return;
    const form = event.currentTarget;
    const message = authModal.querySelector("#communityAuthMessage");
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const displayName =
      form.elements.displayName.value.trim() || email.split("@")[0];
    if (!email || password.length < 6) {
      state.authMessage = "请输入有效邮箱和至少 6 位密码。";
      state.authMessageError = true;
      renderAuthModal();
      return;
    }
    state.busy = true;
    renderAuthModal();
    state.authMessage =
      state.authMode === "register" ? "正在创建账号…" : "正在登录…";
    state.authMessageError = false;
    renderAuthModal();
    try {
      if (state.authMode === "register") {
        const result = await signUp(email, password, displayName);
        if (!result.active) {
          state.authMode = "login";
          state.authMessage =
            "注册成功。请先打开验证邮件完成验证，然后再回来登录。";
          state.authMessageError = false;
          renderAuthModal();
          return;
        }
      } else {
        await signIn(email, password);
      }
      closeAuthModal();
      showToast("登录成功，正在同步食客评价");
      await loadReviews();
    } catch (error) {
      state.authMessage = error.message || "操作失败，请稍后重试。";
      state.authMessageError = true;
    } finally {
      state.busy = false;
      renderAuthModal();
    }
  }

  function reviewForCurrentPlace() {
    return state.reviews.find(
      (review) =>
        review.placeId === state.activePlaceId &&
        review.userId === state.user?.id,
    );
  }

  function placeReviews(placeId) {
    return state.reviews.filter((review) => review.placeId === placeId);
  }

  function scoreSummary(reviews) {
    if (!reviews.length) return { count: 0, average: null };
    return {
      count: reviews.length,
      average:
        reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length,
    };
  }

  function formatReviewDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }

  function starButtons(score) {
    return Array.from({ length: 5 }, (_, index) => {
      const value = index + 1;
      return `<button class="community-star${value <= score ? " is-active" : ""}" type="button" data-review-score="${value}" aria-label="${value} 星">★</button>`;
    }).join("");
  }

  function imagePreviews() {
    const existing = state.existingImages.map((url, index) => {
      const safeUrl = safeImageUrl(url);
      if (!safeUrl) return "";
      return `
        <span class="community-image-preview">
          <img src="${escapeHTML(safeUrl)}" alt="已上传的评价图片" />
          <button type="button" data-remove-existing-image="${index}" aria-label="移除图片">×</button>
        </span>`;
    });
    const pending = state.pendingFiles.map((file, index) => {
      const url = URL.createObjectURL(file);
      state.previewUrls.push(url);
      return `
        <span class="community-image-preview">
          <img src="${escapeHTML(url)}" alt="待上传的评价图片" />
          <button type="button" data-remove-pending-image="${index}" aria-label="移除图片">×</button>
        </span>`;
    });
    return [...existing, ...pending].join("");
  }

  function revokePreviewUrls() {
    state.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    state.previewUrls = [];
  }

  function renderReviewList(reviews) {
    if (!reviews.length) {
      return '<div class="community-empty-reviews">还没有食客评价，发布第一条真实体验吧。</div>';
    }
    return reviews
      .map((review) => {
        const images = review.images
          .map(safeImageUrl)
          .filter(Boolean)
          .map(
            (url) =>
              `<a href="${escapeHTML(url)}" target="_blank" rel="noreferrer"><img src="${escapeHTML(url)}" alt="用户上传的评价图片" loading="lazy" /></a>`,
          )
          .join("");
        return `
          <article class="community-review-item">
            <div class="community-review-head">
              <span class="community-avatar">${escapeHTML(
                String(review.author || "食").slice(0, 1),
              )}</span>
              <div>
                <strong>${escapeHTML(review.author)}</strong>
                <small>${escapeHTML(formatReviewDate(review.createdAt))}${
                  review.userId === state.user?.id ? " · 我的评价" : ""
                }</small>
              </div>
              <span class="community-review-score">${"★".repeat(
                review.score,
              )}${"☆".repeat(5 - review.score)}</span>
            </div>
            <p>${escapeHTML(review.text)}</p>
            ${images ? `<div class="community-review-images">${images}</div>` : ""}
          </article>`;
      })
      .join("");
  }

  function renderReviewSection(placeId) {
    const host = document.getElementById("communityReviewSection");
    if (!host || host.dataset.placeId !== placeId) return;
    revokePreviewUrls();
    if (!isConfigured()) {
      host.innerHTML = `
        <div class="community-review-heading"><div><p>食客评价</p><h3>登录后一起写评价</h3></div></div>
        <div class="community-setup-note">
          <strong>云端服务尚未连接</strong>
          <p>管理员需要按照 SUPABASE-SETUP.md 创建数据库与图片存储，并在 cloud-config.js 中填写项目 URL 和 anon key。配置后即可跨 Wi-Fi 同步登录、评分、评价和图片。</p>
        </div>`;
      return;
    }
    if (!state.user) {
      host.innerHTML = `
        <div class="community-review-heading"><div><p>食客评价</p><h3>登录后查看和发布评价</h3></div></div>
        <div class="community-login-prompt">
          <p>登录后可以查看其他食客的评分、文字和图片，也可以为这家店留下自己的真实体验。</p>
          <button type="button" class="community-primary-button" data-community-login>登录 / 注册</button>
        </div>`;
      return;
    }
    if (state.loadingReviews && !state.reviewsLoaded) {
      host.innerHTML = '<div class="community-loading">正在读取食客评价…</div>';
      return;
    }
    const reviews = placeReviews(placeId);
    const own = reviewForCurrentPlace();
    state.selectedScore = own?.score || 0;
    state.existingImages = Array.isArray(own?.images)
      ? own.images.filter(safeImageUrl)
      : [];
    state.pendingFiles = [];
    const summary = scoreSummary(reviews);
    host.innerHTML = `
      <div class="community-review-heading">
        <div>
          <p>食客评价</p>
          <h3>${summary.count ? `${summary.average.toFixed(1)} 分 · ${summary.count} 条评价` : "写下第一条评价"}</h3>
        </div>
        <button type="button" class="community-refresh" data-community-refresh>刷新</button>
      </div>
      ${state.reviewError ? `<p class="community-inline-error">${escapeHTML(state.reviewError)}</p>` : ""}
      <form class="community-review-form" id="communityReviewForm">
        <div class="community-form-title">
          <strong>${own ? "更新我的评价" : "给这家店打分"}</strong>
          <small>同一家店每位用户保留一条评价</small>
        </div>
        <div class="community-star-row" role="radiogroup" aria-label="店铺评分">
          ${starButtons(state.selectedScore)}
          <span id="communityScoreLabel">${state.selectedScore ? `${state.selectedScore} 分` : "点击星星评分"}</span>
        </div>
        <textarea name="text" maxlength="600" required placeholder="口味、环境、服务如何？写下真实体验，帮助后来的人。">${escapeHTML(
          own?.text || "",
        )}</textarea>
        <div class="community-image-toolbar">
          <label class="community-image-upload">
            <input id="communityReviewImages" type="file" accept="image/jpeg,image/png,image/webp" multiple />
            <span>＋ 添加图片</span>
          </label>
          <small>最多 6 张，手机原图会自动压缩</small>
        </div>
        <div class="community-image-preview-list" id="communityImagePreview">${imagePreviews()}</div>
        <div class="community-form-footer">
          <small>发布后会计入用户均分，并影响店铺综合评分。</small>
          <button class="community-submit-review" type="submit">${own ? "更新评价" : "发布评价"}</button>
        </div>
        <p class="community-review-message" id="communityReviewMessage" aria-live="polite"></p>
      </form>
      <div class="community-review-list">${renderReviewList(reviews)}</div>
    `;
  }

  function refreshImagePreview() {
    const preview = document.getElementById("communityImagePreview");
    if (!preview) return;
    revokePreviewUrls();
    preview.innerHTML = imagePreviews();
  }

  function refreshScoreButtons(score) {
    document.querySelectorAll("[data-review-score]").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.reviewScore) <= score);
    });
    const label = document.getElementById("communityScoreLabel");
    if (label) label.textContent = score ? `${score} 分` : "点击星星评分";
  }

  function loadImageElement(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("无法读取这张图片"));
      };
      image.src = url;
    });
  }

  async function compressImage(file) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("仅支持 JPG、PNG 或 WebP 图片");
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("单张图片不能超过 10MB");
    }
    if (file.size <= 1.5 * 1024 * 1024) return file;
    const image = await loadImageElement(file);
    const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    context.fillStyle = "#fffaf2";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob) return file;
    return new File(
      [blob],
      `${file.name.replace(/\.[^.]+$/, "") || "review"}.jpg`,
      { type: "image/jpeg" },
    );
  }

  async function uploadImage(file, objectPath) {
    const bucket = config.storageBucket || "review-images";
    const encodedPath = objectPath
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
    await authorizedRequest(`/storage/v1/object/${bucket}/${encodedPath}`, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "image/jpeg",
        "x-upsert": "false",
      },
      body: file,
    });
    return `${cloudBaseUrl()}/storage/v1/object/public/${bucket}/${encodedPath}`;
  }

  async function uploadPendingImages(placeId, reviewId) {
    const urls = [];
    for (let index = 0; index < state.pendingFiles.length; index += 1) {
      const file = await compressImage(state.pendingFiles[index]);
      const extension =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";
      const stamp = `${Date.now()}-${index}-${Math.random()
        .toString(16)
        .slice(2, 8)}`;
      urls.push(
        await uploadImage(
          file,
          `${state.user.id}/${placeId}/${reviewId}/${stamp}.${extension}`,
        ),
      );
    }
    return urls;
  }

  async function submitReview(event) {
    event.preventDefault();
    if (state.busy || !state.user || !state.activePlaceId) return;
    const form = event.target;
    const message = form.querySelector("#communityReviewMessage");
    const button = form.querySelector(".community-submit-review");
    const text = form.elements.text.value.trim();
    if (!state.selectedScore) {
      message.textContent = "请先点击星星选择 1–5 分。";
      message.classList.add("is-error");
      return;
    }
    if (text.length < 2) {
      message.textContent = "请至少写 2 个字的真实体验。";
      message.classList.add("is-error");
      return;
    }
    state.busy = true;
    button.disabled = true;
    button.textContent = state.pendingFiles.length ? "上传图片中…" : "保存中…";
    message.textContent = "";
    message.classList.remove("is-error");
    try {
      const own = reviewForCurrentPlace();
      const reviewId = own?.id || createReviewId();
      const newImages = await uploadPendingImages(
        state.activePlaceId,
        reviewId,
      );
      const now = new Date().toISOString();
      const row = {
        id: reviewId,
        place_id: state.activePlaceId,
        user_id: state.user.id,
        score: state.selectedScore,
        text,
        author: userDisplayName(),
        images: [...state.existingImages, ...newImages],
        created_at: own?.createdAt || now,
        updated_at: now,
      };
      const result = await authorizedRequest(
        "/rest/v1/food_reviews?on_conflict=place_id,user_id",
        {
          method: "POST",
          headers: {
            Prefer: "resolution=merge-duplicates,return=representation",
          },
          body: row,
        },
      );
      const saved = Array.isArray(result) && result[0] ? normalizeReview(result[0]) : normalizeReview(row);
      state.reviews = state.reviews.filter((review) => review.id !== saved.id);
      state.reviews.unshift(saved);
      state.pendingFiles = [];
      applyReviewStats();
      showToast(own ? "评价已更新，用户均分已重新计算" : "评价已发布");
    } catch (error) {
      message.textContent = error.message || "评价保存失败，请稍后重试。";
      message.classList.add("is-error");
      button.disabled = false;
      button.textContent = reviewForCurrentPlace() ? "更新评价" : "发布评价";
    } finally {
      state.busy = false;
    }
  }

  function showToast(message, isError = false) {
    let toast = document.getElementById("communityToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "communityToast";
      toast.className = "community-toast";
      document.body.append(toast);
    }
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.toggle("is-error", isError);
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(
      () => toast.classList.remove("is-visible"),
      3200,
    );
  }

  async function handleImageSelection(event) {
    const input = event.target;
    const incomingCount = input.files.length;
    const available = MAX_IMAGES - state.existingImages.length - state.pendingFiles.length;
    const incoming = [...input.files].slice(0, Math.max(0, available));
    input.value = "";
    if (!incoming.length) {
      if (available <= 0) showToast(`每条评价最多 ${MAX_IMAGES} 张图片`, true);
      return;
    }
    const accepted = [];
    for (const file of incoming) {
      try {
        accepted.push(await compressImage(file));
      } catch (error) {
        showToast(error.message, true);
      }
    }
    state.pendingFiles.push(...accepted);
    if (available < incomingCount) {
      showToast(`每条评价最多 ${MAX_IMAGES} 张图片`, true);
    }
    refreshImagePreview();
  }

  function handleDocumentClick(event) {
    const loginTrigger = event.target.closest("[data-community-login]");
    if (loginTrigger) {
      openAuthModal("login");
      return;
    }
    if (event.target.closest("[data-community-close]")) {
      closeAuthModal();
      return;
    }
    const authMode = event.target.closest("[data-auth-mode]");
    if (authMode) {
      setAuthMode(authMode.dataset.authMode);
      return;
    }
    const score = event.target.closest("[data-review-score]");
    if (score) {
      state.selectedScore = Number(score.dataset.reviewScore);
      refreshScoreButtons(state.selectedScore);
      return;
    }
    const removeExisting = event.target.closest("[data-remove-existing-image]");
    if (removeExisting) {
      state.existingImages.splice(
        Number(removeExisting.dataset.removeExistingImage),
        1,
      );
      refreshImagePreview();
      return;
    }
    const removePending = event.target.closest("[data-remove-pending-image]");
    if (removePending) {
      state.pendingFiles.splice(
        Number(removePending.dataset.removePendingImage),
        1,
      );
      refreshImagePreview();
      return;
    }
    if (event.target.closest("[data-community-refresh]")) {
      loadReviews({ silent: true });
    }
  }

  async function initialize() {
    injectAuthModal();
    renderAuthState();
    authButton?.addEventListener("click", () => openAuthModal("login"));
    authModal
      ?.querySelector("#communityAuthForm")
      ?.addEventListener("submit", handleAuthSubmit);
    authModal
      ?.querySelector("#communitySignOut")
      ?.addEventListener("click", signOut);
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && authModal && !authModal.hidden) {
        closeAuthModal();
      }
    });
    document.addEventListener("change", (event) => {
      if (event.target.id === "communityReviewImages") handleImageSelection(event);
    });
    document.addEventListener("submit", (event) => {
      if (event.target.id === "communityReviewForm") submitReview(event);
    });
    window.addEventListener("nju:detail-open", (event) => {
      const placeId = event.detail?.placeId;
      if (!placeId) return;
      state.activePlaceId = placeId;
      renderReviewSection(placeId);
      if (state.user && !state.reviewsLoaded) loadReviews();
    });

    if (isConfigured() && state.session) {
      state.user = state.session.user || null;
      renderAuthState();
      try {
        const user = await authorizedRequest("/auth/v1/user");
        if (user?.id) {
          state.user = user;
          state.session.user = user;
          storeSession(state.session);
        }
        await loadReviews({ silent: true });
      } catch {
        storeSession(null);
      }
    }
  }

  initialize();
})();

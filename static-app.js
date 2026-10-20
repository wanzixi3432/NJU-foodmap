(() => {
  "use strict";

  const DATA = window.NANJING_MAP_DATA;
  const GULOU = DATA.campuses.find((campus) => campus.id === "gulou") || {
    lat: 32.0566403,
    lon: 118.7736127,
    shortName: "鼓楼校区",
  };
  const XIANLIN = DATA.campuses.find((campus) => campus.id === "xianlin") || {
    lat: 32.1197422,
    lon: 118.9531432,
    shortName: "仙林校区",
  };
  const CAMPUS_CONFIG = {
    gulou: {
      ...GULOU,
      id: "gulou",
      radius: 2000,
      displayCenter: (() => {
        const display = positionToDisplay([GULOU.lon, GULOU.lat]);
        return [display.lat, display.lng];
      })(),
    },
    xianlin: {
      ...XIANLIN,
      id: "xianlin",
      radius: 3000,
      displayCenter: (() => {
        const display = positionToDisplay([XIANLIN.lon, XIANLIN.lat]);
        return [display.lat, display.lng];
      })(),
    },
  };
  const PLACES = DATA.places.map(normalizePlace);
  const DISPLAY_ROADS = convertGeometry(DATA.roadGeo);
  const DISPLAY_DISTRICTS = convertGeometry(DATA.districtGeo);
  const DISPLAY_STREETS = convertGeometry(DATA.streetGeo);

  const state = {
    search: "",
    filter: "all",
    category: "all",
    sort: "recommended",
    campus: "gulou",
    listLimit: 30,
    selectedId: null,
    markers: new Map(),
  };

  const els = {
    map: document.getElementById("map"),
    mapStatus: document.getElementById("mapStatus"),
    shopSearch: document.getElementById("shopSearch"),
    mapSearch: document.getElementById("mapSearch"),
    category: document.getElementById("categoryFilter"),
    sort: document.getElementById("sortFilter"),
    nearbyLabel: document.getElementById("nearbyLabel"),
    list: document.getElementById("shopList"),
    listEmpty: document.getElementById("listEmpty"),
    resultSummary: document.getElementById("resultSummary"),
    listTitle: document.getElementById("listTitle"),
    totalCount: document.getElementById("totalCount"),
    detail: document.getElementById("detailDrawer"),
    detailContent: document.getElementById("detailContent"),
  };

  let map;
  let districtLayer;
  let streetLayer;
  let markerLayer;
  let selectedMarkerId = null;

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function distanceMeters(lat1, lon1, lat2, lon2) {
    const radius = 6_371_000;
    const radians = Math.PI / 180;
    const dLat = (lat2 - lat1) * radians;
    const dLon = (lon2 - lon1) * radians;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * radians) *
        Math.cos(lat2 * radians) *
        Math.sin(dLon / 2) ** 2;
    return 2 * radius * Math.asin(Math.sqrt(a));
  }

  function wgs84ToGcj02(lon, lat) {
    const a = 6378245;
    const ee = 0.00669342162296594323;
    const x = lon - 105;
    const y = lat - 35;
    const transformLat = (px, py) => {
      let value =
        -100 +
        2 * px +
        3 * py +
        0.2 * py * py +
        0.1 * px * py +
        0.2 * Math.sqrt(Math.abs(px));
      value +=
        ((20 * Math.sin(6 * px * Math.PI) + 20 * Math.sin(2 * px * Math.PI)) *
          2) /
        3;
      value +=
        ((20 * Math.sin(py * Math.PI) + 40 * Math.sin((py / 3) * Math.PI)) *
          2) /
        3;
      value +=
        ((160 * Math.sin((py / 12) * Math.PI) +
          320 * Math.sin((py * Math.PI) / 30)) *
          2) /
        3;
      return value;
    };
    const transformLng = (px, py) => {
      let value =
        300 + px + 2 * py + 0.1 * px * px + 0.1 * px * py + 0.1 * Math.sqrt(Math.abs(px));
      value +=
        ((20 * Math.sin(6 * px * Math.PI) + 20 * Math.sin(2 * px * Math.PI)) *
          2) /
        3;
      value +=
        ((20 * Math.sin(px * Math.PI) + 40 * Math.sin((px / 3) * Math.PI)) *
          2) /
        3;
      value +=
        ((150 * Math.sin((px / 12) * Math.PI) +
          300 * Math.sin((px / 30) * Math.PI)) *
          2) /
        3;
      return value;
    };
    let dLat = transformLat(x, y);
    let dLng = transformLng(x, y);
    const radLat = (lat / 180) * Math.PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180) / (((a * (1 - ee)) / (magic * sqrtMagic)) * Math.PI);
    dLng = (dLng * 180) / ((a / sqrtMagic) * Math.cos(radLat) * Math.PI);
    return [lon + dLng, lat + dLat];
  }

  function positionToDisplay(position) {
    const [lng, lat] = wgs84ToGcj02(Number(position[0]), Number(position[1]));
    return { lng, lat };
  }

  function convertCoordinates(coordinates) {
    if (
      Array.isArray(coordinates) &&
      coordinates.length >= 2 &&
      typeof coordinates[0] === "number"
    ) {
      return wgs84ToGcj02(coordinates[0], coordinates[1]);
    }
    return coordinates.map(convertCoordinates);
  }

  function convertGeometry(geojson) {
    return {
      ...geojson,
      features: geojson.features.map((feature) => ({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: convertCoordinates(feature.geometry.coordinates),
        },
      })),
    };
  }

  function currentCampus() {
    return CAMPUS_CONFIG[state.campus] || CAMPUS_CONFIG.gulou;
  }

  function placeDistance(place, campus = currentCampus()) {
    return campus.id === "xianlin" ? place.distanceXianlin : place.distanceGulou;
  }

  function toFiniteNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function platformRating(place) {
    const meituan = toFiniteNumber(place.meituanRating);
    const dianping = toFiniteNumber(place.dianpingRating);
    const user = toFiniteNumber(place.userRating);
    if (meituan === null || dianping === null) return null;
    return user === null
      ? 0.5 * meituan + 0.5 * dianping
      : 0.2 * meituan + 0.2 * dianping + 0.6 * user;
  }

  function normalizePlace(place) {
    const located =
      place.lat !== null &&
      place.lat !== undefined &&
      place.lat !== "" &&
      place.lon !== null &&
      place.lon !== undefined &&
      place.lon !== "" &&
      Number.isFinite(Number(place.lat)) &&
      Number.isFinite(Number(place.lon));
    const lat = located ? Number(place.lat) : null;
    const lon = located ? Number(place.lon) : null;
    const distanceGulou = located
      ? Math.round(distanceMeters(GULOU.lat, GULOU.lon, lat, lon))
      : null;
    const distanceXianlin = located
      ? Math.round(distanceMeters(XIANLIN.lat, XIANLIN.lon, lat, lon))
      : null;
    const display = located ? positionToDisplay([lon, lat]) : null;
    const normalized = {
      ...place,
      sources: Array.isArray(place.sources) ? place.sources : ["document"],
      located,
      lat,
      lon,
      displayLat: display ? display.lat : null,
      displayLon: display ? display.lng : null,
      distanceGulou,
      distanceXianlin,
      category: place.category || place.categories?.[0] || "其他",
      meituanRating: toFiniteNumber(place.meituanRating),
      dianpingRating: toFiniteNumber(place.dianpingRating),
      userRating: toFiniteNumber(place.userRating),
      userReviewCount: Number.isFinite(Number(place.userReviewCount))
        ? Number(place.userReviewCount)
        : 0,
    };
    normalized.rating = platformRating(normalized);
    delete normalized.baiduRating;
    return normalized;
  }

  function filteredPlaces() {
    const query = state.search.trim().toLowerCase();
    const result = PLACES.filter((place) => {
      if (state.filter === "recommended" && !place.recommended) return false;
      if (state.filter === "board" && !place.sources.includes("board")) return false;
      if (state.filter === "nearby") {
        const distance = placeDistance(place);
        if (!(distance !== null && distance <= currentCampus().radius)) return false;
      }
      if (state.category !== "all" && place.category !== state.category) return false;
      if (!query) return true;
      return [place.name, place.brand, place.category, place.address, place.matchedName, place.area]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

    return result.sort((a, b) => {
      if (state.sort === "recommended") {
        return (
          Number(b.recommended) - Number(a.recommended) ||
          Number(b.rating ?? -1) - Number(a.rating ?? -1) ||
          a.name.localeCompare(b.name, "zh-CN")
        );
      }
      if (state.sort === "distance") {
        return (
          (placeDistance(a) ?? Number.POSITIVE_INFINITY) -
            (placeDistance(b) ?? Number.POSITIVE_INFINITY) ||
          a.name.localeCompare(b.name, "zh-CN")
        );
      }
      if (state.sort === "rating") {
        return (
          Number(b.rating ?? -1) - Number(a.rating ?? -1) ||
          a.name.localeCompare(b.name, "zh-CN")
        );
      }
      return a.name.localeCompare(b.name, "zh-CN");
    });
  }

  function initMap() {
    map = L.map(els.map, {
      center: currentCampus().displayCenter,
      zoom: 14,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
      preferCanvas: true,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);

    map.createPane("majorRoadPane").style.zIndex = "320";
    map.createPane("campusRoadPane").style.zIndex = "325";
    map.createPane("districtPane").style.zIndex = "330";
    map.createPane("streetPane").style.zIndex = "340";

    const tiles = L.tileLayer(
      "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      {
        subdomains: "1234",
        maxZoom: 18,
        attribution:
          '底图 &copy; <a href="https://www.amap.com/" target="_blank" rel="noreferrer">高德地图</a> · 来源：晚自习3432 · 百度地图仅用于地址与定位',
      },
    ).addTo(map);
    let tileErrors = 0;
    let tileLoaded = false;
    tiles.on("load", () => {
      if (tileLoaded) return;
      tileLoaded = true;
      els.mapStatus.textContent = "地图已加载";
      window.setTimeout(() => els.mapStatus.classList.add("is-hidden"), 700);
    });
    tiles.on("tileerror", () => {
      tileErrors += 1;
      if (tileLoaded || tileErrors < 5) return;
      map.removeLayer(tiles);
      els.mapStatus.textContent = "已启用离线道路与街道边界";
      window.setTimeout(() => els.mapStatus.classList.add("is-hidden"), 900);
    });

    const roadStyle = (feature) => {
      const major = feature.properties.layer === "major";
      const highway = feature.properties.highway;
      const weight = /motorway/.test(highway)
        ? major
          ? 2.5
          : 1.9
        : /primary|trunk/.test(highway)
          ? major
            ? 1.7
            : 1.3
          : 0.7;
      return {
        color: major ? "#c6aa82" : "#c7bfb0",
        weight,
        opacity: major ? 0.7 : 0.5,
      };
    };
    L.geoJSON(DISPLAY_ROADS, {
      pane: "majorRoadPane",
      filter: (feature) => feature.properties.layer === "major",
      style: roadStyle,
      interactive: false,
    }).addTo(map);
    L.geoJSON(DISPLAY_ROADS, {
      pane: "campusRoadPane",
      filter: (feature) => feature.properties.layer === "campus",
      style: roadStyle,
      interactive: false,
    }).addTo(map);

    districtLayer = L.geoJSON(DISPLAY_DISTRICTS, {
      pane: "districtPane",
      interactive: false,
      style: {
        color: "rgba(72,84,73,.2)",
        weight: 1,
        fillColor: "#e8e2d6",
        fillOpacity: 0.09,
      },
    }).addTo(map);

    streetLayer = L.geoJSON(DISPLAY_STREETS, {
      pane: "streetPane",
      style: {
        color: "rgba(58,72,61,.4)",
        weight: 1,
        dashArray: "2 3",
        fillColor: "#d85c3d",
        fillOpacity: 0.025,
      },
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(feature.properties.name, {
          sticky: true,
          className: "map-street-tooltip",
        });
        layer.on("mouseover", () =>
          layer.setStyle({
            color: "rgba(216,92,61,.72)",
            weight: 1.6,
            fillOpacity: 0.08,
          }),
        );
        layer.on("mouseout", () => streetLayer.resetStyle(layer));
      },
    }).addTo(map);

    Object.values(CAMPUS_CONFIG).forEach((campus) => {
      const color = campus.id === "xianlin" ? "#297c72" : "#d85c3d";
      L.circle(campus.displayCenter, {
        radius: campus.radius,
        color,
        weight: 1.5,
        dashArray: "5 7",
        fillColor: color,
        fillOpacity: 0.045,
        interactive: false,
      }).addTo(map);
      L.marker(campus.displayCenter, {
        interactive: false,
        icon: L.divIcon({
          className: "",
          html: `<span class="readonly-campus-label">南京大学${campus.shortName} · ${campus.radius / 1000}km圈</span>`,
          iconSize: [166, 30],
          iconAnchor: [83, 15],
        }),
      }).addTo(map);
    });

    markerLayer = L.layerGroup().addTo(map);
    updateMarkers(filteredPlaces());
    window.setTimeout(() => {
      if (els.mapStatus.classList.contains("is-hidden")) return;
      els.mapStatus.textContent = "街道边界与离线道路已加载";
      window.setTimeout(() => els.mapStatus.classList.add("is-hidden"), 600);
    }, 2200);
  }

  function markerIcon(place) {
    return L.divIcon({
      className: `readonly-store-marker${place.recommended ? " is-recommended" : ""}${state.selectedId === place.id ? " is-selected" : ""}`,
      html: place.rating !== null ? place.rating.toFixed(1) : "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }

  function chainMarker(place) {
    const selected = state.selectedId === place.id;
    return L.circleMarker([place.displayLat, place.displayLon], {
      radius: selected ? 7 : 4.5,
      color: selected ? "#d85c3d" : "rgba(255,253,248,.95)",
      weight: selected ? 2.5 : 1,
      fillColor: selected ? "#d85c3d" : "#8a6748",
      fillOpacity: 0.92,
      bubblingMouseEvents: false,
    });
  }

  function updateMarkers(places) {
    if (!markerLayer) return;
    markerLayer.clearLayers();
    state.markers.clear();
    places
      .filter((place) => place.located)
      .forEach((place) => {
        const marker = place.chain
          ? chainMarker(place)
          : L.marker([place.displayLat, place.displayLon], {
              icon: markerIcon(place),
              riseOnHover: true,
              title: place.name,
            });
        marker.on("click", () => openDetail(place.id, false));
        if (place.chain) {
          marker.bindTooltip(`${place.name} · ${place.brand || "知名连锁"}`, {
            direction: "top",
            offset: [0, -4],
          });
        }
        marker.addTo(markerLayer);
        state.markers.set(place.id, marker);
      });
  }

  function renderList(places) {
    els.list.replaceChildren();
    const visible = places.slice(0, state.listLimit);
    visible.forEach((place) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `readonly-card${state.selectedId === place.id ? " is-selected" : ""}`;
      button.dataset.id = place.id;
      button.innerHTML = `
        <span class="readonly-card-main">
          <span class="readonly-card-category">${escapeHTML(place.category)}</span>
          <h3>${escapeHTML(place.name)}</h3>
          <p>${escapeHTML(place.address || place.area || "地址待补充")}</p>
        </span>
        <span class="readonly-card-side">
          <span class="readonly-card-rating${place.rating === null ? " is-pending" : ""}">${place.rating === null ? "待平台核验<small>暂无综合分</small>" : `${place.rating.toFixed(1)}<small>平台综合</small>`}</span>
          <span class="readonly-card-status${place.located ? " located" : ""}">${place.located ? "已定位" : "待定位"}</span>
          ${place.userReviewCount ? `<span class="community-card-review">${place.userReviewCount} 条食客评价</span>` : ""}
        </span>
        <span class="readonly-card-tags">
          <span class="readonly-tag-group">
            <span class="readonly-recommend">${place.recommended ? "★ 红榜推荐" : place.chain ? "连锁分店" : "店铺收录"}</span>
            ${place.chain ? '<span class="readonly-board-badge readonly-chain-badge">知名连锁</span>' : ""}
            ${place.sources.includes("board") ? '<span class="readonly-board-badge">攻略图补充</span>' : ""}
            ${place.sources.includes("user") ? '<span class="readonly-board-badge">本次新增</span>' : ""}
          </span>
          <span class="readonly-distance">${placeDistance(place) !== null ? `距${currentCampus().shortName} ${formatDistance(placeDistance(place))}` : "地图位置待核"}</span>
        </span>
      `;
      button.addEventListener("click", () => openDetail(place.id, true));
      els.list.append(button);
    });
    if (places.length > visible.length) {
      const more = document.createElement("button");
      more.type = "button";
      more.className = "readonly-load-more";
      more.textContent = `再显示 ${Math.min(30, places.length - visible.length)} 家`;
      more.addEventListener("click", () => {
        state.listLimit += 30;
        refresh();
      });
      els.list.append(more);
    }
    els.listEmpty.hidden = places.length > 0;
    els.resultSummary.textContent = `显示 ${Math.min(places.length, visible.length)} / ${places.length} 家 · 已定位 ${places.filter((place) => place.located).length} 家 · 平台分已核验 ${places.filter((place) => place.rating !== null).length} 家`;
    els.listTitle.textContent =
      state.filter === "recommended"
        ? "红榜推荐"
        : state.filter === "board"
          ? "攻略图补充"
          : state.filter === "nearby"
            ? `${currentCampus().shortName} ${currentCampus().radius / 1000}km 内`
            : "全部店铺";
  }

  function formatDistance(distance) {
    return distance >= 1000 ? `${(distance / 1000).toFixed(1)}km` : `${distance}m`;
  }

  function refresh() {
    const places = filteredPlaces();
    renderList(places);
    updateMarkers(places);
  }

  function formatPlatformRating(value) {
    return value === null ? "待核验" : `${value.toFixed(1)} / 5`;
  }

  function openDetail(id, flyTo) {
    const place = PLACES.find((item) => item.id === id);
    if (!place) return;
    state.selectedId = id;
    const campus = currentCampus();
    const meituanKeyword = `${place.name} ${place.address || campus.shortName}`;
    const meituan = `https://i.meituan.com/s/${encodeURIComponent(meituanKeyword)}/`;
    const dianping = place.dianpingId
      ? `https://www.dianping.com/shop/${encodeURIComponent(place.dianpingId)}`
      : `https://www.dianping.com/search/keyword/5/0_${encodeURIComponent(meituanKeyword)}`;
    const distance = placeDistance(place, campus);
    const categoryLabel = place.category.toUpperCase();
    const sourceLabel = place.chain
      ? "知名连锁分店"
      : place.sources.includes("user")
        ? "本次指定补充"
        : place.sources.includes("search")
          ? "仙林 3km 检索补充"
          : place.recommended ? "红榜推荐" : "南京美食整理";
    const platformPolicy = place.userRating === null
      ? "当前没有用户评分，综合分按 0.5×美团 + 0.5×大众点评计算。"
      : "当前存在用户评分，综合分按 0.2×美团 + 0.2×大众点评 + 0.6×用户评分计算。";
    const userRatingLabel = place.userRating === null
      ? "暂无评价"
      : `${place.userRating.toFixed(1)} / 5`;
    const userRatingHint = place.userReviewCount
      ? `${place.userReviewCount} 人评价 · 60% 权重`
      : "登录后可发布第一条评价";
    const platformState = place.rating === null
      ? "尚未同时核验到美团与大众点评评分，因此暂不生成综合分。"
      : "美团与大众点评评分均已核验，综合分已按既定权重计算。";
    const detailUrl = place.detailUrl || `https://map.baidu.com/search/${encodeURIComponent(`${place.name} 南京`)}/`;

    els.detailContent.innerHTML = `
      <header class="readonly-detail-hero">
        <p>${escapeHTML(categoryLabel)}</p>
        <h2 id="detailName">${escapeHTML(place.name)}</h2>
        <small>${escapeHTML(place.area || "南京")} · ${escapeHTML(sourceLabel)}${distance !== null ? ` · 距${escapeHTML(campus.shortName)} ${formatDistance(distance)}` : ""}</small>
      </header>
      <section class="readonly-detail-score">
        <strong>${place.rating === null ? "待核验" : place.rating.toFixed(1)}</strong>
        <div>
          <span>平台综合评分</span>
          <small>${escapeHTML(platformState)}</small>
        </div>
      </section>
      <div class="readonly-platform-scores">
        <div><span>美团</span><strong>${formatPlatformRating(place.meituanRating)}</strong></div>
        <div><span>大众点评</span><strong>${formatPlatformRating(place.dianpingRating)}</strong></div>
        <div><span>用户评分</span><strong>${userRatingLabel}</strong><small>${userRatingHint}</small></div>
      </div>
      <p class="readonly-unlocated-note">${escapeHTML(platformPolicy)} ${escapeHTML(platformState)}</p>
      <section class="readonly-detail-section">
        <h3>地址与定位</h3>
        <div class="readonly-detail-address">
          ${escapeHTML(place.address || (place.located ? "百度地图已定位，详细门牌待补充" : "暂未找到可靠地址，请使用下方按钮手动查询"))}
        </div>
        <a class="readonly-platform-link" style="margin-top:9px" href="${escapeHTML(detailUrl)}" target="_blank" rel="noreferrer">在百度地图查看定位<svg aria-hidden="true"><use href="#icon-external"></use></svg></a>
        <p class="readonly-unlocated-note">百度地图仅用于地址、坐标与位置核验；百度评分不展示，也不参与本页评分。</p>
      </section>
      <section class="readonly-detail-section">
        <h3>平台评价</h3>
        <div class="readonly-platform-grid">
          <a class="readonly-platform-link" href="${escapeHTML(meituan)}" target="_blank" rel="noreferrer">美团查看<svg aria-hidden="true"><use href="#icon-external"></use></svg></a>
          <a class="readonly-platform-link" href="${escapeHTML(dianping)}" target="_blank" rel="noreferrer">大众点评查看<svg aria-hidden="true"><use href="#icon-external"></use></svg></a>
        </div>
        <p class="readonly-unlocated-note">平台会进行访问验证。仅在同时取得美团和大众点评评分后，本页才展示综合分。</p>
      </section>
      <section class="readonly-detail-section">
        <h3>评语与来源备注</h3>
        <div class="readonly-detail-comment">${escapeHTML(place.note || place.originalLine || "暂无补充评语")}</div>
        ${
          place.sources.includes("board")
            ? `<p class="readonly-unlocated-note">攻略图距离区间：${escapeHTML((place.boardDistanceBands?.length ? place.boardDistanceBands : [place.boardDistanceBand]).filter(Boolean).join(" / ") || "未标注")}。距离仅作出行参考。</p>`
            : ""
        }
      </section>
      <section class="community-review-host" id="communityReviewSection" data-place-id="${escapeHTML(place.id)}">
        <div class="community-loading">正在连接食客评价…</div>
      </section>
    `;
    els.detail.classList.add("is-open");
    els.detail.setAttribute("aria-hidden", "false");
    els.detail.dataset.placeId = id;
    document.querySelectorAll(".readonly-card").forEach((card) => {
      card.classList.toggle("is-selected", card.dataset.id === id);
    });
    updateMarkers(filteredPlaces());
    window.dispatchEvent(
      new CustomEvent("nju:detail-open", { detail: { placeId: id } }),
    );
    if (flyTo && place.located) {
      map.flyTo([place.displayLat, place.displayLon], 16, { duration: 0.7 });
    }
  }

  function closeDetail() {
    els.detail.classList.remove("is-open");
    els.detail.setAttribute("aria-hidden", "true");
    state.selectedId = null;
    updateMarkers(filteredPlaces());
    document
      .querySelectorAll(".readonly-card.is-selected")
      .forEach((card) => card.classList.remove("is-selected"));
  }

  function resetFilters() {
    state.search = "";
    state.filter = "all";
    state.category = "all";
    state.sort = "recommended";
    state.listLimit = 30;
    els.shopSearch.value = "";
    els.mapSearch.value = "";
    els.category.value = "all";
    els.sort.value = "recommended";
    document.querySelectorAll(".readonly-tabs button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === "all");
    });
    refresh();
  }

  function updateCampusControls() {
    document.querySelectorAll(".readonly-campus-switch button").forEach((button) => {
      const active = button.dataset.campus === state.campus;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const campus = currentCampus();
    els.nearbyLabel.textContent = `${campus.radius / 1000}km 内`;
  }

  function selectCampus(id, shouldFly = true) {
    if (!CAMPUS_CONFIG[id] || state.campus === id) {
      if (shouldFly) {
        const campus = currentCampus();
        map.flyTo(campus.displayCenter, campus.id === "xianlin" ? 13 : 14, { duration: 0.7 });
      }
      return;
    }
    state.campus = id;
    state.listLimit = 30;
    closeDetail();
    updateCampusControls();
    refresh();
    if (shouldFly) {
      const campus = currentCampus();
      map.flyTo(campus.displayCenter, campus.id === "xianlin" ? 13 : 14, { duration: 0.7 });
    }
  }

  function bindUI() {
    els.totalCount.textContent = PLACES.length;
    [...new Set(PLACES.map((place) => place.category))]
      .sort((a, b) => a.localeCompare(b, "zh-CN"))
      .forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        els.category.append(option);
      });

    els.shopSearch.addEventListener("input", () => {
      state.search = els.shopSearch.value;
      els.mapSearch.value = state.search;
      state.listLimit = 30;
      refresh();
    });
    els.mapSearch.addEventListener("input", () => {
      state.search = els.mapSearch.value;
      els.shopSearch.value = state.search;
      state.listLimit = 30;
      refresh();
    });
    els.category.addEventListener("change", () => {
      state.category = els.category.value;
      state.listLimit = 30;
      refresh();
    });
    els.sort.addEventListener("change", () => {
      state.sort = els.sort.value;
      refresh();
    });
    updateCampusControls();
    document.querySelectorAll(".readonly-campus-switch button").forEach((button) => {
      button.addEventListener("click", () => selectCampus(button.dataset.campus));
    });
    document.querySelectorAll(".readonly-tabs button").forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        state.listLimit = 30;
        document.querySelectorAll(".readonly-tabs button").forEach((item) => {
          item.classList.toggle("is-active", item === button);
        });
        refresh();
      });
    });
    document.getElementById("resetFilters").addEventListener("click", resetFilters);
    document.getElementById("closeDetail").addEventListener("click", closeDetail);
    document.getElementById("fitCampus").addEventListener("click", () => {
      const campus = currentCampus();
      map.flyTo(campus.displayCenter, campus.id === "xianlin" ? 13 : 14, { duration: 0.7 });
    });
    document.getElementById("toggleBoundaries").addEventListener("click", (event) => {
      const button = event.currentTarget;
      const active = button.classList.toggle("is-active");
      if (active) streetLayer.addTo(map);
      else map.removeLayer(streetLayer);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDetail();
    });
    map.on("click", closeDetail);
  }

  function init() {
    initMap();
    bindUI();
    refresh();
    const located = PLACES.filter((place) => place.located);
    const bounds = L.latLngBounds(
      located.map((place) => [place.displayLat, place.displayLon]),
    );
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.08), { maxZoom: 14 });
    }
  }

  function applyUserReviewStats(stats = {}) {
    PLACES.forEach((place) => {
      const review = stats[place.id];
      place.userRating = toFiniteNumber(review?.average);
      place.userReviewCount = Number(review?.count) || 0;
      place.rating = platformRating(place);
    });
    refresh();
    if (state.selectedId) openDetail(state.selectedId, false);
  }

  window.NJU_FOOD_MAP_RUNTIME = {
    applyUserReviewStats,
    openDetail,
    refresh,
    getPlace: (id) => PLACES.find((place) => place.id === id) || null,
  };

  init();
})();

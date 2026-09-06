/* ============================================================
   neochi HP
   ------------------------------------------------------------
   ▼ SNS リンク : URL が決まったらここに貼るだけ。空文字なら
     「準備中」トーストが出ます。（sns5 = 構成画像いちばん右のアイコン）
   ============================================================ */
const SNS_URLS = {
  x:         "https://x.com/_toki_s",
  instagram: "https://www.instagram.com/_toki_s",
  youtube:   "https://www.youtube.com/@_toki_s",
  tiktok:    "https://www.tiktok.com/@_toki_s_",
  suzuri:    "https://suzuri.jp/s_toki_",
  cat:       "https://www.tiktok.com/@uminohibi",  // 猫のイラスト
  contact:   "https://forms.gle/TwyZodBjQKFjY3rs8" // 右下フローティング（お問い合わせフォーム）
};

const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

/* ---------- ファーストビュー / プリローダー ---------- */
(function preloader(){
  const el = document.getElementById("preloader");
  if (!el) return;
  const MIN = reduce ? 500 : 1900;            // 最低表示時間（ローディングバーと同調）
  const start = performance.now();
  function finish(){
    const wait = Math.max(0, MIN - (performance.now() - start));
    setTimeout(() => {
      el.classList.add("is-done");
      document.body.classList.remove("is-loading");
      setTimeout(() => el.remove(), 700);
    }, wait);
  }
  if (document.readyState === "complete") finish();
  else addEventListener("load", finish, { once: true });
  // 保険：load が来なくても必ず解除
  setTimeout(finish, 6000);
})();

/* ---------- nav: 背景を濃くする ---------- */
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
onScroll();
addEventListener("scroll", onScroll, { passive:true });

/* ---------- nav: ハンバーガーメニュー（スマホ） ---------- */
(function navMenu(){
  const burger = document.getElementById("navBurger");
  const links  = document.getElementById("navLinks");
  if (!nav || !burger || !links) return;
  const setOpen = (open) => {
    nav.classList.toggle("is-menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!nav.classList.contains("is-menu-open"));
  });
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-menu-open") && !nav.contains(e.target)) setOpen(false);
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  const mq = matchMedia("(min-width:721px)");
  (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))
    ((e) => { if (e.matches) setOpen(false); });
})();

/* ---------- 言語切り替え（JA / KO / EN） ---------- */
(function i18n(){
  const KEY = "neochi:lang";
  const SUPPORTED = ["ja", "ko", "en"];
  const DICT = {
    ja: {
      "meta.desc":     "ねむりたいときにねろ。",
      "yt.next":       "別の動画をランダム再生 ▶",
      "nav.menu":      "メニュー",
      "fx.toggle":     "カーソルの星 ON / OFF",
      "lb.close":      "閉じる",
      "contact.aria":  "CONTACT（お問い合わせフォーム）",
      "shop.aria":     "neochi STORES へ",
      "shop.alt":      "neochi のグッズ",
      "sns.cat":       "猫のイラスト（uminohibi）"
    },
    ko: {
      "meta.desc":     "자고 싶을 때 자라.",
      "yt.next":       "다른 영상 랜덤 재생 ▶",
      "nav.menu":      "메뉴",
      "fx.toggle":     "커서 별 ON / OFF",
      "lb.close":      "닫기",
      "contact.aria":  "CONTACT (문의 폼)",
      "shop.aria":     "neochi STORES로 이동",
      "shop.alt":      "neochi 굿즈",
      "sns.cat":       "고양이 일러스트 (uminohibi)"
    },
    en: {
      "meta.desc":     "Sleep when you feel sleepy.",
      "yt.next":       "Play another random video ▶",
      "nav.menu":      "Menu",
      "fx.toggle":     "Cursor stars ON / OFF",
      "lb.close":      "Close",
      "contact.aria":  "Contact (inquiry form)",
      "shop.aria":     "Go to neochi STORES",
      "shop.alt":      "neochi merch",
      "sns.cat":       "Cat illustration (uminohibi)"
    }
  };

  function detect(){
    try { const s = localStorage.getItem(KEY); if (SUPPORTED.includes(s)) return s; } catch (e) {}
    const n = (navigator.language || "ja").slice(0, 2).toLowerCase();
    return SUPPORTED.includes(n) ? n : "ja";
  }

  let lang = detect();

  function apply(){
    const d = DICT[lang] || DICT.ja;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const v = d[el.dataset.i18n]; if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      const v = d[el.dataset.i18nAria]; if (v != null) el.setAttribute("aria-label", v);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const v = d[el.dataset.i18nTitle]; if (v != null) el.setAttribute("title", v);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(el => {
      const v = d[el.dataset.i18nAlt]; if (v != null) el.setAttribute("alt", v);
    });
    const md = document.querySelector('meta[name="description"]');
    if (md && d["meta.desc"]) md.setAttribute("content", d["meta.desc"]);

    // 日本語は画像のロゴタイプ、それ以外はテキストに切り替え
    const isJa = lang === "ja";
    document.querySelectorAll("[data-lang-img]").forEach(el => { el.hidden = !isJa; });
    document.querySelectorAll("[data-lang-txt]").forEach(el => { el.hidden = isJa; });

    document.querySelectorAll(".langsw__b").forEach(b => {
      b.setAttribute("aria-current", String(b.dataset.lang === lang));
    });
  }

  document.querySelectorAll(".langsw__b").forEach(b => {
    b.addEventListener("click", () => {
      lang = b.dataset.lang;
      try { localStorage.setItem(KEY, lang); } catch (e) {}
      apply();
    });
  });
  apply();
})();

/* ---------- SNS リンク割り当て ---------- */
const toast = document.getElementById("toast");
let toastT;
function showToast(msg){
  toast.textContent = msg;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("is-show"));
  clearTimeout(toastT);
  toastT = setTimeout(() => {
    toast.classList.remove("is-show");
    setTimeout(() => (toast.hidden = true), 300);
  }, 2200);
}

document.querySelectorAll("[data-sns]").forEach(a => {
  const key = a.dataset.sns;
  const url = SNS_URLS[key];
  if (url){
    a.href = url;
    if (!url.startsWith("#") && !url.startsWith("mailto:")){
      a.target = "_blank";
      a.rel = "noopener";
    }
  } else {
    a.addEventListener("click", e => {
      if (a.getAttribute("href") === "#contact") return; // フッターへスクロールは許可
      e.preventDefault();
      showToast("リンクは準備中です");
    });
  }
});

/* ---------- TOP: 周りの画像をたまにバグらせる ---------- */
const stage = document.getElementById("stage");
const rects = [...document.querySelectorAll(".rectwrap[data-rect]")];

function glitchOnce(){
  const n = Math.random() < 0.35 ? 2 : 1;
  const pool = [...rects];
  for (let i = 0; i < n && pool.length; i++){
    const el = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
    el.classList.remove("is-glitch");
    void el.offsetWidth;            // reflow: アニメを確実に再生
    el.classList.add("is-glitch");
    setTimeout(() => el.classList.remove("is-glitch"), 520);
  }
  if (Math.random() < 0.12){
    stage.classList.add("is-glitch");
    setTimeout(() => stage.classList.remove("is-glitch"), 340);
  }
}
function glitchLoop(){
  glitchOnce();
  setTimeout(glitchLoop, 1800 + Math.random() * 3600); // 約1.8〜5.4秒ごと
}
if (!reduce) setTimeout(glitchLoop, 1600);

/* ---------- GALLERY: ランダム表示 + 散らした「机の上」レイアウト ---------- */
const GALLERY_COUNT = 17;                       // img/gallery/g0.jpg 〜 g16.jpg
const board = document.getElementById("galBoard");

function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const order = shuffle([...Array(GALLERY_COUNT).keys()]);
function buildGallery(){
  if (!board) return;
  const frag = document.createDocumentFragment();
  const rnd = (n) => (Math.random() * 2 - 1) * n;
  order.forEach((idx, i) => {
    const fig = document.createElement("figure");
    fig.className = "gboard__item";
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", "写真を拡大");
    fig.style.setProperty("--rot", rnd(3.4).toFixed(2) + "deg");
    fig.style.setProperty("--tx",  rnd(12).toFixed(0) + "px");
    fig.style.setProperty("--ty",  rnd(10).toFixed(0) + "px");
    fig.style.transitionDelay = ((i % 8) * 55) + "ms";
    fig.innerHTML = `<img loading="lazy" src="img/gallery/g${idx}.jpg" alt="">`;
    fig.addEventListener("click", () => openLightbox(idx));
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openLightbox(idx); }
    });
    frag.appendChild(fig);
  });
  board.appendChild(frag);

  const items = board.querySelectorAll(".gboard__item");
  if ("IntersectionObserver" in window && !reduce){
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => {
        if (en.isIntersecting){ en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add("is-in"));
  }
}
buildGallery();

/* ---------- lightbox ---------- */
const lb = document.getElementById("lb");
const lbImg = document.getElementById("lbImg");
function openLightbox(idx){
  lbImg.src = `img/gallery/g${idx}.jpg`;
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLightbox(){
  lb.hidden = true;
  lbImg.src = "";
  document.body.style.overflow = "";
}
document.getElementById("lbClose").addEventListener("click", closeLightbox);
lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) closeLightbox(); });

/* ---------- SNS: YouTube (@_toki_s) をランダム再生 ---------- */
(function ytRandom(){
  const mount = document.getElementById("ytPlayer");
  if (!mount) return;

  // @_toki_s の動画（この4本をランダムで回す）
  const VIDEOS = [
    "VOxZiPAvlIs",
    "XO-vWkVFCPM",
    "0mmgwWmLSqk",
    "8FQadm-0fRc"
  ];

  let queue = [];
  let current = null;
  function nextId(){
    if (!queue.length){
      queue = shuffle(VIDEOS.slice());
      if (queue[queue.length - 1] === current && queue.length > 1){
        [queue[0], queue[queue.length - 1]] = [queue[queue.length - 1], queue[0]];
      }
    }
    current = queue.pop();
    return current;
  }

  const btn = document.getElementById("ytNext");
  const isFile = location.protocol === "file:";

  // file:// で開くと YouTube 埋め込みは動かない（origin が null）。サムネのリンクで代替。
  if (isFile){
    const box = mount.parentElement;                // .ytbox
    function showThumb(){
      const id = nextId();
      box.innerHTML =
        '<a href="https://youtu.be/' + id + '" target="_blank" rel="noopener" class="ytbox__thumb">' +
        '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="動画を見る">' +
        '<span>▶ YouTube で見る</span></a>';
    }
    showThumb();
    if (btn) btn.addEventListener("click", showThumb);
    return;
  }

  let player = null;
  window.onYouTubeIframeAPIReady = function(){
    player = new YT.Player("ytPlayer", {
      host: "https://www.youtube-nocookie.com",
      videoId: nextId(),
      playerVars: {
        rel: 0, modestbranding: 1, playsinline: 1,
        origin: location.origin
      },
      events: {
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) player.loadVideoById(nextId());
        }
      }
    });
  };

  if (btn) btn.addEventListener("click", () => {
    if (player && player.loadVideoById) player.loadVideoById(nextId());
  });

  const s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  s.async = true;
  document.head.appendChild(s);
})();

/* ---------- カーソルの星トレイル（ヘッダーの星でON/OFF） ---------- */
(function cursorStars(){
  const fx = document.getElementById("cursorFx");
  const toggle = document.getElementById("fxToggle");
  const envOK = !reduce && window.matchMedia && matchMedia("(pointer:fine)").matches;

  let fxOn = true;
  try { fxOn = localStorage.getItem("neochi:cursorFx") !== "off"; } catch (e) {}

  function reflect(){ if (toggle) toggle.setAttribute("aria-pressed", String(fxOn)); }
  reflect();

  if (toggle){
    toggle.addEventListener("click", () => {
      fxOn = !fxOn;
      try { localStorage.setItem("neochi:cursorFx", fxOn ? "on" : "off"); } catch (e) {}
      reflect();
      if (!fxOn && fx) fx.replaceChildren();   // 出ている星を即消し
    });
  }

  if (!fx || !envOK) return;   // トグルUIは有効。演出は対応環境のときだけ動かす

  let last = 0, lastX = 0, lastY = 0, alive = 0;
  const rot = () => (Math.random() * 230 - 115).toFixed(0) + "deg";

  addEventListener("pointermove", e => {
    if (!fxOn) return;
    if (e.pointerType && e.pointerType !== "mouse") return;
    const now = performance.now();
    const moved = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (now - last < 45 || moved < 6) return;      // 間引き
    last = now; lastX = e.clientX; lastY = e.clientY;
    if (alive > 26) return;                        // 同時数の上限
    spawn(e.clientX, e.clientY);
  }, { passive: true });

  function spawn(x, y){
    const s = document.createElement("span");
    const size = 12 + Math.random() * 20;
    s.style.left = (x + (Math.random() * 10 - 5)).toFixed(0) + "px";
    s.style.top  = (y + (Math.random() * 10 - 5)).toFixed(0) + "px";
    s.style.setProperty("--s",  size.toFixed(1) + "px");
    s.style.setProperty("--r0", rot());
    s.style.setProperty("--r1", rot());
    s.style.setProperty("--r2", rot());
    s.style.setProperty("--dx", (Math.random() * 16 - 8).toFixed(0) + "px");
    s.style.setProperty("--dy", (18 + Math.random() * 22).toFixed(0) + "px");
    s.style.setProperty("--d",  (700 + Math.random() * 500).toFixed(0) + "ms");
    fx.appendChild(s);
    alive++;
    s.addEventListener("animationend", () => { s.remove(); alive--; });
  }
})();

/* ---------- スクロールで登場 + ナビ現在地 ---------- */
(function scrollFx(){
  // 登場
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !reduce){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting){
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("is-in"));
  }

  // ナビ現在地（scrollspy）
  const links = new Map();
  document.querySelectorAll('.nav__links a[href^="#"]').forEach(a => {
    links.set(a.getAttribute("href").slice(1), a);
  });
  const sections = [...document.querySelectorAll("main section[id]")]
    .filter(s => links.has(s.id));
  if (sections.length && "IntersectionObserver" in window){
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting){
          links.forEach(a => a.classList.remove("is-active"));
          links.get(en.target.id)?.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }
})();

/* ---------- TOP: パララックス + 空が白へ溶ける ---------- */
(function topScroll(){
  const st = document.getElementById("stage");
  const top = document.querySelector(".top");
  if (!st && !top) return;
  let ticking = false;
  function apply(){
    ticking = false;
    const vh = window.innerHeight || 1;
    const y = window.scrollY;

    if (!reduce && st){
      const py = Math.min(y, vh * 1.2);
      st.style.setProperty("--pbg", (py *  0.15).toFixed(1) + "px");
      st.style.setProperty("--pmid",(py *  0.07).toFixed(1) + "px");
      st.style.setProperty("--pfg", (py * -0.03).toFixed(1) + "px");
    }

    // 空 → SNS(#fafbfb) へ。後半で一気に効くよう p^2 でイージング
    if (top){
      const p = Math.min(Math.max(y / vh, 0), 1);
      top.style.setProperty("--top-fade", (p * p).toFixed(3));
    }
  }
  addEventListener("scroll", () => {
    if (!ticking){ ticking = true; requestAnimationFrame(apply); }
  }, { passive: true });
  addEventListener("resize", apply, { passive: true });
  apply();
})();

/* ---------- 歪むグリッド背景（負荷対策） ---------- */
(function warpGrid(){
  const svg = document.querySelector(".svg-defs");
  const mid = document.querySelector(".mid");
  if (!svg) return;

  // reduced-motion なら SMIL アニメを止めて静的な歪みに
  if (reduce){
    svg.querySelectorAll("animate").forEach(a => a.remove());
    try { svg.pauseAnimations(); } catch (e) {}
    return;
  }

  let onScreen = true;
  // 画面外のあいだはアニメを止める
  if (mid && "IntersectionObserver" in window && svg.pauseAnimations){
    const io = new IntersectionObserver(([en]) => {
      onScreen = en.isIntersecting;
      if (onScreen) svg.unpauseAnimations(); else svg.pauseAnimations();
    }, { rootMargin: "200px 0px" });
    io.observe(mid);
  }

  /* ---- カーソルに反応して歪む ---- */
  const disp = svg.querySelector("feDisplacementMap");
  const grid = document.querySelector(".warp-grid");
  if (disp && grid && mid && matchMedia("(pointer:fine)").matches){
    const BASE = 24, MAX = 66, clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    let cur = BASE, target = BASE, gx = 0, gy = 0, tgx = 0, tgy = 0;
    let lastX = 0, lastY = 0, lastT = 0, raf = 0;

    function onMove(e){
      if (!onScreen) return;
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt;  // px/ms
      lastX = e.clientX; lastY = e.clientY; lastT = now;

      target = clamp(BASE + speed * 60, BASE, MAX);            // 速く動かすほど大きく歪む
      const r = mid.getBoundingClientRect();
      tgx = clamp(((e.clientX - (r.left + r.width / 2)) / r.width) * 22, -16, 16);
      tgy = clamp(((e.clientY - (r.top + r.height / 2)) / r.height) * 22, -16, 16);

      if (!raf) raf = requestAnimationFrame(tick);
    }
    function tick(){
      raf = 0;
      cur += (target - cur) * 0.14;
      target += (BASE - target) * 0.05;      // 手を止めると徐々に落ち着く
      gx += (tgx - gx) * 0.09;
      gy += (tgy - gy) * 0.09;
      disp.setAttribute("scale", cur.toFixed(1));
      grid.style.transform = "translate(" + gx.toFixed(1) + "px," + gy.toFixed(1) + "px)";
      if (Math.abs(target - cur) > 0.15 || Math.abs(cur - BASE) > 0.15 ||
          Math.hypot(tgx - gx, tgy - gy) > 0.15){
        raf = requestAnimationFrame(tick);
      } else {
        disp.setAttribute("scale", BASE);
      }
    }
    addEventListener("pointermove", onMove, { passive: true });
  }
})();

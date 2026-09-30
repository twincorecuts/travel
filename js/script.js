/* =========================================================
   旅圖誌 Travel Atlas — 互動行為
   學員編號：04 / 姓名：CheungChunKin

   每個函式開頭都會檢查元素是否存在，找不到就 return，
   所以任何一頁都不會出現 JavaScript 錯誤。
   引入方式：<script src="js/script.js" defer></script>
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     共用工具
     --------------------------------------------------------- */
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function setHidden(element, shouldHide) {
    if (!element) return;
    element.hidden = shouldHide;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  /* ---------------------------------------------------------
     1. 手機版漢堡菜單
     --------------------------------------------------------- */
  function initNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = byId("primary-nav");
    if (!toggle || !nav) return;

    function setOpen(isOpen) {
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      nav.classList.toggle("is-open", isOpen);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    const wideScreen = window.matchMedia("(min-width: 768px)");
    wideScreen.addEventListener("change", function (event) {
      if (event.matches) setOpen(false);
    });
  }

  /* ---------------------------------------------------------
     2. 跳至主要內容（把鍵盤焦點移到 main）
     --------------------------------------------------------- */
  function initSkipLink() {
    const link = document.querySelector(".skip-link");
    const main = byId("main");
    if (!link || !main) return;

    link.addEventListener("click", function () {
      main.focus();
    });
  }

  /* ---------------------------------------------------------
     3. 閱讀進度線（2px，無動畫）
     --------------------------------------------------------- */
  function initReadingProgress() {
    const bar = byId("reading-progress");
    if (!bar) return;

    let ticking = false;

    function update() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clamped = Math.min(1, Math.max(0, ratio));
      bar.style.transform = "scaleX(" + clamped.toFixed(4) + ")";
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------------------------------------------------------
     4. 章節欄：標示目前讀到哪一節
     用捲動位置計算（標題很短，IntersectionObserver 的窄帶不可靠），
     只切換 class，無動畫。
     --------------------------------------------------------- */
  function initChapterRail() {
    const rail = document.querySelector(".chapter-rail");
    if (!rail) return;

    const marks = Array.prototype.slice.call(
      rail.querySelectorAll(".chapter-mark")
    );
    if (marks.length === 0) return;

    const pairs = [];
    marks.forEach(function (mark) {
      const href = mark.getAttribute("href") || "";
      const section = href.charAt(0) === "#" ? byId(href.slice(1)) : null;
      if (section) pairs.push({ mark: mark, section: section });
    });
    if (pairs.length === 0) return;

    let current = -1;
    let ticking = false;

    function update() {
      ticking = false;
      const threshold = window.innerHeight * 0.35;
      let index = 0;
      pairs.forEach(function (pair, i) {
        if (pair.section.getBoundingClientRect().top - threshold <= 0) {
          index = i;
        }
      });
      if (index === current) return;
      current = index;
      pairs.forEach(function (pair, i) {
        pair.mark.classList.toggle("is-current", i === index);
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------------------------------------------------------
     5. 圖片淡入（只做 opacity 與 12px 位移，其餘一律不做）
     --------------------------------------------------------- */
  function initFigureReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const targets = Array.prototype.slice.call(
      document.querySelectorAll("figure.figure, .spot")
    );
    if (targets.length === 0) return;

    targets.forEach(function (element) {
      element.classList.add("is-reveal");
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    targets.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* ---------------------------------------------------------
     6. 目錄頁：篩選、排序、表格同步
     --------------------------------------------------------- */
  function initDestinationFilter() {
    const grid = document.querySelector("[data-destination-grid]");
    if (!grid) return;

    const countrySelect = byId("filter-country");
    const seasonSelect = byId("filter-season");
    const sortSelect = byId("sort-by");
    if (!countrySelect || !seasonSelect || !sortSelect) return;

    const status = byId("filter-status");
    const emptyState = byId("empty-state");
    const table = document.querySelector("[data-comparison-table]");
    const tbody = table ? table.tBodies[0] : null;

    const collator = new Intl.Collator("en");

    const records = Array.prototype.map.call(
      grid.querySelectorAll("[data-destination]"),
      function (card, index) {
        const id = card.dataset.destination;
        return {
          id: id,
          card: card,
          row: tbody
            ? tbody.querySelector('[data-destination="' + id + '"]')
            : null,
          country: card.dataset.country,
          countryEn: card.dataset.countryEn,
          season: card.dataset.season,
          seasonOrder: Number(card.dataset.seasonOrder),
          nameEn: card.dataset.nameEn,
          reading: Number(card.dataset.reading),
          index: index,
          visible: true
        };
      }
    );

    const total = records.length;
    let sortField = sortSelect.value || "default";
    let sortDir = 1;

    function compare(a, b) {
      let result = 0;
      if (sortField === "name") {
        result = collator.compare(a.nameEn, b.nameEn);
      } else if (sortField === "country") {
        result =
          collator.compare(a.countryEn, b.countryEn) ||
          collator.compare(a.nameEn, b.nameEn);
      } else if (sortField === "season") {
        result =
          a.seasonOrder - b.seasonOrder || collator.compare(a.nameEn, b.nameEn);
      } else if (sortField === "reading") {
        result = a.reading - b.reading || collator.compare(a.nameEn, b.nameEn);
      } else {
        result = a.index - b.index;
      }
      return sortDir === 1 ? result : -result;
    }

    function updateStatus(shown) {
      if (!status) return;
      status.textContent = "";
      status.append("顯示 ");
      const count = document.createElement("strong");
      count.textContent = String(shown);
      status.append(count, " / " + total + " 個地點");
    }

    function syncTableHeaders() {
      if (!table) return;
      Array.prototype.forEach.call(
        table.querySelectorAll("thead th[data-sort]"),
        function (th) {
          if (th.dataset.sort === sortField) {
            th.setAttribute(
              "aria-sort",
              sortDir === 1 ? "ascending" : "descending"
            );
          } else {
            th.removeAttribute("aria-sort");
          }
        }
      );
    }

    function apply() {
      const country = countrySelect.value;
      const season = seasonSelect.value;

      records.forEach(function (record) {
        record.visible =
          (country === "all" || record.country === country) &&
          (season === "all" || record.season === season);
      });

      records.forEach(function (record) {
        record.card.classList.toggle("is-filtered-out", !record.visible);
        if (record.row) {
          record.row.classList.toggle("is-filtered-out", !record.visible);
        }
      });

      records
        .slice()
        .sort(compare)
        .forEach(function (record) {
          grid.appendChild(record.card);
          if (tbody && record.row) tbody.appendChild(record.row);
        });

      const shown = records.filter(function (record) {
        return record.visible;
      }).length;

      updateStatus(shown);
      setHidden(emptyState, shown !== 0);
      syncTableHeaders();
    }

    [countrySelect, seasonSelect].forEach(function (control) {
      control.addEventListener("change", apply);
    });

    sortSelect.addEventListener("change", function () {
      sortField = sortSelect.value;
      sortDir = 1;
      apply();
    });

    // 點表格表頭排序：與下拉選單共用同一個排序來源
    if (table) {
      Array.prototype.forEach.call(
        table.querySelectorAll("thead th[data-sort]"),
        function (th) {
          th.addEventListener("click", function () {
            const field = th.dataset.sort;
            if (sortField === field) {
              sortDir = sortDir === 1 ? -1 : 1;
            } else {
              sortField = field;
              sortDir = 1;
            }
            sortSelect.value = field;
            apply();
          });
        }
      );
    }

    apply();
  }

  /* ---------------------------------------------------------
     7. 目錄頁：卡片檢視／索引表檢視切換
     狀態只存記憶體（file:// 下的 localStorage 不可靠）
     --------------------------------------------------------- */
  function initViewSwitch() {
    const switchRoot = document.querySelector(".view-switch");
    const viewCards = byId("view-cards");
    const viewTable = byId("view-table");
    if (!switchRoot || !viewCards || !viewTable) return;

    const inputs = switchRoot.querySelectorAll(".view-switch-input");
    if (inputs.length === 0) return;

    function show(mode) {
      const isTable = mode === "table";
      setHidden(viewCards, isTable);
      setHidden(viewTable, !isTable);
    }

    Array.prototype.forEach.call(inputs, function (input) {
      input.addEventListener("change", function () {
        if (input.checked) show(input.value);
      });
    });

    const checked = switchRoot.querySelector(".view-switch-input:checked");
    show(checked ? checked.value : "cards");
  }

  /* ---------------------------------------------------------
     8. 編輯精選橫向滑動
     --------------------------------------------------------- */
  function initRail() {
    const rail = document.querySelector(".rail");
    if (!rail) return;

    const track = rail.querySelector(".rail-track");
    if (!track) return;

    const buttons = rail.querySelectorAll(".rail-nav-btn");
    if (buttons.length < 2) return;

    function step(direction) {
      const amount = Math.max(240, track.clientWidth * 0.8);
      track.scrollBy({
        left: amount * direction,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    }

    buttons[0].addEventListener("click", function () {
      step(-1);
    });
    buttons[1].addEventListener("click", function () {
      step(1);
    });
  }

  /* ---------------------------------------------------------
     9. 圖片 Lightbox（含前後張導覽與圖版編號）
     --------------------------------------------------------- */
  function initLightbox() {
    const lightbox = byId("lightbox");
    const image = byId("lightbox-img");
    const caption = byId("lightbox-caption");
    const counter = byId("lightbox-counter");
    const closeButton = byId("lightbox-close");
    const prevButton = byId("lightbox-prev");
    const nextButton = byId("lightbox-next");
    const triggers = Array.prototype.slice.call(
      document.querySelectorAll(".lightbox-trigger")
    );
    if (!lightbox || !image || !closeButton || triggers.length === 0) return;

    let current = 0;
    let lastFocused = null;

    function pad(value) {
      return value < 10 ? "0" + value : String(value);
    }

    function render(index) {
      const totalPlates = triggers.length;
      current = (index + totalPlates) % totalPlates;

      const trigger = triggers[current];
      const thumbnail = trigger.querySelector("img");
      const text =
        trigger.dataset.lightboxCaption || (thumbnail ? thumbnail.alt : "");

      image.src =
        trigger.dataset.lightboxSrc ||
        (thumbnail ? thumbnail.getAttribute("src") : "");
      image.alt = text;
      if (caption) caption.textContent = text;
      if (counter) {
        counter.textContent =
          "圖版 " + pad(current + 1) + " / " + pad(totalPlates);
      }
    }

    function open(trigger) {
      lastFocused = trigger;
      render(triggers.indexOf(trigger));
      setHidden(lightbox, false);
      document.body.classList.add("is-lightbox-open");
      closeButton.focus();
    }

    function close() {
      setHidden(lightbox, true);
      document.body.classList.remove("is-lightbox-open");
      if (lastFocused) lastFocused.focus();
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        open(trigger);
      });
    });

    closeButton.addEventListener("click", close);

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        render(current - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        render(current + 1);
      });
    }

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) close();
    });

    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) return;
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft" && prevButton) {
        render(current - 1);
      } else if (event.key === "ArrowRight" && nextButton) {
        render(current + 1);
      }
    });
  }

  /* ---------------------------------------------------------
     10. 聯絡表單驗證
     --------------------------------------------------------- */
  function initContactForm() {
    const form = byId("contact-form");
    if (!form) return;

    const status = byId("form-status");

    const fields = [
      {
        input: byId("contact-name"),
        error: byId("contact-name-error"),
        validate: function (value) {
          if (value.trim() === "") return "請填寫姓名。";
          if (value.trim().length < 2) return "姓名至少要有 2 個字元。";
          return "";
        }
      },
      {
        input: byId("contact-email"),
        error: byId("contact-email-error"),
        validate: function (value) {
          if (value.trim() === "") return "請填寫電郵地址。";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
            return "電郵格式不正確，請重新檢查。";
          }
          return "";
        }
      },
      {
        input: byId("contact-message"),
        error: byId("contact-message-error"),
        validate: function (value) {
          if (value.trim() === "") return "請填寫訊息內容。";
          if (value.trim().length < 10) return "訊息至少要有 10 個字元。";
          return "";
        }
      }
    ].filter(function (field) {
      return Boolean(field.input);
    });

    if (fields.length === 0) return;

    function showError(field, message) {
      const isInvalid = message !== "";
      field.input.classList.toggle("is-invalid", isInvalid);
      field.input.setAttribute("aria-invalid", isInvalid ? "true" : "false");
      if (field.error) {
        field.error.textContent = message;
        setHidden(field.error, !isInvalid);
      }
    }

    function validateField(field) {
      const message = field.validate(field.input.value);
      showError(field, message);
      return message === "";
    }

    fields.forEach(function (field) {
      field.input.addEventListener("blur", function () {
        validateField(field);
      });
      field.input.addEventListener("input", function () {
        if (field.input.classList.contains("is-invalid")) showError(field, "");
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const invalidFields = fields.filter(function (field) {
        return !validateField(field);
      });

      if (invalidFields.length > 0) {
        if (status) {
          status.textContent =
            "請先修正以上 " + invalidFields.length + " 個欄位。";
          status.classList.add("is-error");
          setHidden(status, false);
        }
        invalidFields[0].input.focus();
        return;
      }

      form.reset();
      fields.forEach(function (field) {
        showError(field, "");
      });

      if (status) {
        status.textContent =
          "多謝你的訊息！本站是課堂習作，表單只作示範，不會真正寄出。";
        status.classList.remove("is-error");
        setHidden(status, false);
      }
    });
  }

  /* ---------------------------------------------------------
     11. 返回頂部
     --------------------------------------------------------- */
  function initBackToTop() {
    const button = byId("back-to-top");
    if (!button) return;

    const THRESHOLD = 300;

    function syncVisibility() {
      setHidden(button, window.scrollY <= THRESHOLD);
    }

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });

    window.addEventListener("scroll", syncVisibility, { passive: true });
    syncVisibility();
  }

  /* ---------------------------------------------------------
     啟動
     --------------------------------------------------------- */
  function init() {
    initSkipLink();
    initNavToggle();
    initReadingProgress();
    initChapterRail();
    initFigureReveal();
    initDestinationFilter();
    initViewSwitch();
    initRail();
    initLightbox();
    initContactForm();
    initBackToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

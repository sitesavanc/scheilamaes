(function () {
  "use strict";

  var WHATSAPP_NUMBER = "5542991463040"; // 42 9 9146-3040

  /* ---------------- Header scroll state ---------------- */
  var header = document.getElementById("site-header");
  var scrollThreshold = 24;
  function onScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
    toggleWaFixed();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function openMobileNav() {
    mobileNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  navToggle.addEventListener("click", function () {
    var isOpen = mobileNav.classList.contains("is-open");
    if (isOpen) { closeMobileNav(); } else { openMobileNav(); }
  });
  mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMobileNav);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileNav();
  });

  /* ---------------- Menu suspenso "Para quem é" ---------------- */
  var subItem = document.querySelector(".main-nav .has-sub");
  var subBtn = subItem && subItem.querySelector(".sub-toggle");
  function setSub(open) {
    if (!subItem) return;
    subItem.classList.toggle("is-open", open);
    subBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (subBtn) {
    subBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setSub(!subItem.classList.contains("is-open"));
    });
    document.addEventListener("click", function (e) {
      if (!subItem.contains(e.target)) setSub(false);
    });
    subItem.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setSub(false); subBtn.focus(); }
    });
    window.addEventListener("scroll", function () { setSub(false); }, { passive: true });
  }
  var mSub = document.querySelector(".m-sub");
  if (mSub) {
    var mBtn = mSub.querySelector(".m-sub-toggle");
    mBtn.addEventListener("click", function () {
      var open = !mSub.classList.contains("is-open");
      mSub.classList.toggle("is-open", open);
      mBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------------- Word-split reveal (Hero H1 / Manifesto) ---------------- */
  function splitIntoWords(el) {
    var text = el.textContent;
    el.innerHTML = "";
    var parts = text.split(/(\s+)/);
    parts.forEach(function (part) {
      if (part.trim() === "") {
        el.appendChild(document.createTextNode(part));
        return;
      }
      var word = document.createElement("span");
      word.className = "word";
      var inner = document.createElement("span");
      inner.className = "word-inner";
      inner.textContent = part;
      word.appendChild(inner);
      el.appendChild(word);
    });
    el.classList.add("split-words");
  }

  document.querySelectorAll("[data-split]").forEach(function (el) {
    // Preserve inner <em> highlight by splitting only if it holds simple content.
    if (el.querySelector("em")) {
      var html = el.innerHTML;
      var frag = document.createDocumentFragment();
      var temp = document.createElement("div");
      temp.innerHTML = html;
      Array.from(temp.childNodes).forEach(function (node) {
        if (node.nodeType === 3) {
          var span = document.createElement("span");
          span.innerHTML = node.textContent.replace(/(\S+)/g, '<span class="word"><span class="word-inner">$1</span></span>');
          frag.appendChild(span);
        } else {
          var word = document.createElement("span");
          word.className = "word";
          var inner = document.createElement("span");
          inner.className = "word-inner";
          inner.appendChild(node.cloneNode(true));
          word.appendChild(inner);
          frag.appendChild(word);
        }
      });
      el.innerHTML = "";
      el.appendChild(frag);
      el.classList.add("split-words");
    } else {
      splitIntoWords(el);
    }
  });

  // Hero headline shows right away (not scroll-driven)
  requestAnimationFrame(function () {
    document.querySelectorAll("[data-instant]").forEach(function (el) { el.classList.add("is-visible"); });
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll("[data-faq]").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    btn.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", isOpen ? "false" : "true");
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  /* ---------------- Audience cards accordion ---------------- */
  document.querySelectorAll("[data-audience-card]").forEach(function (card) {
    var btn = card.querySelector(".audience-toggle");
    btn.addEventListener("click", function () {
      var isOpen = card.getAttribute("data-open") === "true";
      card.setAttribute("data-open", isOpen ? "false" : "true");
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  /* ---------------- Segment CTA -> pre-select form + scroll ---------------- */
  document.querySelectorAll("[data-cta-tipo]").forEach(function (link) {
    link.addEventListener("click", function () {
      var tipo = link.getAttribute("data-cta-tipo");
      var select = document.getElementById("f-tipo");
      if (select) {
        Array.from(select.options).forEach(function (opt) {
          if (opt.value === tipo || opt.textContent.trim() === tipo) {
            select.value = opt.value || opt.textContent;
          }
        });
      }
    });
  });

  /* ---------------- WhatsApp direct links ---------------- */
  var directMessage = "Olá, Scheilamar! Quero conversar sobre uma palestra.";
  var directUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(directMessage);
  var waDirectLink = document.getElementById("wa-direct-link");
  var waDirectBtn = document.getElementById("wa-direct-btn");
  var waFixed = document.getElementById("wa-fixed");
  [waDirectLink, waDirectBtn, waFixed].forEach(function (el) {
    if (el) el.setAttribute("href", directUrl);
  });

  var waAtipicalBtn = document.getElementById("wa-atipical-btn");
  if (waAtipicalBtn) {
    var atipicalMessage = "Olá! Vi o site da Scheilamar e quero saber mais sobre a Atipical.";
    waAtipicalBtn.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(atipicalMessage));
  }

  var footerEl = document.querySelector(".site-footer");
  function toggleWaFixed() {
    if (!waFixed) return;
    var nearFooter = false;
    if (footerEl) {
      var footerTop = footerEl.getBoundingClientRect().top;
      nearFooter = footerTop < window.innerHeight;
    }
    // a seção de contato já tem o seu próprio botão de WhatsApp
    var contato = document.getElementById("contato");
    if (contato && !nearFooter) {
      var cr = contato.getBoundingClientRect();
      nearFooter = cr.top < window.innerHeight * 0.85 && cr.bottom > 0;
    }
    if (window.scrollY > 480 && !nearFooter) {
      waFixed.classList.add("is-visible");
    } else {
      waFixed.classList.remove("is-visible");
    }
  }

  /* Origem do tráfego (UTM) -> aparece na mensagem de WhatsApp */
  function campaignOrigin() {
    try {
      var q = new URLSearchParams(window.location.search);
      var parts = ["utm_source", "utm_medium", "utm_campaign"].map(function (k) { return q.get(k); }).filter(Boolean);
      var page = window.location.pathname.replace(/index\.html$/, "").replace(/^\/+|\/+$/g, "");
      if (page) parts.push("página: " + page);
      return parts.join(" / ");
    } catch (err) { return ""; }
  }

  /* ---------------- Contact form -> WhatsApp ---------------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var nome = data.get("nome");
      var cargo = data.get("cargo");
      var instituicao = data.get("instituicao");
      var tipo = data.get("tipo");
      var email = data.get("email");
      var whatsapp = data.get("whatsapp");
      var mensagem = data.get("mensagem");

      var lines = ["Olá, Scheilamar! Quero conversar sobre uma palestra.", ""];
      lines.push("Nome: " + nome);
      if (cargo) lines.push("Cargo/Função: " + cargo);
      lines.push("Instituição: " + instituicao + (tipo ? " (" + tipo + ")" : ""));
      if (email) lines.push("E-mail: " + email);
      lines.push("WhatsApp: " + whatsapp);
      if (mensagem) {
        lines.push("", "Mensagem: " + mensagem);
      }
      var origem = campaignOrigin();
      if (origem) lines.push("", "Origem do contato: " + origem);

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }


  /* ---------------- Gráficos e contadores (páginas por público) ---------------- */
  (function () {
    var charts = Array.prototype.slice.call(document.querySelectorAll("[data-chart]"));
    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    if (!charts.length && !counters.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function fmt(n, dec) {
      return n.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    }
    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var pre = el.getAttribute("data-prefix") || "";
      var suf = el.getAttribute("data-suffix") || "";
      if (reduce) { el.textContent = pre + fmt(target, dec) + suf; return; }
      var t0 = null, dur = 1400;
      function tick(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + fmt(target * e, dec) + suf;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    function show(el) {
      if (el.hasAttribute("data-count")) run(el);
      else el.classList.add("is-in");
    }
    if (!("IntersectionObserver" in window)) {
      charts.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    counters.forEach(function (el) {
      if (!reduce) el.textContent = (el.getAttribute("data-prefix") || "") + fmt(0, parseInt(el.getAttribute("data-decimals") || "0", 10)) + (el.getAttribute("data-suffix") || "");
    });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { show(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    charts.concat(counters).forEach(function (el) { cio.observe(el); });
  })();

  /* ---------------- Vídeo do YouTube sob demanda ---------------- */
  document.querySelectorAll("[data-yt]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = a.getAttribute("data-yt");
      var start = a.getAttribute("data-start") || "0";
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?start=" + start + "&autoplay=1&rel=0";
      frame.title = a.getAttribute("aria-label") || "Vídeo";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.setAttribute("allowfullscreen", "");
      a.innerHTML = "";
      a.appendChild(frame);
    }, { once: true });
  });

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Prática: passos revelados no scroll ---------------- */
  (function () {
    var wrapEl = document.getElementById("practice-steps");
    if (!wrapEl) return;
    var steps = Array.prototype.slice.call(wrapEl.querySelectorAll(".practice-step"));
    var closing = wrapEl.querySelector(".practice-closing");
    var fill = wrapEl.querySelector(".practice-line-fill");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false;

    function update() {
      ticking = false;
      var trigger = window.innerHeight * 0.62;
      var current = -1;
      steps.forEach(function (step, i) {
        var r = step.getBoundingClientRect();
        var revealed = reduce || r.top + r.height * 0.3 < trigger;
        step.classList.toggle("is-revealed", revealed);
        if (revealed) current = i;
      });
      steps.forEach(function (step, i) { step.classList.toggle("is-current", i === current); });
      if (closing) {
        var cr = closing.getBoundingClientRect();
        closing.classList.toggle("is-revealed", reduce || cr.top < trigger + 40);
      }
      if (fill) {
        var wr = wrapEl.getBoundingClientRect();
        var lineEl = wrapEl.querySelector(".practice-line");
        var max = lineEl ? lineEl.getBoundingClientRect().height : wr.height;
        var lineTop = lineEl ? lineEl.getBoundingClientRect().top : wr.top;
        var h = Math.max(0, Math.min(max, trigger - lineTop));
        fill.style.setProperty("--fill", (reduce ? max : h) + "px");
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  })();

  /* ---------------- Para quem: abas + CTA dinâmico ---------------- */
  (function () {
    var root = document.getElementById("audience-tabs");
    if (!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
    var cta = document.getElementById("tabs-cta");
    var ctaLabel = document.getElementById("tabs-cta-label");

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
      });
      panels.forEach(function (p) {
        var on = p.id === tab.getAttribute("aria-controls");
        p.hidden = !on;
        p.classList.toggle("is-active", on);
      });
      if (ctaLabel) ctaLabel.textContent = tab.getAttribute("data-label");
      if (cta) cta.setAttribute("data-cta-tipo", tab.getAttribute("data-tipo"));
      if (focus) tab.focus();
      var list = tab.parentElement;
      if (list && list.scrollWidth > list.clientWidth) {
        // scroll only the tab strip (scrollIntoView would also shift the page sideways)
        list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
      }
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var k = e.key, n = tabs.length, j = -1;
        if (k === "ArrowRight") j = (i + 1) % n;
        else if (k === "ArrowLeft") j = (i - 1 + n) % n;
        else if (k === "Home") j = 0;
        else if (k === "End") j = n - 1;
        if (j > -1) { e.preventDefault(); select(tabs[j], true); }
      });
    });
  })();
})();

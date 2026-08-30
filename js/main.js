(function () {
  "use strict";

  var WHATSAPP_NUMBER = "554291463040"; // +55 42 9146-3040

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
  var directMessage = "Olá, Scheila! Quero conversar sobre uma palestra.";
  var directUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(directMessage);
  var waDirectLink = document.getElementById("wa-direct-link");
  var waDirectBtn = document.getElementById("wa-direct-btn");
  var waFixed = document.getElementById("wa-fixed");
  [waDirectLink, waDirectBtn, waFixed].forEach(function (el) {
    if (el) el.setAttribute("href", directUrl);
  });

  var waAtipicalBtn = document.getElementById("wa-atipical-btn");
  if (waAtipicalBtn) {
    var atipicalMessage = "Olá! Vi o site da Scheila e quero saber mais sobre a Atipical.";
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
    if (window.scrollY > 480 && !nearFooter) {
      waFixed.classList.add("is-visible");
    } else {
      waFixed.classList.remove("is-visible");
    }
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

      var lines = [
        "Olá, Scheila! Quero conversar sobre uma palestra.",
        "",
        "Nome: " + nome,
        "Cargo/Função: " + cargo,
        "Instituição: " + instituicao + " (" + tipo + ")",
        "E-mail: " + email,
        "WhatsApp: " + whatsapp
      ];
      if (mensagem) {
        lines.push("", "Mensagem: " + mensagem);
      }

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Subtle hero parallax on pointer (desktop only) ---------------- */
  var heroFrame = document.querySelector(".hero-media-frame");
  var hero = document.querySelector(".hero");
  if (heroFrame && hero && window.matchMedia("(min-width: 1024px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hero.addEventListener("pointermove", function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroFrame.style.transform = "translate(" + (x * -10) + "px, " + (y * -8) + "px)";
    });
    hero.addEventListener("pointerleave", function () {
      heroFrame.style.transform = "translate(0,0)";
    });
  }
})();

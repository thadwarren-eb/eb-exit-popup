/**
 * EnergyBot Exit-Intent Popup
 * ----------------------------
 * Drop this one file on any page via:
 *   <script src="/exit-intent-popup.js" defer></script>
 *
 * It detects "exit intent" (mouse moving up toward the browser
 * chrome / address bar) and shows a lightweight popup with 3 CTAs
 * to nurturing tools. No dependencies, no build step — single-CTA
 * variants lazy-load lottie-web + mascot-celebration.json for a small
 * celebration animation, but only when that variant is actually shown.
 *
 * CONFIG: edit the values in the CONFIG block below to change
 * links, copy, or behavior.
 */
(function () {
  "use strict";

  // Captured synchronously so we can read data-* attributes off this exact
  // <script> tag. Must happen before any other code runs \u2014 currentScript is
  // only valid during the script's initial (top-level) execution. It's also
  // NULL when this script is injected by Google Tag Manager's Custom HTML
  // tag (and some other tag managers) \u2014 they parse the HTML and recreate
  // the <script> element programmatically to force execution, which loses
  // this. For GTM, use the window.EB_EXIT_POPUP_CONFIG global instead (see
  // OPTS/readOpt below) \u2014 set it in its own inline <script> ahead of this
  // one, inside the same Custom HTML tag.
  var scriptEl = document.currentScript;

  // Config source for tag-manager setups where currentScript isn't available.
  // Example, inside one GTM Custom HTML tag:
  //   <script>window.EB_EXIT_POPUP_CONFIG = { variant: "usage" };</script>
  //   <script src="https://cdn.jsdelivr.net/gh/thadwarren-eb/eb-exit-popup/exit-intent-popup.js"></script>
  // When both a global config value and a data-* attribute are present, the
  // global config wins.
  var OPTS = window.EB_EXIT_POPUP_CONFIG || {};

  function readOpt(globalKey, dataAttr) {
    if (OPTS[globalKey] != null) return OPTS[globalKey];
    return scriptEl ? scriptEl.getAttribute("data-" + dataAttr) : null;
  }

  // Mascot celebration animation (single-CTA variants only) is fetched from
  // whatever directory this script itself was loaded from, so it works the
  // same whether served from jsDelivr, GitHub raw, or a local file. Falls
  // back to the jsDelivr location when scriptEl is unavailable (GTM).
  var MASCOT_URL =
    (scriptEl ? scriptEl.src.replace(/[^/]*$/, "") : "https://cdn.jsdelivr.net/gh/thadwarren-eb/eb-exit-popup/") +
    "mascot-celebration.json";
  var LOTTIE_SRC = "https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie_light.min.js";

  var ICONS = {
    trendingUp:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7">' +
      '</polyline><polyline points="14 7 21 7 21 14"></polyline></svg>',
    helpCircle:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle>' +
      '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17">' +
      '</line></svg>',
    barChart:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line>' +
      '<line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
    zap:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2">' +
      '</polygon></svg>',
    activity:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12">' +
      '</polyline></svg>',
    arrowRight:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line>' +
      '<polyline points="12 5 19 12 12 19"></polyline></svg>'
  };

  // ---------- VARIANTS ----------
  // Pick one per page by adding data-variant="key" to the <script> tag \u2014
  // no editing this file needed. Falls back to "all" when omitted.
  //
  //   data-variant="xray"    -> Energy X-Ray only
  //   data-variant="switch"  -> Is Now a Good Time to Switch? only
  //   data-variant="usage"   -> Pull My Usage only
  //   data-variant="custom"  -> one-off CTA, see data-cta-name/data-cta-href below
  //   (omitted)              -> all 3 tools (original behavior)
  //
  // Any variant's headline/subhead can be overridden per page too, with
  // data-headline="..." / data-subhead="..." on the same <script> tag.
  var VARIANTS = {
    all: {
      headline: "Before you go \u2014 don't miss these free tools",
      subhead: "Takes 30 seconds. No account needed.",
      tools: [
        {
          name: "Rate Tracker",
          href: "https://www.energybot.com/dashboard.html#/dashboard/tools/price_tracker/energy-type",
          icon: ICONS.trendingUp
        },
        {
          name: "Is Now a Good Time to Switch?",
          href: "https://www.energybot.com/should-i-switch.html",
          icon: ICONS.helpCircle
        },
        {
          name: "Compare My Bill to My Neighbors",
          href: "https://www.energybot.com/dashboard.html#/dashboard/tools/bill_comparison/energy-type",
          icon: ICONS.barChart
        }
      ]
    },
    xray: {
      headline: "Get your free Energy X-Ray",
      subhead: "See exactly where your money's going. Takes 30 seconds.",
      tools: [
        {
          name: "Get My Energy X-Ray",
          href: "https://www.energybot.com/energy-x-ray.html",
          icon: ICONS.zap
        }
      ]
    },
    switch: {
      headline: "Is now a good time to switch?",
      subhead: "Get a personalized market analysis. Takes 30 seconds.",
      tools: [
        {
          name: "Is Now a Good Time to Switch?",
          href: "https://www.energybot.com/should-i-switch.html",
          icon: ICONS.helpCircle
        }
      ]
    },
    usage: {
      headline: "See your energy usage history",
      subhead: "Pull your usage data in 30 seconds. No account needed.",
      tools: [
        {
          name: "Pull My Usage",
          href: "https://www.energybot.com/dashboard.html#/dashboard/tools/usage/energy-type",
          icon: ICONS.activity
        }
      ]
    }
  };

  function getVariant() {
    var key = readOpt("variant", "variant") || "all";

    if (key === "custom") {
      return {
        key: key,
        headline: readOpt("headline", "headline") || VARIANTS.all.headline,
        subhead: readOpt("subhead", "subhead") || VARIANTS.all.subhead,
        tools: [
          {
            name: readOpt("ctaName", "cta-name") || "Learn More",
            href: readOpt("ctaHref", "cta-href") || "#",
            icon: ICONS.arrowRight
          }
        ]
      };
    }

    var preset = VARIANTS[key] || VARIANTS.all;
    return {
      key: VARIANTS[key] ? key : "all",
      headline: readOpt("headline", "headline") || preset.headline,
      subhead: readOpt("subhead", "subhead") || preset.subhead,
      tools: preset.tools
    };
  }

  var variant = getVariant();

  // ---------- CONFIG ----------
  var CONFIG = {
    // Set true temporarily to log mouseout events + trigger decisions to the console
    debug: true,
    // How long to wait after page load before exit-intent can trigger (ms)
    armDelay: 3000,
    // Don't show again for this many days after it's shown/dismissed
    suppressDays: 7,
    // Only fire when cursor moves above this Y position (px from top)
    triggerY: 20,
    cookieName: "eb_exit_popup_seen",
    variantKey: variant.key,
    headline: variant.headline,
    subhead: variant.subhead,
    tools: variant.tools
  };
  // ---------- END CONFIG ----------

  // ---------- ANALYTICS ----------
  // Fires as a proper analytics event — never as a URL/UTM parameter, since
  // UTMs on a same-site link can make GA4 (and most other tools) start a
  // brand-new session and overwrite the visitor's real acquisition source.
  // Works with GA4 (gtag.js), GTM (dataLayer), PostHog, or none of them —
  // and always dispatches a DOM CustomEvent too, so any other analytics
  // setup (Segment, Mixpanel, a custom GTM trigger, etc.) can listen for
  // "eb-marketing-exit-popup:<name>" without this file needing to know about it.
  function trackEvent(name, params) {
    var payload = Object.assign({ variant: CONFIG.variantKey }, params);
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, payload);
      }
      if (window.dataLayer && typeof window.dataLayer.push === "function") {
        window.dataLayer.push(Object.assign({ event: name }, payload));
      }
      if (window.posthog && typeof window.posthog.capture === "function") {
        window.posthog.capture(name, payload);
      }
      document.dispatchEvent(new CustomEvent("eb-marketing-exit-popup:" + name, { detail: payload }));
      if (CONFIG.debug) console.log("[eb-exit] tracked", name, payload);
    } catch (e) {
      if (CONFIG.debug) console.warn("[eb-exit] tracking failed", e);
    }
  }
  // ---------- END ANALYTICS ----------

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString() + ";path=/";
  }

  if (getCookie(CONFIG.cookieName)) {
    if (CONFIG.debug) console.log("[eb-exit] suppressed — cookie present:", getCookie(CONFIG.cookieName));
    return; // already seen recently
  }

  var armed = false;
  var shown = false;

  setTimeout(function () {
    armed = true;
    if (CONFIG.debug) console.log("[eb-exit] armed — will now trigger on exit intent");
  }, CONFIG.armDelay);

  function loadScript(src, onload) {
    var el = document.createElement("script");
    el.src = src;
    el.onload = onload;
    el.onerror = function () {
      if (CONFIG.debug) console.warn("[eb-exit] failed to load", src);
    };
    document.head.appendChild(el);
  }

  function injectMascot(container) {
    function render(data) {
      window.lottie.loadAnimation({
        container: container,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData: data
      });
    }

    function fetchAndRender() {
      fetch(MASCOT_URL)
        .then(function (res) { return res.json(); })
        .then(render)
        .catch(function (err) {
          if (CONFIG.debug) console.warn("[eb-exit] mascot animation failed to load", err);
        });
    }

    if (window.lottie) {
      fetchAndRender();
    } else {
      loadScript(LOTTIE_SRC, fetchAndRender);
    }
  }

  function buildPopup() {
    var overlay = document.createElement("div");
    overlay.id = "eb-exit-overlay";

    var toolsHtml = CONFIG.tools
      .map(function (t) {
        return (
          '<a class="eb-exit-tool" href="' + t.href + '" target="_blank" rel="noopener">' +
            '<span class="eb-exit-tool-icon">' + t.icon + "</span>" +
            '<span class="eb-exit-tool-name">' + t.name + "</span>" +
          "</a>"
        );
      })
      .join("");

    // The mascot celebration only fits under a single, focused CTA —
    // it'd compete with the list on the "all tools" 3-CTA layout.
    var showMascot = CONFIG.tools.length === 1;

    overlay.innerHTML =
      '<div id="eb-exit-modal" role="dialog" aria-modal="true" aria-labelledby="eb-exit-headline">' +
        '<button id="eb-exit-close" aria-label="Close">&times;</button>' +
        '<h2 id="eb-exit-headline">' + CONFIG.headline + "</h2>" +
        '<p id="eb-exit-subhead">' + CONFIG.subhead + "</p>" +
        '<div id="eb-exit-tools">' + toolsHtml + "</div>" +
        (showMascot ? '<div id="eb-exit-mascot" aria-hidden="true"></div>' : "") +
      "</div>";

    document.body.appendChild(overlay);
    trackEvent("eb_exit_popup_view", { headline: CONFIG.headline });

    if (showMascot) {
      injectMascot(overlay.querySelector("#eb-exit-mascot"));
    }

    // CTAs open in a new tab (target="_blank"), so this page never
    // navigates away — no need to delay or race against the click.
    var ctaEls = overlay.querySelectorAll(".eb-exit-tool");
    CONFIG.tools.forEach(function (t, i) {
      if (!ctaEls[i]) return;
      ctaEls[i].addEventListener("click", function () {
        trackEvent("eb_exit_popup_click", { cta_name: t.name, cta_href: t.href });
      });
    });

    function close(reason) {
      overlay.remove();
      setCookie(CONFIG.cookieName, "1", CONFIG.suppressDays);
      trackEvent("eb_exit_popup_dismiss", { reason: reason });
    }

    overlay.querySelector("#eb-exit-close").addEventListener("click", function () {
      close("close_button");
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close("backdrop");
    });
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        close("escape_key");
        document.removeEventListener("keydown", escHandler);
      }
    });
  }

  function injectFont() {
    if (document.getElementById("eb-exit-font")) return;
    var link = document.createElement("link");
    link.id = "eb-exit-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }

  function injectStyles() {
    var css =
      // EnergyBot design tokens (from Figma design system)
      ":root{" +
        "--eb-blue:#4353FF;--eb-blue-hover:#3C48CD;--eb-blue-20:#D1D5F7;" +
        "--eb-blue-10:#E3E4F6;--eb-blue-5:#F6F6FF;" +
        "--eb-black:#222222;--eb-black-50:#909090;--eb-black-20:#D3D3D3;" +
        "--eb-black-12:#E4E4E4;--eb-black-5:#F4F4F4;" +
        "--eb-cyan:#00B5CD;" +
      "}" +
      "#eb-exit-overlay{position:fixed;inset:0;background:rgba(34,34,34,.6);" +
      "display:flex;align-items:center;justify-content:center;z-index:999999;" +
      "animation:eb-fade .18s ease-out;padding:16px;overflow-y:auto;" +
      "font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}" +
      "@keyframes eb-fade{from{opacity:0}to{opacity:1}}" +
      "#eb-exit-modal{position:relative;background:#fff;border-radius:28px;" +
      "max-width:520px;width:100%;padding:56px 32px 32px;box-shadow:0 20px 60px rgba(34,34,34,.25);}" +
      "#eb-exit-close{position:absolute;top:16px;right:16px;width:36px;height:36px;padding:0;" +
      "border:1px solid var(--eb-black-20);border-radius:50%;background:#fff;" +
      "display:flex;align-items:center;justify-content:center;" +
      "font-size:18px;line-height:1;cursor:pointer;color:var(--eb-black-50);transition:all .15s;}" +
      "#eb-exit-close:hover{color:var(--eb-black);border-color:var(--eb-black-50);}" +
      "#eb-exit-headline{margin:0 0 6px;font-size:24px;color:var(--eb-black);font-weight:700;" +
      "text-align:center;text-wrap:balance;}" +
      "#eb-exit-subhead{margin:0 0 28px;font-size:14px;color:var(--eb-black-50);font-weight:400;" +
      "text-align:center;text-wrap:balance;}" +
      "#eb-exit-tools{display:flex;flex-direction:column;gap:14px;}" +
      ".eb-exit-tool{display:flex;align-items:center;gap:16px;" +
      "border:1px solid var(--eb-black-12);border-radius:16px;padding:14px 18px;" +
      "text-decoration:none;transition:all .2s;}" +
      ".eb-exit-tool:hover{border-color:var(--eb-blue);background:var(--eb-blue-5);}" +
      ".eb-exit-tool-icon{flex:0 0 auto;width:56px;height:56px;border-radius:50%;" +
      "background:var(--eb-black-5);color:var(--eb-blue);" +
      "display:flex;align-items:center;justify-content:center;transition:background .2s;}" +
      ".eb-exit-tool-icon svg{width:26px;height:26px;}" +
      ".eb-exit-tool:hover .eb-exit-tool-icon{background:var(--eb-blue-10);}" +
      ".eb-exit-tool-name{font-weight:600;color:var(--eb-black);font-size:16px;}" +
      "#eb-exit-mascot{width:150px;height:187px;margin:8px auto 0;}" +
      "#eb-exit-mascot svg{width:100%;height:100%;display:block;}" +
      "@media(max-width:480px){#eb-exit-modal{padding:48px 20px 24px}}";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function trigger() {
    if (shown || !armed) return;
    shown = true;
    if (CONFIG.debug) console.log("[eb-exit] triggering popup");
    injectFont();
    injectStyles();
    buildPopup();
    document.removeEventListener("mouseout", onMouseOut);
  }

  function onMouseOut(e) {
    // Safari (and Chrome, on a slow-moving pointer) doesn't reliably fire
    // mouseleave on `document` when the cursor exits toward the browser
    // chrome. Using mouseout + a null relatedTarget/toElement is the
    // cross-browser-safe way to detect "the pointer left the viewport",
    // combined with clientY to narrow it to leaving from the TOP.
    var leftViewport = !e.relatedTarget && !e.toElement;
    if (CONFIG.debug) {
      console.log("[eb-exit] document mouseout", {
        clientY: e.clientY,
        leftViewport: leftViewport,
        armed: armed,
        shown: shown
      });
    }
    if (leftViewport && e.clientY <= CONFIG.triggerY) {
      trigger();
    }
  }

  document.addEventListener("mouseout", onMouseOut);
})();

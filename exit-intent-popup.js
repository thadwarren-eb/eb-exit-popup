/**
 * EnergyBot Exit-Intent Popup
 * ----------------------------
 * Drop this one file on any page via:
 *   <script src="/exit-intent-popup.js" defer></script>
 *
 * It detects "exit intent" (mouse moving up toward the browser
 * chrome / address bar) and shows a lightweight popup with 3 CTAs
 * to nurturing tools. No dependencies, no build step.
 *
 * CONFIG: edit the values in the CONFIG block below to change
 * links, copy, or behavior.
 */
(function () {
  "use strict";

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
    headline: "Before you go \u2014 don't miss these free tools",
    subhead: "Takes 30 seconds. No account needed.",
    tools: [
      {
        name: "Rate Tracker",
        desc: "Get alerted the moment a better rate opens up in your area.",
        href: "https://www.energybot.com/rate-tracker",
        cta: "Track My Rate"
      },
      {
        name: "Is Now a Good Time to Switch?",
        desc: "Answer a couple quick questions to see if switching makes sense today.",
        href: "https://www.energybot.com/should-i-switch",
        cta: "Check Now"
      },
      {
        name: "Compare My Bill to My Neighbors",
        desc: "See how your rate stacks up against others in your zip code.",
        href: "https://www.energybot.com/compare-my-bill",
        cta: "Compare My Bill"
      }
    ]
  };
  // ---------- END CONFIG ----------

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

  function buildPopup() {
    var overlay = document.createElement("div");
    overlay.id = "eb-exit-overlay";

    var toolsHtml = CONFIG.tools
      .map(function (t) {
        return (
          '<a class="eb-exit-tool" href="' + t.href + '" target="_blank" rel="noopener">' +
            '<div class="eb-exit-tool-name">' + t.name + "</div>" +
            '<div class="eb-exit-tool-desc">' + t.desc + "</div>" +
            '<span class="eb-exit-tool-cta">' + t.cta + " \u2192</span>" +
          "</a>"
        );
      })
      .join("");

    overlay.innerHTML =
      '<div id="eb-exit-modal" role="dialog" aria-modal="true" aria-labelledby="eb-exit-headline">' +
        '<button id="eb-exit-close" aria-label="Close">&times;</button>' +
        '<h2 id="eb-exit-headline">' + CONFIG.headline + "</h2>" +
        '<p id="eb-exit-subhead">' + CONFIG.subhead + "</p>" +
        '<div id="eb-exit-tools">' + toolsHtml + "</div>" +
      "</div>";

    document.body.appendChild(overlay);

    function close() {
      overlay.remove();
      setCookie(CONFIG.cookieName, "1", CONFIG.suppressDays);
    }

    overlay.querySelector("#eb-exit-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", escHandler);
      }
    });
  }

  function injectStyles() {
    var css =
      "#eb-exit-overlay{position:fixed;inset:0;background:rgba(15,23,42,.55);" +
      "display:flex;align-items:center;justify-content:center;z-index:999999;" +
      "animation:eb-fade .18s ease-out;padding:16px;}" +
      "@keyframes eb-fade{from{opacity:0}to{opacity:1}}" +
      "#eb-exit-modal{position:relative;background:#fff;border-radius:14px;" +
      "max-width:560px;width:100%;padding:32px 28px;box-shadow:0 20px 60px rgba(0,0,0,.3);" +
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}" +
      "#eb-exit-close{position:absolute;top:12px;right:14px;border:none;background:none;" +
      "font-size:26px;line-height:1;cursor:pointer;color:#64748b;}" +
      "#eb-exit-close:hover{color:#0f172a;}" +
      "#eb-exit-headline{margin:0 0 6px;font-size:22px;color:#0f172a;font-weight:700;}" +
      "#eb-exit-subhead{margin:0 0 20px;font-size:14px;color:#64748b;}" +
      "#eb-exit-tools{display:flex;flex-direction:column;gap:12px;}" +
      ".eb-exit-tool{display:block;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;" +
      "text-decoration:none;transition:border-color .15s,background .15s;}" +
      ".eb-exit-tool:hover{border-color:#16a34a;background:#f0fdf4;}" +
      ".eb-exit-tool-name{font-weight:700;color:#0f172a;font-size:15px;margin-bottom:2px;}" +
      ".eb-exit-tool-desc{font-size:13px;color:#475569;margin-bottom:6px;}" +
      ".eb-exit-tool-cta{font-size:13px;font-weight:600;color:#16a34a;}" +
      "@media(max-width:480px){#eb-exit-modal{padding:24px 18px}}";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function trigger() {
    if (shown || !armed) return;
    shown = true;
    if (CONFIG.debug) console.log("[eb-exit] triggering popup");
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

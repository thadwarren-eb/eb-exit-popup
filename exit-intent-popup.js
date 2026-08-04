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
    headline: "Before you go — don't miss these free tools",
    subhead: "Takes 30 seconds. No account needed.",
    tools: [
      {
        name: "Rate Tracker",
        href: "https://www.energybot.com/dashboard.html#/dashboard/tools/price_tracker/energy-type",
        icon:
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7">' +
          '</polyline><polyline points="14 7 21 7 21 14"></polyline></svg>'
      },
      {
        name: "Is Now a Good Time to Switch?",
        href: "https://www.energybot.com/dashboard.html#/dashboard/tools/market_analysis/energy-type",
        icon:
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle>' +
          '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17">' +
          '</line></svg>'
      },
      {
        name: "Compare My Bill to My Neighbors",
        href: "https://www.energybot.com/dashboard.html#/dashboard/tools/bill_comparison/energy-type",
        icon:
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line>' +
          '<line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>'
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
            '<span class="eb-exit-tool-icon">' + t.icon + "</span>" +
            '<span class="eb-exit-tool-name">' + t.name + "</span>" +
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
      "animation:eb-fade .18s ease-out;padding:16px;" +
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
      "text-align:center;}" +
      "#eb-exit-subhead{margin:0 0 28px;font-size:14px;color:var(--eb-black-50);font-weight:400;" +
      "text-align:center;}" +
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

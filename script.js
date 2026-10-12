/* Musical Bodies — floating text: idle bob (CSS) + scroll parallax + fade-out on section change (JS) */

(() => {
  const panels = Array.from(document.querySelectorAll(".panel"));
  const dots = Array.from(document.querySelectorAll(".dots button"));

  function update() {
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    panels.forEach((panel, i) => {
      const r = panel.getBoundingClientRect();
      // c = 0 when the panel is centered in the viewport, ±1 when fully scrolled away
      const c = (r.top + r.height / 2 - vh / 2) / vh;

      // text is fully visible while the section is roughly centered,
      // and fades away as the next section slides in
      const vis = Math.max(0, Math.min(1, 1 - (Math.abs(c) - 0.28) / 0.5));
      panel.style.setProperty("--vis", vis.toFixed(3));

      // S4 图像淡入: 滑到本页开始, 接近中心完成
      if (panel.id === "s4") {
        const iv = Math.max(0, Math.min(1, 1 - (Math.abs(c) - 0.35) / 0.6));
        panel.style.setProperty("--pvis", iv.toFixed(3));
      }

      const narrow = window.innerWidth <= 1100;
      const sp = narrow ? 0 : 0.12;   // 整层统一视差, 层内元素永不相对移动
      for (const el of [...document.querySelectorAll(`#${panel.id} .fx, #${panel.id} .fx-flow`)]) {
        const ty = -c * sp * vh * 0.9;
        el.style.setProperty("--py", ty.toFixed(1) + "px");
      }

      // S11 视频页浮动元素: JS 驱动 (音符 + 大提琴图标) — 不依赖 CSS 动画
      if (panel.id === "s11") {
        const now = performance.now() / 1000;
        document.querySelectorAll("#s11 .s11float").forEach((el) => {
          const ph = parseFloat(el.style.getPropertyValue("--ph") || "0");
          const spd = parseFloat(el.style.getPropertyValue("--sp") || "1");
          const y = Math.sin(now * spd + ph) * 16;
          const r = Math.sin(now * spd * 0.6 + ph) * 9;
          el.style.translate = `0 ${y.toFixed(1)}px`;
          el.style.rotate = `${r.toFixed(1)}deg`;
        });
      }
    });

    // active dot
    let best = 0;
    let bestDist = Infinity;
    panels.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - vh / 2);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    dots.forEach((d, i) => d.classList.toggle("on", i === best));
  }


  // S11 视频: 第一次用户交互后自动开启音乐 (浏览器政策要求用户交互)
  const s11video = document.getElementById("s11video");
  if (s11video) {
    const enableS11Sound = () => {
      s11video.muted = false;
      s11video.play().catch(() => {});
      const btn = document.querySelector("#s11 button");
      if (btn) btn.textContent = "🔊 音乐已开启";
      document.removeEventListener("click", enableS11Sound);
      document.removeEventListener("touchstart", enableS11Sound);
      document.removeEventListener("keydown", enableS11Sound);
    };
    document.addEventListener("click", enableS11Sound);
    document.addEventListener("touchstart", enableS11Sound);
    document.addEventListener("keydown", enableS11Sound);
  }

  function onScroll() {
    update();
  }

  // 全站漂浮: JS 驱动 (rAF 持续循环) — 每屏的文字层与画面一起缓缓浮动
  const floatTick = (t) => {
    const sec = t / 1000;
    panels.forEach((panel, i) => {
      const amp = 20;
      const speed = 0.9;
      const phase = i * 1.3;
      const y = Math.sin(sec * speed + phase) * amp;
      panel.querySelectorAll(".fx, .fx-flow").forEach((el) => {
        el.style.translate = `0 ${y.toFixed(1)}px`;
      });
    });
    requestAnimationFrame(floatTick);
  };
  requestAnimationFrame(floatTick);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", onScroll);
  document.addEventListener("DOMContentLoaded", onScroll);
  window.addEventListener("hashchange", onScroll);

  dots.forEach((d) =>
    d.addEventListener("click", () => {
      const target = document.getElementById(d.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    })
  );

  update();
})();

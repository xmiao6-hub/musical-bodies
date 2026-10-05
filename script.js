/* Musical Bodies — floating text: idle bob (CSS) + scroll parallax + fade-out on section change (JS) */

(() => {
  const panels = Array.from(document.querySelectorAll(".panel"));
  const layers = panels.map((p) => Array.from(p.querySelectorAll(".fl")));
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

      for (const el of layers[i]) {
        const sp = parseFloat(el.dataset.sp || "0.15");
        const ty = -c * sp * vh * 0.9;
        el.style.setProperty("--py", ty.toFixed(1) + "px");
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

  function onScroll() {
    update();
  }

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

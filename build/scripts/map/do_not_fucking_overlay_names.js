MapGen._resolveLabelOverlap = function () {

  const entries = Array.from(MapGen.objects.values());
  const threshold = 40;
  const BASE_OFFSET = -14;

  for (let i = 0; i < entries.length; i++) {

    const a = entries[i];
    let offset = 0;

    for (let j = 0; j < entries.length; j++) {

      if (i === j) continue;

      const b = entries[j];

      const dx = a.node.position.x - b.node.position.x;
      const dy = a.node.position.y - b.node.position.y;

      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < threshold) offset += 14;
    }

    const cssObj = a.node.children[0];
    const el = cssObj?.element;

    if (!el) continue;

    const label = el.querySelector(".mapgen-label");

    if (label) {
      label.style.transform =
        `translateY(${BASE_OFFSET + offset}px)`;
    }

  }
};

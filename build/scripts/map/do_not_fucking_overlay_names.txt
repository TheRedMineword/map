MapGen._resolveLabelOverlap = function () {

  const entries = Array.from(MapGen.objects.values());
  const threshold = 40; // distance where labels start offsetting

  for (let i = 0; i < entries.length; i++) {

    const a = entries[i];

    let offset = 0;

    for (let j = 0; j < entries.length; j++) {

      if (i === j) continue;

      const b = entries[j];

      const dx = a.node.position.x - b.node.position.x;
      const dy = a.node.position.y - b.node.position.y;

      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < threshold) {
        offset += 14;
      }
    }

    const label = a.node.children[0];
    if (label?.element) {
      label.element.style.transform = `translateY(${offset}px)`;
    }

  }
};

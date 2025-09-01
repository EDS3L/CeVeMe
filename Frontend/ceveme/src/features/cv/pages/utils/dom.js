export async function waitForImages(node) {
  if (!node) return;
  const imgs = Array.from(node.querySelectorAll('img'));
  if (!imgs.length) return;
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) => {
            const done = () => {
              img.onload = img.onerror = null;
              res();
            };
            img.onload = done;
            img.onerror = done;
          })
    )
  );
}

export const nextFrame = () => new Promise((r) => requestAnimationFrame(r));

export async function prepareForSnapshot(innerRef, recomputeNow) {
  await waitForImages(innerRef?.current);
  // 2–3 raf’y dają stabilne rozłożenie layoutu po skalowaniu
  for (let i = 0; i < 3; i += 1) {
    recomputeNow?.();
    // eslint-disable-next-line no-await-in-loop
    await nextFrame();
  }
}

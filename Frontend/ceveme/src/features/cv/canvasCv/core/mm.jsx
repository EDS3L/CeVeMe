export function measurePxPerMm() {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.height = '100mm';
  probe.style.width = '100mm';
  probe.style.padding = '0';
  probe.style.border = '0';
  document.body.appendChild(probe);
  const rect = probe.getBoundingClientRect();
  document.body.removeChild(probe);
  const pxPerMm = (rect.height + rect.width) / 2 / 100;
  return pxPerMm || 3.7795;
}
export const A4 = { widthMm: 210, heightMm: 297 };

// Lekka sanetyzacja HTML (np. responsibilities)
export function sanitizeHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  tmp.querySelectorAll('script, iframe').forEach((el) => el.remove());
  tmp.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((attr) => {
      if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
      if (attr.name === 'style' && /expression|url\(/i.test(attr.value))
        el.removeAttribute('style');
    });
  });
  return tmp.innerHTML;
}

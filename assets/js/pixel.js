/* Pixel da Meta (Pixel-Zunocast, 26/09/2026).
 * Aqui: PageView em toda página do site e Contact no clique para o WhatsApp.
 * InitiateCheckout e Purchase ficam com o checkout (checkout.zunocast.com), que tem o
 * mesmo Pixel e manda a compra também pela API de Conversões. */
!function (f, b, e, v, n, t, s) {
  if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
  if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
  t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1524793246335828');
fbq('track', 'PageView');

document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('a[href*="wa.me/"], a[href*="api.whatsapp.com"]') : null;
  if (a) fbq('track', 'Contact');
}, true);

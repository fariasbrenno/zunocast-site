/* Rastro da venda (26/09/2026).
 * Cada visitante ganha um código (zv). A primeira chegada guarda o anúncio de
 * onde ele veio (utm_* e fbclid) e avisa o ERP. Os links do checkout levam o
 * zv e o anúncio; quem chega por um link da conversa do WhatsApp traz o zc
 * (número da conversa), que também segue para o checkout. O botão do WhatsApp
 * do site manda "(ref. site CODIGO)" na mensagem. Nada de dado pessoal. */
(function () {
  var ERP = 'https://checkout.zunocast.com/rastro/visita';
  var CAMPOS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];

  function ler(chave, sessao) {
    try { return (sessao ? sessionStorage : localStorage).getItem(chave); } catch (e) { return null; }
  }
  function gravar(chave, valor, sessao) {
    try { (sessao ? sessionStorage : localStorage).setItem(chave, valor); } catch (e) { /* sem armazenamento */ }
  }

  var url = new URLSearchParams(location.search);

  var visitante = ler('zuno_zv');
  if (!visitante || !/^[A-Z0-9]{8}$/.test(visitante)) {
    visitante = '';
    var letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (var i = 0; i < 8; i++) visitante += letras[Math.floor(Math.random() * letras.length)];
    gravar('zuno_zv', visitante);
  }

  var agora = {};
  CAMPOS.forEach(function (k) { var v = url.get(k); if (v) agora[k] = v; });
  var origem = {};
  try { origem = JSON.parse(ler('zuno_origem') || '{}') || {}; } catch (e) { origem = {}; }
  if (!Object.keys(origem).length && Object.keys(agora).length) {
    origem = agora;
    gravar('zuno_origem', JSON.stringify(origem));
  }

  var conversa = url.get('zc') || ler('zuno_zc', true);
  if (conversa) gravar('zuno_zc', conversa, true);

  // Avisa o ERP (sem esperar resposta; se falhar, o link ainda leva o zv).
  var dados = { v: visitante, pagina: location.pathname, referencia: document.referrer || '' };
  CAMPOS.forEach(function (k) { if (agora[k] || origem[k]) dados[k] = agora[k] || origem[k]; });
  try {
    var corpo = new Blob([JSON.stringify(dados)], { type: 'text/plain' });
    if (!(navigator.sendBeacon && navigator.sendBeacon(ERP, corpo))) {
      fetch(ERP, { method: 'POST', body: JSON.stringify(dados), keepalive: true, mode: 'cors', headers: { 'Content-Type': 'text/plain' } });
    }
  } catch (e) { /* sem rastro, sem problema */ }

  /** Link do checkout com a origem: conversa do WhatsApp (zc) ou site (zv + anúncio). */
  function checkout(link) {
    var u;
    try { u = new URL(link, location.href); } catch (e) { return link; }
    if (!/(^|\.)checkout\.zunocast\.com$/.test(u.hostname)) return link;
    var p = u.searchParams;
    if (conversa) {
      if (!p.get('zc')) p.set('zc', conversa);
    } else {
      if (!p.get('utm_source')) p.set('utm_source', origem.utm_source || 'site');
      if (!p.get('utm_medium')) p.set('utm_medium', origem.utm_medium || 'site');
      ['utm_campaign', 'utm_content', 'utm_term', 'fbclid'].forEach(function (k) {
        if (origem[k] && !p.get(k)) p.set(k, origem[k]);
      });
    }
    if (!p.get('zv')) p.set('zv', visitante);
    return u.toString();
  }

  window.zunoRastro = {
    visitante: visitante,
    checkout: checkout,
    refWhatsApp: ' (ref. site ' + visitante + ')',
  };

  function marcar() {
    document.querySelectorAll('a[href*="checkout.zunocast.com/c/"]').forEach(function (a) { a.href = checkout(a.href); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', marcar);
  else marcar();
  // Link montado depois (site.js) também sai marcado, na hora do clique.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href*="checkout.zunocast.com/c/"]') : null;
    if (a) a.href = checkout(a.href);
  }, true);
})();

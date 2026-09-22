// Links de compra de cada plano (checkout do ERP). Enquanto um plano nao tiver
// link, o botao dele continua levando para a secao de planos.
const CHECKOUT = {
  noar: 'https://checkout.zunocast.com/c/rozbjmb',
  estudio: 'https://checkout.zunocast.com/c/ws361cd',
  emissora: 'https://checkout.zunocast.com/c/tjbqm9a',
};

// WhatsApp do agente de vendas (botao flutuante). Numero com DDI e DDD, so
// digitos, ex.: '5586999999999'. Vazio = botao escondido.
const WHATSAPP = {
  numero: '5511943278663',
  mensagem: 'Olá! Vim pelo site da Zunocast e quero saber mais sobre a web rádio.',
};

// Radios de exemplo no celular: a replica do app (PWA) que o cliente recebe,
// cada uma com logo e fundo de uma radio ficticia. "O seu estilo" mostra o
// app como ele sai do provisionamento (logo e fundo padrao do painel).
// icone = cor do triangulo do play (no app real, a cor do fundo vaza por ele).
// audio = trecho de musica da Pixabay (licenca de uso comercial, sem credito
// obrigatorio); faixa = o que o app mostra enquanto toca, como o metadado
// "Artista - Musica" da radio de verdade.
const DEMO = 'assets/img/demo/';
const AUDIO = 'assets/audio/demo/';
const ESTACOES = {
  louvor: {
    nome: 'Rádio Som do Céu', musica: 'Manhã de Louvor', faixa: 'BatidasdoCeu - Firme na Rocha',
    logo: `${DEMO}logo-louvor.svg`, fundo: `${DEMO}fundo-louvor.svg`, icone: '#232766', audio: `${AUDIO}louvor.mp3`,
  },
  flashback: {
    nome: 'Flashback da Serra', musica: 'Clássicos dos anos 80', faixa: "Lesiakower - 80's Nostalgia",
    logo: `${DEMO}logo-flashback.svg`, fundo: `${DEMO}fundo-flashback.svg`, icone: '#6e1a68', audio: `${AUDIO}flashback.mp3`,
  },
  noticias: {
    nome: 'Voz do Vale', musica: 'Jornal da Cidade, ao vivo', faixa: 'Abertura - Jornal da Cidade',
    logo: `${DEMO}logo-noticias.svg`, fundo: `${DEMO}fundo-noticias.svg`, icone: '#0b2252', audio: `${AUDIO}noticias.mp3`,
  },
  sertanejo: {
    nome: 'Modão Raiz', musica: 'Viola e Saudade', faixa: 'InácioDantas - Festa do Interior',
    logo: `${DEMO}logo-sertanejo.svg`, fundo: `${DEMO}fundo-sertanejo.svg`, icone: '#652a3b', audio: `${AUDIO}sertanejo.mp3`,
  },
  seu: {
    nome: 'A Sua Rádio', musica: 'A programação que você escolher', faixa: 'Eliete Campos - Parte da Paisagem',
    logo: `${DEMO}logo-seu.jpg`, fundo: `${DEMO}fundo-seu.jpg`, icone: '#1B2C6B', audio: `${AUDIO}seu.mp3`,
  },
};

// Baixa as imagens de todas as radios antes do primeiro clique, para a troca
// nao piscar com o celular vazio.
Object.values(ESTACOES).forEach(({ logo, fundo }) => {
  new Image().src = logo;
  new Image().src = fundo;
});

const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// O unico momento de movimento da pagina: no fecho, a placa NO AR acende
// quando aparece na tela, com duas piscadas, como lampada de estudio.
const placa = document.getElementById('placa');
function acender() {
  placa.classList.add('placa--piscando');
  setTimeout(() => placa.classList.add('placa--acesa'), 900);
}
if (placa) {
  if (reduzir || !('IntersectionObserver' in window)) {
    placa.classList.add('placa--acesa');
  } else {
    const olho = new IntersectionObserver((entradas) => {
      if (entradas.some((e) => e.isIntersecting)) {
        olho.disconnect();
        setTimeout(acender, 250);
      }
    }, { threshold: 0.9 });
    olho.observe(placa);
  }
}

const fone = document.querySelector('.fone');
const teclas = document.querySelectorAll('.tecla');

const demo = {
  nome: document.getElementById('demo-nome'),
  musica: document.getElementById('demo-musica'),
  logo: document.getElementById('demo-logo'),
  fundo: document.getElementById('demo-fundo'),
  play: document.getElementById('demo-play'),
  audio: document.getElementById('demo-audio'),
};
let atual = ESTACOES.louvor;
const tocando = () => !demo.audio.paused;

// O app real rola o nome da musica quando ele nao cabe na largura.
function letreiro() {
  const linha = demo.musica.parentElement;
  linha.classList.remove('app__musica--rolando');
  const sobra = demo.musica.scrollWidth - linha.clientWidth;
  if (sobra > 0 && !reduzir) {
    linha.style.setProperty('--rolar', `${-sobra}px`);
    linha.classList.add('app__musica--rolando');
  }
}

// Parado, a linha mostra o programa; tocando, "Artista - Musica", como o app.
function mostrarMusica() {
  demo.musica.textContent = tocando() ? atual.faixa : atual.musica;
  demo.play.setAttribute('aria-pressed', String(tocando()));
  demo.play.setAttribute('aria-label', `${tocando() ? 'Pausar' : 'Ouvir'} a ${atual.nome}`);
  letreiro();
}

function preencher(dados) {
  const continuar = tocando();
  atual = dados;
  demo.nome.textContent = dados.nome;
  demo.logo.src = dados.logo;
  demo.logo.alt = `Logo da ${dados.nome}`;
  demo.fundo.src = dados.fundo;
  fone.style.setProperty('--app-icone', dados.icone);
  // Trocar de radio com o som ligado ja toca a proxima, como no app real.
  if (!demo.audio.src.endsWith(dados.audio)) {
    demo.audio.src = dados.audio;
    if (continuar) demo.audio.play().catch(() => {});
  }
  mostrarMusica();
}

// So toca quando a pessoa aperta o play: nada de som sozinho na pagina.
demo.play.addEventListener('click', () => {
  if (tocando()) {
    demo.audio.pause();
  } else {
    demo.audio.play().catch(() => {});
  }
});
demo.audio.addEventListener('play', mostrarMusica);
demo.audio.addEventListener('pause', mostrarMusica);

function sintonizar(chave) {
  teclas.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.estacao === chave)));
  if (reduzir) {
    preencher(ESTACOES[chave]);
    return;
  }
  fone.classList.add('fone--trocando');
  setTimeout(() => {
    preencher(ESTACOES[chave]);
    fone.classList.remove('fone--trocando');
  }, 180);
}

teclas.forEach((t) => t.addEventListener('click', () => sintonizar(t.dataset.estacao)));
preencher(ESTACOES.louvor);
// A fonte do app chega depois do primeiro desenho e muda a largura do texto.
if (document.fonts) document.fonts.ready.then(letreiro);
window.addEventListener('resize', letreiro);

document.querySelectorAll('[data-plano]').forEach((a) => {
  const link = CHECKOUT[a.dataset.plano];
  if (link) a.href = link;
});

const whats = document.getElementById('whats');
if (whats && WHATSAPP.numero) {
  whats.href = `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(WHATSAPP.mensagem)}`;
  whats.hidden = false;
}

// Carrossel de estilos (rádios de exemplo). Passa sozinho a cada 5 s; para de
// vez quando o visitante clica numa seta ou num ponto, e pausa enquanto o mouse
// ou o foco estão nele. Sem animação para quem pede menos movimento.
const trilho = document.getElementById('carrossel-trilho');
if (trilho) {
  const slides = [...trilho.children];
  const pontos = [...document.querySelectorAll('.carrossel__ponto')];
  const caixa = trilho.parentElement;
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let atual = 0;
  let parado = semMovimento;
  let pausa = false;

  const ir = (i) => {
    atual = (i + slides.length) % slides.length;
    pontos.forEach((p, k) => p.setAttribute('aria-current', String(k === atual)));
    // 'auto' seguiria o scroll-behavior do CSS (suave); sem movimento é 'instant'.
    trilho.scrollTo({ left: slides[atual].offsetLeft, behavior: semMovimento ? 'instant' : 'smooth' });
  };
  const marcar = () => {
    const i = Math.round(trilho.scrollLeft / trilho.clientWidth);
    atual = Math.max(0, Math.min(slides.length - 1, i));
    pontos.forEach((p, k) => p.setAttribute('aria-current', String(k === atual)));
  };
  let espera;
  trilho.addEventListener('scroll', () => { clearTimeout(espera); espera = setTimeout(marcar, 80); });
  caixa.querySelectorAll('[data-passo]').forEach((b) => b.addEventListener('click', () => {
    parado = true;
    ir(atual + Number(b.dataset.passo));
  }));
  pontos.forEach((p) => p.addEventListener('click', () => { parado = true; ir(Number(p.dataset.ir)); }));
  ['mouseenter', 'focusin'].forEach((e) => caixa.addEventListener(e, () => { pausa = true; }));
  ['mouseleave', 'focusout'].forEach((e) => caixa.addEventListener(e, () => { pausa = false; }));
  trilho.addEventListener('touchstart', () => { parado = true; }, { passive: true });
  setInterval(() => {
    if (!parado && !pausa && !document.hidden) ir(atual + 1);
  }, 5000);
}

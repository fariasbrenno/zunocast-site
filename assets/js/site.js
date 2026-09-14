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
  numero: '',
  mensagem: 'Olá! Vim pelo site da Zunocast e quero saber mais sobre a web rádio.',
};

// Radios de exemplo no celular: a replica do app (PWA) que o cliente recebe,
// cada uma com logo e fundo de uma radio ficticia. "O seu estilo" mostra o
// app como ele sai do provisionamento (logo e fundo padrao do painel).
// icone = cor do triangulo do play (no app real, a cor do fundo vaza por ele).
const DEMO = 'assets/img/demo/';
const ESTACOES = {
  louvor: {
    nome: 'Rádio Som do Céu', musica: 'Manhã de Louvor',
    logo: `${DEMO}logo-louvor.svg`, fundo: `${DEMO}fundo-louvor.svg`, icone: '#232766',
  },
  flashback: {
    nome: 'Flashback da Serra', musica: 'Clássicos dos anos 80',
    logo: `${DEMO}logo-flashback.svg`, fundo: `${DEMO}fundo-flashback.svg`, icone: '#6e1a68',
  },
  noticias: {
    nome: 'Voz do Vale', musica: 'Jornal da Cidade, ao vivo',
    logo: `${DEMO}logo-noticias.svg`, fundo: `${DEMO}fundo-noticias.svg`, icone: '#0b2252',
  },
  sertanejo: {
    nome: 'Modão Raiz', musica: 'Viola e Saudade',
    logo: `${DEMO}logo-sertanejo.svg`, fundo: `${DEMO}fundo-sertanejo.svg`, icone: '#652a3b',
  },
  seu: {
    nome: 'A Sua Rádio', musica: 'A programação que você escolher',
    logo: `${DEMO}logo-seu.jpg`, fundo: `${DEMO}fundo-seu.jpg`, icone: '#1B2C6B',
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
};

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

function preencher(dados) {
  demo.nome.textContent = dados.nome;
  demo.musica.textContent = dados.musica;
  demo.logo.src = dados.logo;
  demo.logo.alt = `Logo da ${dados.nome}`;
  demo.fundo.src = dados.fundo;
  fone.style.setProperty('--app-icone', dados.icone);
  letreiro();
}

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

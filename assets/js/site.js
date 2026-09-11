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

// Radios de exemplo do celular. Nomes ficticios.
const ESTACOES = {
  louvor: {
    endereco: 'somdoceu.zunofm.com', nome: 'Rádio Som do Céu', ouvintes: '37 ouvindo',
    programa: 'Manhã de Louvor',
    autor1: 'Irmã Célia', msg1: 'Graça e paz! Ouvindo daqui do trabalho.',
    autor2: 'Pr. Anderson', msg2: 'Hoje tem culto ao vivo às 19h.',
  },
  flashback: {
    endereco: 'flashbackdaserra.zunofm.com', nome: 'Flashback da Serra', ouvintes: '52 ouvindo',
    programa: 'Clássicos dos anos 80',
    autor1: 'Marcos', msg1: 'Essa me lembra o baile de sábado!',
    autor2: 'Rita', msg2: 'Toca aquela lenta, por favor.',
  },
  noticias: {
    endereco: 'vozdovale.zunofm.com', nome: 'Voz do Vale', ouvintes: '118 ouvindo',
    programa: 'Jornal da Cidade, ao vivo',
    autor1: 'Seu Zé da feira', msg1: 'Manda um alô pro pessoal do mercado!',
    autor2: 'Paula', msg2: 'A estrada pro sítio já foi liberada?',
  },
  sertanejo: {
    endereco: 'modaoraiz.zunofm.com', nome: 'Modão Raiz', ouvintes: '64 ouvindo',
    programa: 'Viola e Saudade',
    autor1: 'Tião', msg1: 'Ouvindo aqui na roça, som limpinho.',
    autor2: 'Dona Lurdes', msg2: 'Oferece essa pro meu marido!',
  },
  seu: {
    endereco: 'suaradio.zunofm.com', nome: 'A Sua Rádio', ouvintes: '12 ouvindo',
    programa: 'A programação que você escolher',
    autor1: 'Ouvinte', msg1: 'Primeira vez aqui, gostei!',
    autor2: 'Você', msg2: 'Seja bem-vindo! Manda seu pedido.',
  },
};

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

function preencher(dados) {
  for (const [campo, valor] of Object.entries(dados)) {
    const alvo = document.getElementById(`demo-${campo}`);
    if (alvo) alvo.textContent = valor;
  }
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

document.querySelectorAll('[data-plano]').forEach((a) => {
  const link = CHECKOUT[a.dataset.plano];
  if (link) a.href = link;
});

const whats = document.getElementById('whats');
if (whats && WHATSAPP.numero) {
  whats.href = `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(WHATSAPP.mensagem)}`;
  whats.hidden = false;
}

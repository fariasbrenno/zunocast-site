"""
Gera as páginas de link curto dos planos e a página "Escolha seu plano".

  zunocast.com/no-ar      -> checkout do No Ar     (quem já decidiu)
  zunocast.com/estudio    -> checkout do Estúdio
  zunocast.com/emissora   -> checkout do Emissora
  zunocast.com/planos     -> vitrine dos três planos (quem ainda não decidiu)

São links para o WhatsApp de vendas (17/09/2026): no lugar do
"checkout.zunocast.com/c/rozbjmb", a pessoa recebe um link com a marca, que
aparece no WhatsApp como cartão com a imagem do plano (og:image). As páginas
dos planos só redirecionam; quem lê a prévia não roda JavaScript, então o
cartão sai certo.

Mudou preço, link de checkout ou recurso: altere PLANOS abaixo e rode
    python scripts/gerar-links-planos.py
"""
import html
import io
import os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://zunocast.com'
WHATSAPP_VENDAS = '5511943278663'
# Origem da venda no relatório do checkout.
UTM = 'utm_source=whatsapp&utm_medium=atendimento&utm_campaign=link-plano'

PLANOS = [
    {
        'chave': 'noar', 'pasta': 'no-ar', 'nome': 'No Ar', 'preco': '39,90', 'dia': '1,33',
        'checkout': 'https://checkout.zunocast.com/c/rozbjmb',
        'para': 'Para começar e para rádios de comunidade.',
        'medidores': [('Ouvintes', 2, 'até 100 ao mesmo tempo'), ('Som', 5, 'bom'), ('Músicas', 3, 'cerca de 2.500')],
        'extra': '1 rádio',
        'resumo': 'Até 100 ouvintes ao mesmo tempo, site, app e bate-papo, e suporte remoto incluso.',
    },
    {
        'chave': 'estudio', 'pasta': 'estudio', 'nome': 'Estúdio', 'preco': '69,90', 'dia': '2,33', 'destaque': True,
        'checkout': 'https://checkout.zunocast.com/c/ws361cd',
        'para': 'O recomendado para a maioria: som de FM e espaço de sobra.',
        'medidores': [('Ouvintes', 5, 'até 500 ao mesmo tempo'), ('Som', 7, 'de FM'), ('Músicas', 6, 'cerca de 5.000')],
        'extra': '1 rádio',
        'resumo': 'Até 500 ouvintes ao mesmo tempo, som de FM, site, app e bate-papo, e suporte remoto incluso.',
    },
    {
        'chave': 'emissora', 'pasta': 'emissora', 'nome': 'Emissora', 'preco': '139,90', 'dia': '4,66',
        'checkout': 'https://checkout.zunocast.com/c/tjbqm9a',
        'para': 'Para público grande ou para quem quer duas rádios.',
        'medidores': [('Ouvintes', 10, 'ilimitados*'), ('Som', 10, 'alta qualidade'), ('Músicas', 9, 'cerca de 7.500 por rádio')],
        'extra': '2 rádios e prioridade no suporte',
        'resumo': 'Duas rádios, ouvintes ilimitados, som de alta qualidade e prioridade no suporte remoto.',
    },
]

E = html.escape


def gravar(caminho, conteudo):
    destino = os.path.join(RAIZ, caminho)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    io.open(destino, 'w', encoding='utf-8', newline='\n').write(conteudo)
    print('ok', caminho)


def link_checkout(p):
    return p['checkout'] + '?' + UTM


def cabeca(titulo, descricao, url, imagem, extra=''):
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(titulo)}</title>
<meta name="description" content="{E(descricao)}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#0E1638">
<link rel="icon" href="/assets/img/marca/zunocast-icone.svg" type="image/svg+xml">
<link rel="icon" href="/assets/img/marca/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/marca/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Zunocast">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{E(titulo)}">
<meta property="og:description" content="{E(descricao)}">
<meta property="og:image" content="{SITE}/assets/img/og/{imagem}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{E(titulo)}">
<meta name="twitter:card" content="summary_large_image">
{extra}</head>
'''


def pagina_do_plano(p):
    url = f'{SITE}/{p["pasta"]}/'
    destino = link_checkout(p)
    titulo = f'Plano {p["nome"]} | Zunocast — R$ {p["preco"]}/mês'
    extra = (f'<meta name="robots" content="noindex">\n'
             f'<meta http-equiv="refresh" content="0; url={E(destino)}">\n'
             '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0E1638;color:#fff;'
             'font-family:"Segoe UI",Roboto,Arial,sans-serif;text-align:center;padding:1.5rem}'
             'img{height:2rem}p{margin:1.5rem 0;font-size:1.15rem}'
             'a.b{display:inline-block;background:#CC3A1F;color:#fff;font-weight:700;text-decoration:none;'
             'padding:.9rem 1.6rem;border-radius:10px}</style>\n')
    return cabeca(titulo, p['resumo'] + ' Sem fidelidade.', url, f'og-{p["chave"]}.jpg', extra) + f'''<body>
<main>
  <img src="/assets/img/marca/zunocast-horizontal-branco.svg" alt="Zunocast">
  <p>Abrindo o pagamento do plano <strong>{E(p["nome"])}</strong>…</p>
  <a class="b" href="{E(destino)}">Continuar para o pagamento</a>
</main>
<script>location.replace({destino!r});</script>
</body>
</html>
'''


def canal(p):
    medidores = ''.join(
        f'<div><dt>{E(r)}</dt><dd><span class="vu" style="--n:{n}" aria-hidden="true"></span>{E(t)}</dd></div>'
        for r, n, t in p['medidores']
    )
    destaque = p.get('destaque')
    return f'''      <article class="canal{' canal--destaque' if destaque else ''}">
        {'<p class="canal__selo">Recomendado</p>' if destaque else ''}
        <h2 class="fita">{E(p["nome"])}</h2>
        <p class="canal__para">{E(p["para"])}</p>
        <p class="canal__preco"><span class="canal__rs">R$</span>{p["preco"]}<span class="canal__mes">/mês</span></p>
        <p class="canal__dia">R$ {p["dia"]} por dia</p>
        <dl class="medidores">{medidores}</dl>
        <p class="canal__extra">{E(p["extra"])}</p>
        <a class="botao {'botao--coral' if destaque else 'botao--mesa'}" href="{E(link_checkout(p))}">Quero o {E(p["nome"])}</a>
      </article>
'''


def pagina_de_escolha():
    url = f'{SITE}/planos/'
    whats = (f'https://wa.me/{WHATSAPP_VENDAS}?text='
             + 'Oi%21%20Estou%20na%20p%C3%A1gina%20de%20planos%20e%20fiquei%20com%20uma%20d%C3%BAvida.')
    extra = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
             '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
             '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Permanent+Marker&display=swap">\n'
             '<link rel="stylesheet" href="/assets/css/site.css">\n'
             '<style>\n'
             '.escolha { background: var(--madrugada); color: var(--branco); min-height: 100vh; }\n'
             '.escolha__topo { padding: 1.25rem 0; }\n'
             '.escolha__cabeca { padding: 1.5rem 0 0; max-width: 44rem; }\n'
             '.escolha__cabeca h1 { font-size: clamp(2.1rem, 6vw, 3.4rem); }\n'
             '.escolha__cabeca p { margin: 0.9rem 0 0; color: var(--no-escuro); }\n'
             '.escolha .mesa { margin-top: 2rem; }\n'
             '.canal .fita { font-size: 1.65rem; }\n'
             '.canal__para { margin: 1rem 0 0; color: var(--no-escuro); font-size: 0.98rem; line-height: 1.45; }\n'
             '.canal__preco { margin-top: 1rem; }\n'
             '.escolha__duvida { margin-top: 2.5rem; padding: 1.4rem; border-radius: 14px; background: var(--console);'
             ' display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 1.5rem; }\n'
             '.escolha__duvida p { margin: 0; flex: 1 1 16rem; }\n'
             '.escolha .rodape { margin-top: 3rem; }\n'
             '</style>\n')
    titulo = 'Escolha o plano da sua rádio | Zunocast'
    descricao = 'No Ar, Estúdio ou Emissora: todos com site, app, bate-papo, mais de 140 programas e programetes e suporte remoto. A partir de R$ 39,90 por mês, sem fidelidade.'
    icones = '''<svg class="sprite" aria-hidden="true" focusable="false">
  <symbol id="i-relogio" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></symbol>
  <symbol id="i-site" viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 9h18M6.5 6.8h.01M9 6.8h.01"/></symbol>
  <symbol id="i-microfone" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></symbol>
  <symbol id="i-celular" viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></symbol>
  <symbol id="i-programa" viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M7 9.5h6M7 13h4M7 16.5h7"/><path d="M15.5 11.5l3 1.8-3 1.8z"/></symbol>
  <symbol id="i-suporte" viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4.5" height="6" rx="1.8"/><rect x="16.5" y="14" width="4.5" height="6" rx="1.8"/></symbol>
  <symbol id="i-livre" viewBox="0 0 24 24"><rect x="4" y="10.5" width="16" height="10" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 7.6-1.7"/></symbol>
</svg>'''
    return cabeca(titulo, descricao, url, 'og-planos.jpg', extra) + f'''<body>
{icones}
<div class="escolha">
  <header class="caixa escolha__topo">
    <a class="marca" href="/" aria-label="Zunocast, início"><img src="/assets/img/marca/zunocast-horizontal-branco.svg" alt="Zunocast" width="143" height="30"></a>
  </header>
  <main class="caixa">
    <div class="escolha__cabeca">
      <h1>Escolha o plano da sua rádio</h1>
      <p>Todos já vêm com a rádio tocando 24 horas, site, aplicativo, bate-papo, mais de 140 programas e programetes e suporte remoto. Preço por mês, sem fidelidade e sem taxa de instalação.</p>
    </div>
    <div class="mesa">
{''.join(canal(p) for p in PLANOS)}    </div>
    <div class="todos">
      <h3>Em todos os planos</h3>
      <ul>
        <li><svg class="icone"><use href="#i-relogio"/></svg>Toca 24 horas sozinha</li>
        <li><svg class="icone"><use href="#i-programa"/></svg>Mais de 140 programas e programetes</li>
        <li><svg class="icone"><use href="#i-site"/></svg>Site com player e bate-papo</li>
        <li><svg class="icone"><use href="#i-microfone"/></svg>Ao vivo pelo navegador</li>
        <li><svg class="icone"><use href="#i-celular"/></svg>Aplicativo pro ouvinte</li>
        <li><svg class="icone"><use href="#i-suporte"/></svg>Suporte remoto</li>
        <li><svg class="icone"><use href="#i-livre"/></svg>Cancela quando quiser</li>
      </ul>
    </div>
    <div class="escolha__duvida">
      <p>Ficou em dúvida sobre qual escolher? A gente te ajuda pelo WhatsApp.</p>
      <a class="botao botao--claro" href="{E(whats)}">Falar no WhatsApp</a>
    </div>
    <p class="uso-justo">*Ouvintes ilimitados dentro do uso justo. Para proteger a qualidade de todas as rádios, o servidor tem um limite de segurança de 1.000 pessoas ao mesmo tempo por rádio. Se a sua passar disso, a gente conversa com você.</p>
  </main>
  <footer class="rodape">
    <div class="caixa rodape__linha">
      <ul>
        <li><a href="/">zunocast.com</a></li>
        <li><a href="https://cliente.zunocast.com/login">Área do cliente</a></li>
        <li><a href="mailto:contato@zunocast.com">contato@zunocast.com</a></li>
      </ul>
      <p>© 2026 Zunocast</p>
    </div>
  </footer>
</div>
</body>
</html>
'''


for p in PLANOS:
    gravar(f'{p["pasta"]}/index.html', pagina_do_plano(p))
gravar('planos/index.html', pagina_de_escolha())

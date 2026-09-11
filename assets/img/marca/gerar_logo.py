# Gera os arquivos vetoriais do logo Zunocast (conceito 2: Z de duas barras
# com a luz NO AR no centro), redesenhado com geometria exata.
import os

NOITE = "#1B2C6B"
CORAL = "#FF6A45"
BRANCO = "#FFFFFF"

# "zunocast" em Outfit ExtraBold (SIL OFL), tamanho 100, linha de base em y=0.
# Contorno extraido com opentype.js a partir do TTF oficial (Outfitio/Outfit-Fonts).
NOME = (
    "M46.30 0L2.20 0L2.20-10.40L22.30-34.70L3.90-34.70L3.90-48.90L46.90-48.90L46.90-38.50L26.80-14.20L46.30-14.20L46.30 0Z"
    "M77 1.10L77 1.10Q70.10 1.10 64.75-1.65Q59.40-4.40 56.35-9.30Q53.30-14.20 53.30-20.60L53.30-20.60L53.30-48.90L70.70-48.90L70.70-20.60Q70.70-17.50 72.45-15.75Q74.20-14 77-14L77-14Q79.80-14 81.55-15.75Q83.30-17.50 83.30-20.60L83.30-20.60L83.30-48.90L100.70-48.90L100.70-20.60Q100.70-14.20 97.70-9.30Q94.70-4.40 89.35-1.65Q84 1.10 77 1.10Z"
    "M127 0L109.60 0L109.60-48.90L127-48.90L127-45.70Q132.40-49.90 140.30-49.90L140.30-49.90Q145.50-49.90 149.70-47.45Q153.90-45 156.30-40.85Q158.70-36.70 158.70-31.60L158.70-31.60L158.70 0L141.30 0L141.30-27.60Q141.30-31 139.25-32.95Q137.20-34.90 134.20-34.90L134.20-34.90Q131.10-34.90 129.05-32.95Q127-31 127-27.60L127-27.60L127 0Z"
    "M192 1.10L192 1.10Q184.10 1.10 177.95-2.25Q171.80-5.60 168.20-11.40Q164.60-17.20 164.60-24.60L164.60-24.60Q164.60-31.80 168.15-37.60Q171.70-43.40 177.85-46.75Q184-50.10 191.90-50.10L191.90-50.10Q199.70-50.10 205.90-46.75Q212.10-43.40 215.65-37.65Q219.20-31.90 219.20-24.60L219.20-24.60Q219.20-17.20 215.65-11.40Q212.10-5.60 205.95-2.25Q199.80 1.10 192 1.10Z"
    "M191.90-14.40L191.90-14.40Q196.20-14.40 198.85-17.20Q201.50-20 201.50-24.50L201.50-24.50Q201.50-29 198.85-31.75Q196.20-34.50 191.90-34.50L191.90-34.50Q187.60-34.50 184.95-31.70Q182.30-28.90 182.30-24.40L182.30-24.40Q182.30-19.90 184.95-17.15Q187.60-14.40 191.90-14.40Z"
    "M250.30 1.10L250.30 1.10Q242.50 1.10 236.25-2.20Q230-5.50 226.40-11.25Q222.80-17 222.80-24.40L222.80-24.40Q222.80-31.80 226.45-37.60Q230.10-43.40 236.35-46.75Q242.60-50.10 250.50-50.10L250.50-50.10Q261.80-50.10 269.50-42.50L269.50-42.50L258.50-31.50Q255.50-34.50 250.50-34.50L250.50-34.50Q246.20-34.50 243.35-31.75Q240.50-29 240.50-24.50L240.50-24.50Q240.50-20 243.40-17.20Q246.30-14.40 250.50-14.40L250.50-14.40Q253.30-14.40 255.30-15.30Q257.30-16.20 258.80-17.90L258.80-17.90L269.90-6.90Q265.70-2.80 261-0.85Q256.30 1.10 250.30 1.10Z"
    "M295.30 1L295.30 1Q288.50 1 283.20-2.30Q277.90-5.60 274.90-11.35Q271.90-17.10 271.90-24.40L271.90-24.40Q271.90-31.80 274.90-37.55Q277.90-43.30 283.20-46.60Q288.50-49.90 295.30-49.90L295.30-49.90Q299-49.90 302.25-48.75Q305.50-47.60 307.90-45.50L307.90-45.50L307.90-48.90L325-48.90L325 0L307.90 0L307.90-3.30Q305.50-1.30 302.25-0.15Q299 1 295.30 1Z"
    "M299-14.50L299-14.50Q303.30-14.50 305.95-17.25Q308.60-20 308.60-24.50L308.60-24.50Q308.60-28.80 305.95-31.60Q303.30-34.40 299.10-34.40L299.10-34.40Q294.90-34.40 292.20-31.60Q289.50-28.80 289.50-24.50L289.50-24.50Q289.50-20.10 292.20-17.30Q294.90-14.50 299-14.50Z"
    "M353.80 1.40L353.80 1.40Q347.10 1.40 340.70-1.15Q334.30-3.70 330.50-7.80L330.50-7.80L340-17.50Q342.40-15 345.75-13.60Q349.10-12.20 352.90-12.20L352.90-12.20Q357.40-12.20 357.40-14.50L357.40-14.50Q357.40-16.10 355.75-16.95Q354.10-17.80 351.45-18.45Q348.80-19.10 345.85-20Q342.90-20.90 340.30-22.55Q337.70-24.20 336-27.05Q334.30-29.90 334.30-34.50L334.30-34.50Q334.30-39.10 336.85-42.70Q339.40-46.30 344-48.35Q348.60-50.40 354.80-50.40L354.80-50.40Q361.10-50.40 366.80-48.25Q372.50-46.10 376-41.80L376-41.80L366.40-32.10Q364-34.80 361.10-35.85Q358.20-36.90 355.80-36.90L355.80-36.90Q351.50-36.90 351.50-34.50L351.50-34.50Q351.50-33.10 353.15-32.35Q354.80-31.60 357.40-30.95Q360-30.30 362.95-29.30Q365.90-28.30 368.50-26.55Q371.10-24.80 372.75-21.85Q374.40-18.90 374.40-14.40L374.40-14.40Q374.40-7.10 368.80-2.85Q363.20 1.40 353.80 1.40Z"
    "M406.40 0L389.00 0L389.00-34.40L378.20-34.40L378.20-48.90L389.00-48.90L389.00-69.10L406.40-69.10L406.40-48.90L417.20-48.90L417.20-34.40L406.40-34.40L406.40 0Z"
)

# Simbolo em 110 x 100. Duas pecas identicas (a segunda girada 180 graus em
# torno do centro 55,50): cada uma e uma barra do Z que termina em ponta,
# contornando o anel em volta da luz. O anel tem raio 22,7 e encosta na face
# de baixo da barra (y = 27,3); a luz tem raio 13,2.
PECA = "M10 0H100A10 10 0 0 1 110 10V23.5L74.6 60.2A22.7 22.7 0 0 0 55 27.3H9A9 9 0 0 1 0 18.3V10A10 10 0 0 1 10 0Z"


def simbolo(cor, luz=CORAL):
    return (f'<path fill="{cor}" d="{PECA}"/>'
            f'<path fill="{cor}" transform="rotate(180 55 50)" d="{PECA}"/>'
            f'<circle cx="55" cy="50" r="13.2" fill="{luz}"/>')


def svg(vb, corpo, titulo):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{titulo}">'
            f'<title>{titulo}</title>{corpo}</svg>\n')


# Versao horizontal: nome com x-height = simbolo / 2,44, centrado no simbolo.
ESC = 0.828
BASE = 78.6
X_NOME = 128.7
LARGURA = 476


def horizontal(cor_simbolo, cor_nome):
    nome = f'<path fill="{cor_nome}" transform="translate({X_NOME} {BASE}) scale({ESC})" d="{NOME}"/>'
    return svg(f"0 0 {LARGURA} 100", simbolo(cor_simbolo) + nome, "Zunocast")


def icone(cantos):
    # Quadrado azul-noite com o simbolo branco; ~62% da area, centrado.
    fundo = f'<rect width="512" height="512" rx="{cantos}" fill="{NOITE}"/>'
    s = 3.0  # 110 x 3 = 330 de largura
    dx, dy = (512 - 110 * s) / 2, (512 - 100 * s) / 2
    return svg("0 0 512 512", fundo + f'<g transform="translate({dx} {dy}) scale({s})">{simbolo(BRANCO)}</g>', "Zunocast")


def gravar(pasta, nome, conteudo):
    os.makedirs(pasta, exist_ok=True)
    with open(os.path.join(pasta, nome), "w", encoding="utf-8", newline="\n") as f:
        f.write(conteudo)


if __name__ == "__main__":
    import sys
    destino = sys.argv[1]
    gravar(destino, "zunocast-simbolo.svg", svg("0 0 110 100", simbolo(NOITE), "Zunocast"))
    gravar(destino, "zunocast-simbolo-branco.svg", svg("0 0 110 100", simbolo(BRANCO), "Zunocast"))
    gravar(destino, "zunocast-horizontal.svg", horizontal(NOITE, NOITE))
    gravar(destino, "zunocast-horizontal-branco.svg", horizontal(BRANCO, BRANCO))
    gravar(destino, "zunocast-icone.svg", icone(112))
    gravar(destino, "zunocast-icone-quadrado.svg", icone(0))
    print("ok", sorted(os.listdir(destino)))

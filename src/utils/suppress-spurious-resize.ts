/**
 * O Chrome dispara um evento `resize` na janela do popup da extensão quando o
 * conteúdo do Radix Select é montado, mesmo sem nenhuma mudança de dimensão
 * (medido: 384x310 antes e depois). O Radix fecha o Select em qualquer resize:
 *
 *   const close = () => onOpenChange(false);
 *   window.addEventListener("resize", close);
 *
 * O resultado é o dropdown abrindo e fechando instantaneamente.
 *
 * Este listener é registrado em fase de captura antes do React montar, portanto
 * roda antes do listener do Radix e pode interrompê-lo. Só engole o evento
 * quando largura e altura permanecem iguais — um resize real continua passando.
 */
export function suppressSpuriousResize() {
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;

  window.addEventListener(
    "resize",
    (event) => {
      const { innerWidth, innerHeight } = window;

      if (innerWidth === lastWidth && innerHeight === lastHeight) {
        event.stopImmediatePropagation();
        return;
      }

      lastWidth = innerWidth;
      lastHeight = innerHeight;
    },
    true
  );
}

export const DEFAULT_FONT_SIZE = 12;
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 32;

/** Proporção que o popup antigo já usava entre tamanho de fonte e entrelinha. */
const LINE_HEIGHT_RATIO = 1.4;

export function themeFiles(theme: string) {
  return [`/styles/${theme}-theme.css`];
}

/**
 * O CSS é gerado com os valores embutidos em vez de usar custom properties.
 * Trocar o tamanho vira então um removeCSS da string anterior seguido de um
 * insertCSS da nova — a mesma mecânica dos temas — sem depender da ordem em
 * que as folhas foram injetadas para saber qual valor vence.
 */
export function fontSizeCss(fontSize: number) {
  const lineHeight = Math.round(fontSize * LINE_HEIGHT_RATIO * 100) / 100;

  return `.code-container .CodeMirror,
.code-container .CodeMirror div,
.code-container textarea {
  font-size: ${fontSize}px;
  line-height: ${lineHeight}px;
}`;
}

export function clampFontSize(fontSize: number) {
  return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(fontSize)));
}

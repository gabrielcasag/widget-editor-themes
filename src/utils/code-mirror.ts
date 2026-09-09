/**
 * O CodeMirror mede a largura do caractere e a altura da linha uma vez e guarda
 * o resultado. Trocar o CSS por baixo dele não invalida esse cache, então ele
 * segue convertendo posição de cursor em pixels com as métricas antigas — o
 * cursor e o textarea oculto ficam deslocados até um F5 recriar o editor.
 * `refresh()` força a remedição, que é o que o reload fazia implicitamente.
 *
 * Roda no mundo MAIN porque a instância vive numa propriedade expando que o
 * script da própria página põe no elemento (`el.CodeMirror`), invisível para o
 * mundo isolado em que as extensões executam por padrão.
 */
export async function refreshCodeMirror(tabId: number) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: () => {
        document.querySelectorAll(".CodeMirror").forEach((element) => {
          const instance = (
            element as unknown as { CodeMirror?: { refresh?: () => void } }
          ).CodeMirror;

          instance?.refresh?.();
        });
      },
    });
  } catch (error) {
    console.debug("Widget Editor Themes: CodeMirror refresh failed", error);
  }
}

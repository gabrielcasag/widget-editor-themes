export function isWidgetEditorUrl(url?: string) {
  return url ? url.includes("id=widget_editor") : false;
}

export async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
}

/**
 * Sem host permission para a aba o Chrome esconde a URL, então abas fora do
 * escopo concedido caem fora deste filtro naturalmente — que é o que queremos,
 * já que a injeção nelas seria rejeitada de qualquer forma.
 */
export async function getWidgetEditorTabs() {
  const tabs = await chrome.tabs.query({});

  return tabs.filter(
    (tab) => tab.id !== undefined && isWidgetEditorUrl(tab.url)
  );
}

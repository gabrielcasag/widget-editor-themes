import { getStorageItem } from "./utils/storage";

function isOnWidgetEditorPage(url?: string) {
  return url ? url.includes("id=widget_editor") : false;
}

async function applyStoredTheme(tab?: chrome.tabs.Tab) {
  // Sem host permission para a aba o Chrome esconde a URL, então um `url`
  // ausente já significa que a injeção também não seria permitida.
  if (!tab || tab.id === undefined || !isOnWidgetEditorPage(tab.url)) return;

  const currentTheme = await getStorageItem();

  if (!currentTheme || !currentTheme.active) return;

  const files = [`/styles/${currentTheme.name}-theme.css`];
  const target = { tabId: tab.id };

  try {
    // `insertCSS` empilha uma nova stylesheet a cada chamada e onActivated /
    // onUpdated disparam para a mesma aba. Remover antes mantém idempotente.
    await chrome.scripting.removeCSS({ files, target });
  } catch {
    // nenhum tema injetado nesta aba ainda
  }

  try {
    await chrome.scripting.insertCSS({ files, target });
  } catch (error) {
    console.debug("Widget Editor Themes: theme injection failed", error);
  }
}

async function applyStoredThemeToAllTabs() {
  const tabs = await chrome.tabs.query({});

  await Promise.all(tabs.map((tab) => applyStoredTheme(tab)));
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    applyStoredTheme(await chrome.tabs.get(activeInfo.tabId));
  } catch {
    // aba fechada antes de conseguirmos ler
  }
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  // `complete` cobre load completo (aba nova, aba duplicada, reload);
  // `url` cobre a SPA trocando o `id=` sem recarregar o documento.
  if (changeInfo.status === "complete" || changeInfo.url) {
    applyStoredTheme(tab);
  }
});

// A extensão pode ter sido instalada/atualizada com abas do editor já abertas,
// e o usuário pode conceder a host permission opcional a qualquer momento.
chrome.runtime.onInstalled.addListener(() => applyStoredThemeToAllTabs());
chrome.runtime.onStartup.addListener(() => applyStoredThemeToAllTabs());
chrome.permissions.onAdded.addListener(() => applyStoredThemeToAllTabs());

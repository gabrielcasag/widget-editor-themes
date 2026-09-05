import { getFontSizeItem, getStorageItem } from "./utils/storage";
import { getWidgetEditorTabs, isWidgetEditorUrl } from "./utils/tabs";
import { fontSizeCss, themeFiles } from "./utils/styles";
import { refreshCodeMirror } from "./utils/code-mirror";

type Injection = { files: string[] } | { css: string };

async function applyStoredStyles(tab?: chrome.tabs.Tab) {
  // Sem host permission para a aba o Chrome esconde a URL, então um `url`
  // ausente já significa que a injeção também não seria permitida.
  if (!tab || tab.id === undefined || !isWidgetEditorUrl(tab.url)) return;

  const [currentTheme, fontSize] = await Promise.all([
    getStorageItem(),
    getFontSizeItem(),
  ]);

  const injections: Injection[] = [];

  if (currentTheme && currentTheme.active) {
    injections.push({ files: themeFiles(currentTheme.name) });
  }

  if (fontSize !== null) {
    injections.push({ css: fontSizeCss(fontSize) });
  }

  const target = { tabId: tab.id };

  for (const injection of injections) {
    try {
      // `insertCSS` empilha uma nova stylesheet a cada chamada e onActivated /
      // onUpdated disparam para a mesma aba. Remover antes mantém idempotente.
      await chrome.scripting.removeCSS({ ...injection, target });
    } catch {
      // nada injetado nesta aba ainda
    }

    try {
      await chrome.scripting.insertCSS({ ...injection, target });
    } catch (error) {
      console.debug("Widget Editor Themes: css injection failed", error);
    }
  }

  if (injections.length > 0) await refreshCodeMirror(tab.id);
}

async function applyStoredStylesToAllTabs() {
  const tabs = await getWidgetEditorTabs();

  await Promise.all(tabs.map((tab) => applyStoredStyles(tab)));
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    applyStoredStyles(await chrome.tabs.get(activeInfo.tabId));
  } catch {
    // aba fechada antes de conseguirmos ler
  }
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  // `complete` cobre load completo (aba nova, aba duplicada, reload);
  // `url` cobre a SPA trocando o `id=` sem recarregar o documento.
  if (changeInfo.status === "complete" || changeInfo.url) {
    applyStoredStyles(tab);
  }
});

// A extensão pode ter sido instalada/atualizada com abas do editor já abertas,
// e o usuário pode conceder a host permission opcional a qualquer momento.
chrome.runtime.onInstalled.addListener(() => applyStoredStylesToAllTabs());
chrome.runtime.onStartup.addListener(() => applyStoredStylesToAllTabs());
chrome.permissions.onAdded.addListener(() => applyStoredStylesToAllTabs());

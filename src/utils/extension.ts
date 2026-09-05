import { clearStorage, getStorageItem, setStorageItem } from "./storage";
import { getCurrentTab, getWidgetEditorTabs, isWidgetEditorUrl } from "./tabs";

function themeFiles(theme: string) {
  return [`/styles/${theme}-theme.css`];
}

async function setFontSize(fontSize: number) {
  document.documentElement.style.setProperty("--font-size", fontSize + "px");

  document.documentElement.style.setProperty(
    "--line-height",
    fontSize * 1.4 + "px"
  );
}

/**
 * O tema é global: uma vez gravado, o service worker o injeta em toda aba do
 * widget editor. Trocar ou reverter precisa portanto varrer as abas abertas.
 * Mexer só na aba ativa deixaria as demais com o tema anterior ainda injetado,
 * e nelas o service worker empilharia o novo por cima na próxima ativação.
 *
 * `theme` nulo apenas remove o tema atual, sem inserir nada no lugar.
 */
async function applyThemeToOpenTabs(theme: string | null) {
  const currentTheme = await getStorageItem();
  const tabs = await getWidgetEditorTabs();

  await Promise.all(
    tabs.map(async (tab) => {
      const target = { tabId: tab.id as number };

      if (currentTheme && currentTheme.active) {
        try {
          await chrome.scripting.removeCSS({
            files: themeFiles(currentTheme.name),
            target,
          });
        } catch {
          // nenhum tema injetado nesta aba ainda
        }
      }

      if (!theme) return;

      try {
        await chrome.scripting.insertCSS({ files: themeFiles(theme), target });
      } catch (error) {
        console.debug("Widget Editor Themes: theme injection failed", error);
      }
    })
  );
}

async function enableTheme(theme: string) {
  await applyThemeToOpenTabs(theme);
  await setStorageItem(theme);
}

async function removeTheme() {
  await applyThemeToOpenTabs(null);
  await clearStorage();
}

async function isOnWidgetEditorPage() {
  const tab = await getCurrentTab();

  return isWidgetEditorUrl(tab.url);
}

export {
  getCurrentTab,
  setFontSize,
  enableTheme,
  removeTheme,
  isOnWidgetEditorPage,
};

import {
  clearFontSize,
  clearStorage,
  getFontSizeItem,
  getStorageItem,
  setFontSizeItem,
  setStorageItem,
} from "./storage";
import { getCurrentTab, getWidgetEditorTabs, isWidgetEditorUrl } from "./tabs";
import { clampFontSize, fontSizeCss, themeFiles } from "./styles";

type Injection = { files: string[] } | { css: string };

/**
 * Tema e tamanho de fonte são globais: uma vez gravados, o service worker os
 * injeta em toda aba do widget editor. Trocar ou remover precisa portanto
 * varrer as abas abertas — mexer só na ativa deixaria as demais com a folha
 * anterior, e nelas o service worker empilharia a nova por cima na próxima
 * ativação.
 */
async function swapCssOnOpenTabs(
  previous: Injection | null,
  next: Injection | null
) {
  const tabs = await getWidgetEditorTabs();

  await Promise.all(
    tabs.map(async (tab) => {
      const target = { tabId: tab.id as number };

      if (previous) {
        try {
          await chrome.scripting.removeCSS({ ...previous, target });
        } catch {
          // nada injetado nesta aba ainda
        }
      }

      if (!next) return;

      try {
        await chrome.scripting.insertCSS({ ...next, target });
      } catch (error) {
        console.debug("Widget Editor Themes: css injection failed", error);
      }
    })
  );
}

async function applyThemeToOpenTabs(theme: string | null) {
  const currentTheme = await getStorageItem();

  await swapCssOnOpenTabs(
    currentTheme && currentTheme.active
      ? { files: themeFiles(currentTheme.name) }
      : null,
    theme ? { files: themeFiles(theme) } : null
  );
}

async function applyFontSizeToOpenTabs(fontSize: number | null) {
  const currentFontSize = await getFontSizeItem();

  await swapCssOnOpenTabs(
    currentFontSize !== null ? { css: fontSizeCss(currentFontSize) } : null,
    fontSize !== null ? { css: fontSizeCss(fontSize) } : null
  );
}

async function enableTheme(theme: string) {
  await applyThemeToOpenTabs(theme);
  await setStorageItem(theme);
}

async function changeFontSize(fontSize: number) {
  const clamped = clampFontSize(fontSize);

  await applyFontSizeToOpenTabs(clamped);
  await setFontSizeItem(clamped);

  return clamped;
}

/** Desfaz tudo que a extensão injetou na página: tema e tamanho de fonte. */
async function removeTheme() {
  await applyThemeToOpenTabs(null);
  await applyFontSizeToOpenTabs(null);
  await clearStorage();
  await clearFontSize();
}

async function isOnWidgetEditorPage() {
  const tab = await getCurrentTab();

  return isWidgetEditorUrl(tab.url);
}

export {
  getCurrentTab,
  enableTheme,
  changeFontSize,
  removeTheme,
  isOnWidgetEditorPage,
};

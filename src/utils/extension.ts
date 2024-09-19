import { getStorageItem, setStorageItem } from "./storage";

const getCurrentTab = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
};

async function setFontSize(fontSize: number) {
  document.documentElement.style.setProperty("--font-size", fontSize + "px");

  document.documentElement.style.setProperty(
    "--line-height",
    fontSize * 1.4 + "px"
  );
}

async function removeCurrentTheme(tab?: chrome.tabs.Tab) {
  if (!tab) tab = await getCurrentTab();
  // first we need to disable the old current theme to avoid the css files stills injected
  const currentTheme = await getStorageItem();

  if (currentTheme && currentTheme.active) {
    await chrome.scripting.removeCSS({
      files: [`/styles/${currentTheme.name}-theme.css`],
      target: { tabId: tab.id || -1 },
    });
  }
}

async function enableTheme(theme: string) {
  const tab = await getCurrentTab();

  // Remove the current theme if it exists
  await removeCurrentTheme(tab);

  // Insert the CSS file when the user turns the extension on
  await chrome.scripting.insertCSS({
    files: [`/styles/${theme}-theme.css`],
    target: { tabId: tab.id || -1 },
  });

  setStorageItem(theme);
}

async function disableTheme(theme: string) {
  const tab = await getCurrentTab();

  // Remove the CSS file when the user turns the extension off
  chrome.scripting.removeCSS({
    files: [`/styles/${theme}-theme.css`],
    target: { tabId: tab.id || -1 },
  });

  setStorageItem(theme);
}

async function isOnWidgetEditorPage() {
  const tab = await getCurrentTab();

  return tab.url ? tab.url.includes("id=widget_editor") : false;
}

async function initializePopup() {
  const currentTheme = await getStorageItem();
  
  if (currentTheme && currentTheme.active) {
    enableTheme(currentTheme.name);
  }
}

export {
  setFontSize,
  enableTheme,
  disableTheme,
  isOnWidgetEditorPage,
  initializePopup,
  removeCurrentTheme
};

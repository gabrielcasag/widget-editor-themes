import { getStorageItem, setStorageItem, StorageItem } from "./storage";

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

async function enableTheme(theme: string) {
  const tab = await getCurrentTab();

  // first we need to disable the old current theme to avoid the css files stills injected
  const currentTheme = getStorageItem();

  if (currentTheme && currentTheme.active) {
    await chrome.scripting.removeCSS({
      files: [`/styles/${currentTheme.name}-theme.css`],
      target: { tabId: tab.id || -1 },
    });
  }

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

function isOnWidgetEditorPage(url: string) {
  const isWidgetEditorPage = url.includes("id=widget_editor");
  // const urlWidgetIdSplit = url.includes("&sys_id=")
  //   ? url.split("&sys_id=")
  //   : [];
  //let hasWidgetOpenOnEditor = urlWidgetIdSplit[1]?.length >= 32;

  return isWidgetEditorPage;
}

async function initializePopup() {
  const currentTheme = getStorageItem();

  return currentTheme as StorageItem;
}

export {
  setFontSize,
  enableTheme,
  disableTheme,
  isOnWidgetEditorPage,
  initializePopup,
};

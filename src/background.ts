import { getStorageItem } from "./utils/storage";

async function initialize(tab: chrome.tabs.Tab ) {
  //verify if the user is on widget editor page and has some widget open
  const url = tab.url;
  const isOnWidgetEditorPage = url ? url.includes("id=widget_editor") : false;

  if (!isOnWidgetEditorPage) return;

  const currentTheme = await getStorageItem();

  if (currentTheme && currentTheme.active) {
    await chrome.scripting.insertCSS({
      files: [`/styles/${currentTheme.name}-theme.css`],
      target: { tabId: tab.id || -1 },
    });
  }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => initialize(tab));
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    initialize(tab);
  }
});
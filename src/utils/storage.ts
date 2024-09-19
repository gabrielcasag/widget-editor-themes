export const storageKey = "wet-editor-theme";

export interface StorageItem {
  active: boolean;
  name: string;
}

export function getLocalStorageItem() {
  const storage = localStorage.getItem(storageKey);
  const currentTheme = storage ? JSON.parse(storage) : null;

  return currentTheme as StorageItem;
}

export function setLocalStorageItem(theme: string) {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      active: true,
      name: theme,
    })
  );
}

export async function getStorageItem(): Promise<StorageItem> {
  const storage = await chrome.storage.local.get(storageKey);

  return storage[storageKey];
}

export async function setStorageItem(theme: string) {
  await chrome.storage.local.set({
    [storageKey]: {
      active: true,
      name: theme,
    },
  });
}

export async function clearStorage() {
  await chrome.storage.local.remove(storageKey);
}
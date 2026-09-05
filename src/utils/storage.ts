export const storageKey = "wet-editor-theme";

export interface StorageItem {
  active: boolean;
  name: string;
}

export async function getStorageItem(): Promise<StorageItem> {
  const storage = await chrome.storage.local.get(storageKey);

  return storage[storageKey] as StorageItem;
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
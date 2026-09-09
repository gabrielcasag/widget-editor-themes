export const storageKey = "wet-editor-theme";
export const fontSizeKey = "wet-editor-font-size";

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

/** `null` significa que o usuário nunca ajustou o tamanho — o editor fica com o padrão dele. */
export async function getFontSizeItem(): Promise<number | null> {
  const storage = await chrome.storage.local.get(fontSizeKey);
  const fontSize = storage[fontSizeKey];

  return typeof fontSize === "number" ? fontSize : null;
}

export async function setFontSizeItem(fontSize: number) {
  await chrome.storage.local.set({ [fontSizeKey]: fontSize });
}

export async function clearFontSize() {
  await chrome.storage.local.remove(fontSizeKey);
}

export const storageKey = "wet-editor-theme";

export interface StorageItem {
  active: boolean;
  name: string;
}

export function getStorageItem() {
  const storage = localStorage.getItem(storageKey);
  const currentTheme = storage ? JSON.parse(storage) : null;

  return currentTheme as StorageItem;
}

export function setStorageItem(theme: string) {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      active: true,
      name: theme,
    })
  );
}

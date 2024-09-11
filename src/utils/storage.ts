export const storageKey = "widget-editor-themes";

export function getStorageItem() {
  const storage = localStorage.getItem(storageKey);
  const currentTheme = storage ? JSON.parse(storage) : null;

  return currentTheme;
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

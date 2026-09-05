/**
 * O manifest declara host permission fixa apenas para `*.service-now.com`.
 * Instâncias em domínio próprio (ex: snow.empresa.com) caem no
 * `optional_host_permissions`, concedido pelo usuário dentro do popup.
 */
export function originPatternFromUrl(url?: string): string | null {
  if (!url) return null;

  try {
    const { protocol, hostname } = new URL(url);

    if (protocol !== "http:" && protocol !== "https:") return null;

    return `${protocol}//${hostname}/*`;
  } catch {
    return null;
  }
}

export async function hasHostPermission(url?: string): Promise<boolean> {
  const origins = originPatternFromUrl(url);

  if (!origins) return false;

  return chrome.permissions.contains({ origins: [origins] });
}

export async function requestHostPermission(url?: string): Promise<boolean> {
  const origins = originPatternFromUrl(url);

  if (!origins) return false;

  return chrome.permissions.request({ origins: [origins] });
}

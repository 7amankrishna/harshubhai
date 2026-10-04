/**
 * Safely wrap a URL for use inside a CSS `url(...)` value.
 *
 * Unquoted url() tokens cannot contain parentheses, quotes, whitespace or
 * control characters. URLs like `https://host/Photo (1).jpeg` (note the
 * literal parentheses) produce a "bad-url" token, causing the browser to
 * silently drop the whole declaration — e.g. `background-image` never loads.
 *
 * Quoting the value (and escaping embedded quotes/backslashes) makes any
 * URL safe to embed in CSS.
 */
export function cssUrl(url: string): string {
  const escaped = url.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `url("${escaped}")`;
}

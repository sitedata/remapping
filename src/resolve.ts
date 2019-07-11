type WhatWgUrl = import('url').URL;
interface Url extends WhatWgUrl {
  new (input: string, base?: string): WhatWgUrl;
}
declare var URL: unknown;

/* istanbul ignore next */
const Url = (typeof URL !== 'undefined' ? URL : require('url').URL) as Url;

function isAbsolute(url: string): boolean {
  try {
    return !!new Url(url);
  } catch (e) {
    return false;
  }
}

/**
 * Attempts to resolve `input` URL relative to `base`.
 *
 * In practive, this is very difficult, and probably belongs in its own
 * library. For now, any non-absolute `base` is unsupported, unless the `input`
 * itself is absolute. And normalization doesn't happen on the `input` unless
 * there's an absolute `base`.
 */
export default function resolve(input: string, base: string | undefined): string {
  if (isAbsolute(input)) return new Url(input).href;
  if (base) {
    // The base should always end with a leading slash, to avoid errors with
    // `https://foo.com` throwing.
    if (!base.endsWith('/')) base += '/';

    if (isAbsolute(base)) return new Url(input, base).href;
    throw new Error(`cannot handle relative base "${base}"`);
  }
  return input;
}
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function loadImageAsDataUrl(src: string): Promise<string> {
  console.debug('loadImageAsDataUrl: start', src);
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Only set crossOrigin when the image is actually cross-origin.
    try {
      const url = new URL(src, location.href);
      if (url.origin !== location.origin) {
        img.crossOrigin = 'anonymous';
        console.debug('loadImageAsDataUrl: set crossOrigin=anonymous for', src, 'origin', url.origin);
      } else {
        console.debug('loadImageAsDataUrl: same-origin image, not setting crossOrigin for', src);
      }
    } catch (e) {
      // ignore (data URLs etc.)
      console.debug('loadImageAsDataUrl: could not parse URL for', src, e);
    }

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };

    img.onload = async () => {
      console.debug('loadImageAsDataUrl: <img> loaded', { src: img.src, width: img.width, height: img.height });
      // Try to draw to canvas and convert to data URL. If canvas
      // operations throw (tainted canvas), fall back to returning the
      // original src so the viewer can still use the image.
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          cleanup();
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          console.debug('loadImageAsDataUrl: converted to data URL for', src);
          cleanup();
          resolve(dataUrl);
          return;
        } catch (e) {
          // Canvas was tainted by CORS; return the original URL as a fallback
          console.warn(`loadImageAsDataUrl: canvas tainted for ${src}, falling back to original URL`, e);
          cleanup();
          resolve(src);
          return;
        }
      } catch (e) {
        cleanup();
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    };

    img.onerror = (ev?: Event | string) => {
      // Wrap async work in an IIFE so the handler's signature and return
      // type match the DOM expectation (returns void).
      (async () => {
        // Image failed to load via <img>; attempt several fetch fallbacks.
        // We try normal fetch first, then a no-cors fetch (opaque response),
        // and if everything fails we fall back to returning the original src
        // so the panorama viewer can still try to use it.
        console.warn(`loadImageAsDataUrl: <img> failed to load ${src}`, ev);

      const attempted: Array<{ url: string; opts: RequestInit; result?: unknown }> = [];

      const tryFetch = async (urlString: string, opts: RequestInit) => {
        attempted.push({ url: urlString, opts });
        try {
          console.debug('loadImageAsDataUrl: trying fetch', { url: urlString, opts });
          const resp = await fetch(urlString, opts);
          console.debug('loadImageAsDataUrl: fetch response', { url: urlString, status: resp.status, type: resp.type, ok: resp.ok });

          // For opaque responses (mode: 'no-cors'), resp.ok will be false and
          // status is 0, but we can still try to call blob() and use the result.
          if (!resp.ok && resp.type !== 'opaque') {
            return { ok: false, resp } as const;
          }

          const blob = await resp.blob();
          // If we got a blob, return an object URL regardless of headers.
          const objectUrl = URL.createObjectURL(blob);
          console.debug('loadImageAsDataUrl: fetch produced blob, created object URL', { objectUrl });
          cleanup();
          resolve(objectUrl);
          return { ok: true } as const;
        } catch (err) {
          console.warn('loadImageAsDataUrl: fetch attempt failed', err);
          return { ok: false, error: err } as const;
        }
      };

      try {
        const absUrl = (() => {
          try {
            return new URL(src, location.href).toString();
          } catch (e) {
            return src;
          }
        })();

        // 1) Normal fetch (same-origin friendly)
        let result = await tryFetch(absUrl, { credentials: 'include' });
        if ((result as any)?.ok) return;

        // 2) Try fetch with no-cors (opaque response) — might succeed in constrained environments
        result = await tryFetch(absUrl, { mode: 'no-cors', credentials: 'include' });
        if ((result as any)?.ok) return;

        // All fetch attempts failed — try the server-side proxy before falling back
        console.warn('loadImageAsDataUrl: all fetch fallbacks failed for', src, 'attempted:', attempted, 'lastResult:', result);

        try {
          const proxyUrl = `/api/static-proxy?path=${encodeURIComponent(src)}`;
          console.debug('loadImageAsDataUrl: attempting server proxy', proxyUrl);
          const pr = await fetch(proxyUrl, { credentials: 'include' });
          if (pr.ok) {
            const blob = await pr.blob();
            const objectUrl = URL.createObjectURL(blob);
            cleanup();
            resolve(objectUrl);
            return;
          }
          console.debug('loadImageAsDataUrl: server proxy failed', pr.status);
        } catch (proxyErr) {
          console.warn('loadImageAsDataUrl: server proxy attempt failed', proxyErr);
        }

        cleanup();
        resolve(src);
      } catch (e) {
        console.warn('loadImageAsDataUrl: unexpected error during fetch fallbacks', e);
        cleanup();
        // Final fallback: return original src so the viewer can still attempt to use it
        resolve(src);
      }
      })();
    };

    img.src = src;
  });
}
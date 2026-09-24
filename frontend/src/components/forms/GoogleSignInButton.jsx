import React, { useEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

// Wraps GoogleLogin with diagnostics. Two silent-death cases handled:
// 1. GIS script never loads (offline/ad-blocker/third-party sign-in off)
//    -> shows why instead of a dead button.
// 2. Google's renderButton only accepts pixel widths (40-400). Passing
//    "100%" renders a broken button that absorbs clicks silently, so the
//    wrapper width is measured and passed as pixels (look stays full-width).
export function GoogleSignInButton({ text = 'continue_with', onSuccess, onError }) {
  const wrapRef = useRef(null);
  const [pxWidth, setPxWidth] = useState(300);
  const [gisReady, setGisReady] = useState(
    () => typeof window !== 'undefined' && Boolean(window.google?.accounts?.id)
  );
  const [gisFailed, setGisFailed] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (el) {
      const update = () =>
        setPxWidth(Math.round(Math.min(400, Math.max(200, el.clientWidth || 300))));
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  useEffect(() => {
    if (gisReady) return;
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (window.google?.accounts?.id) {
        setGisReady(true);
        clearInterval(timer);
      } else if (attempts >= 16) {
        clearInterval(timer);
        setGisFailed(true);
        console.error(
          '[GoogleSignIn] accounts.google.com/gsi/client never initialized. ' +
            'Check internet access, disable ad-blockers for this site, and allow third-party sign-in in the browser.'
        );
      }
    }, 500);
    return () => clearInterval(timer);
  }, [gisReady]);

  if (gisFailed) {
    return (
      <p className="form-error" role="alert">
        Google sign-in couldn&apos;t load. Check your connection, disable
        ad-blockers for this site, and allow third-party sign-in in your
        browser, then refresh.
      </p>
    );
  }

  return (
    <div ref={wrapRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <GoogleLogin
        onSuccess={(response) => {
          if (!response?.credential) {
            console.error('[GoogleSignIn] Google returned no credential.', response);
            onError?.();
            return;
          }
          onSuccess?.(response);
        }}
        onError={() => {
          console.error(
            '[GoogleSignIn] Google rejected the sign-in attempt. ' +
              'Usual causes: localhost port missing from Authorized JavaScript origins, ' +
              'or a non-Web OAuth client ID in Google Cloud Console.'
          );
          onError?.();
        }}
        theme="filled_black"
        shape="pill"
        size="large"
        text={text}
        width={pxWidth}
      />
    </div>
  );
}

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const RouteContext = createContext({ path: '/', navigate: () => {} });

export function RouteProvider({ children }) {
  const [path, setPath] = useState(() => window.location.pathname + window.location.search);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname + window.location.search);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to) => {
    if (to === window.location.pathname + window.location.search) return;
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  return <RouteContext.Provider value={{ path, navigate }}>{children}</RouteContext.Provider>;
}

export function useRoute() {
  return useContext(RouteContext);
}

export function Link({ href, children, ...rest }) {
  const { navigate } = useRoute();
  // External links, new-tab, and hash anchors keep native behavior.
  if (!href || href.startsWith('http') || href.startsWith('#') || rest.target === '_blank') {
    return <a href={href} {...rest}>{children}</a>;
  }
  return (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
        rest.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}

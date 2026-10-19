import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 접속 중인 지점 경로(/stores/:storeSlug/* 또는 /staff/:storeSlug/*)에 맞춰
 * 브라우저의 PWA 웹 매니페스트(<link rel="manifest">)를 동적으로 전환하는 훅.
 * 이를 통해 홍대점 접속 중 앱을 설치하면 '카툰플러스 홍대점' 앱으로 다이렉트 설치됨.
 */
export function useDynamicManifest(): void {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const match = location.pathname.match(/\/(?:stores|staff)\/(snu|jamsil|hongdae)/);
    const storeSlug = match?.[1];

    let manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }

    const baseUrl = import.meta.env.BASE_URL || '/';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    const targetManifest = storeSlug
      ? `${cleanBaseUrl}manifest-${storeSlug}.webmanifest`
      : `${cleanBaseUrl}site.webmanifest`;

    if (manifestLink.getAttribute('href') !== targetManifest) {
      manifestLink.setAttribute('href', targetManifest);
    }
  }, [location.pathname]);
}

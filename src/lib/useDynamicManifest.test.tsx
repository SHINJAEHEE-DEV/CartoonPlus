import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useDynamicManifest } from './useDynamicManifest';

describe('useDynamicManifest', () => {
  let linkElement: HTMLLinkElement;

  beforeEach(() => {
    linkElement = document.createElement('link');
    linkElement.rel = 'manifest';
    linkElement.href = '/site.webmanifest';
    document.head.appendChild(linkElement);
  });

  afterEach(() => {
    linkElement.remove();
  });

  it('switches manifest to manifest-hongdae.webmanifest on hongdae customer routes', () => {
    renderHook(() => useDynamicManifest(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/stores/hongdae/books']}>
          {children}
        </MemoryRouter>
      ),
    });

    expect(linkElement.getAttribute('href')).toContain('manifest-hongdae.webmanifest');
  });

  it('switches manifest to manifest-jamsil.webmanifest on jamsil staff routes', () => {
    renderHook(() => useDynamicManifest(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/staff/jamsil/broadcast']}>
          {children}
        </MemoryRouter>
      ),
    });

    expect(linkElement.getAttribute('href')).toContain('manifest-jamsil.webmanifest');
  });

  it('reverts manifest to site.webmanifest on non-store routes', () => {
    renderHook(() => useDynamicManifest(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/about']}>
          {children}
        </MemoryRouter>
      ),
    });

    expect(linkElement.getAttribute('href')).toContain('site.webmanifest');
  });
});

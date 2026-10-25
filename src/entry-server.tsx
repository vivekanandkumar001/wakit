import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';
import { getSsrSeo } from './components/SEOHead';

export function render(url: string) {
  const html = renderToString(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  );
  const seo = getSsrSeo();
  return { html, seo };
}

export { getSsrSeo };

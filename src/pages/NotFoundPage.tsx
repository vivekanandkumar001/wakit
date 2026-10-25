import React from 'react';
import { Home, LayoutGrid, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { LogoMark } from '../components/Logo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-2xl py-14 text-center">
      <SEOHead
        title="Page Not Found | WaKit"
        description="The page you requested could not be found. Return to the WaKit home page to use our free WhatsApp utilities."
        canonicalPath="/404"
        noindex
      />

      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-8 -z-10 mx-auto h-48 max-w-md rounded-full bg-emerald-200/40 blur-[80px]" />

        <div className="mb-6 flex justify-center">
          <LogoMark className="h-16 w-16" />
        </div>

        <span className="badge">
          <SearchX className="h-3.5 w-3.5" aria-hidden="true" />
          404 · Not found
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          This page took a wrong turn
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          The page you requested does not exist or has moved. Head back to the toolkit to use the
          WhatsApp Status Splitter, Direct Chat, QR Builder, or Audio Compressor.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-primary w-full px-6 py-3 sm:w-auto">
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link to="/#tools" className="btn-secondary w-full px-6 py-3 sm:w-auto">
            <LayoutGrid className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Browse all tools
          </Link>
        </div>
      </div>
    </div>
  );
};

# 💬 WaKit — WhatsApp Web Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![WebAssembly](https://img.shields.io/badge/Engine-FFmpeg.wasm-blue.svg)](https://ffmpeg.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg)](https://tailwindcss.com)

**WaKit** is a modern, lightweight, privacy-first, 100% serverless web utility suite for WhatsApp. 

All video slicing, audio compression, link formatting, and QR code generation occur **100% client-side inside your browser** using **WebAssembly (FFmpeg.wasm)** and HTML5 APIs. Zero file uploads, zero server databases, zero logins.

---

## 🌟 Core Tools

### 1. ✂️ WhatsApp Status Splitter (Lossless 30-Second Slicer)
- **Lossless Stream Copying**: Uses FFmpeg stream copy (`-c copy`) to cut long MP4/MOV/WebM videos into exact 30-second clips without re-encoding or quality degradation.
- **Off-Thread Processing**: Executes in a dedicated Web Worker (`ffmpeg.worker.ts`) to keep the main UI thread 60 FPS smooth.
- **Zip Archive Export**: 1-click "Download All as ZIP" via `JSZip`.
- **Memory Safety**: Automatic `URL.revokeObjectURL` cleanup prevents browser RAM leaks.

### 2. 📲 Direct Message (Zero Contact Save)
- **200+ Countries Support**: Includes country dial codes with instant search filtering (India +91, Nigeria +234, Kenya +254, USA +1, UK +44, etc.).
- **Auto-Formatting**: Regex sanitization and E.164 phone standard preview.
- **Quick Message Chips**: One-click pre-filled templates ("Inquiring about item", "Hello!", "Sharing location").
- **Universal Links**: Uses WhatsApp's official `wa.me` scheme for instant iOS, Android, and WhatsApp Web opening.

### 3. 🎨 WhatsApp QR Code & Action Link Generator
- **Presets**: Direct Chat Link, WiFi Access Share, Payment/UPI Prompt, Custom URL.
- **Customization**: Foreground/background color pickers, QR display size slider (180px–320px), embedded center WaKit badge toggle.
- **Vector & High-Res Export**: 1-click High-Res PNG canvas export and raw SVG vector download.

### 4. 🎙️ Voice Note & Audio Compressor
- **Transcoding**: Compresses audio files (MP3, WAV, M4A, AAC, OGG) up to **3GB** for WhatsApp sharing, with a 16MB output target.
- **Large-File Support**: Sources are mounted read-only through FFmpeg `WORKERFS`, so the whole file is not copied into browser memory first.
- **Bitrate Selection**: 64 kbps (Voice-optimized), 96 kbps, 128 kbps.
- **Before/After Player**: Dual audio players with file size reduction percentage badge.
- **Memory Note**: Actual 3GB processing depends on available browser RAM; mobile devices are most reliable with files under 150MB.

---

## 🔒 Security & Performance Standards

- **COOP / COEP Credentialless Headers**: Configured in `public/_headers` (Cloudflare Pages), `vercel.json` (Vercel), and `vite.config.ts` to allow Google AdSense scripts (`adsbygoogle.js`) while preserving WebAssembly `SharedArrayBuffer` capabilities.
- **RAM Guardrails**: Video tools keep a **60MB mobile / 150MB desktop** cap. The audio compressor accepts up to **3GB** via read-only `WORKERFS`, but large-file success still depends on available browser memory.
- **Programmatic SEO**: Distinct keyword routes (`/split-video-for-whatsapp-status`, `/send-whatsapp-without-saving-number`, etc.) with `WebApplication` & `FAQPage` JSON-LD Schema injection.

---

## 🚀 Local Development Guide

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn

### Installation
```bash
# From the project root
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Static Production Build
```bash
npm run build
```
Outputs a static bundle to `dist/` ready for Vercel, Cloudflare Pages, or any static host.

---

## 📄 Disclaimer

**WaKit** is an independent utility project and is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp LLC, Meta Platforms, Inc., or any of their subsidiaries or affiliates.

---

## 📜 License

MIT License © 2026 WaKit Team.

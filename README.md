# Zaland Collection

[![Production Status](https://img.shields.io/badge/Status-Production--Ready-success?style=flat-square)](#)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20(ES6%2B)-blue?style=flat-square)](#)
[![Performance](https://img.shields.io/badge/Lighthouse-95%2B-gold?style=flat-square)](#)

Zaland Collection is a premium, high-end e-commerce storefront showcasing luxury abayas, modest wear, fine apparel, and curated cosmetics. Designed with a focus on modern minimalist luxury, the site offers an ultra-responsive, fast-loading, and visually captivating shopping experience.

## ✨ Core Features

- **Modern Luxury Aesthetics**: High-contrast dark themes, rich gold accents (`#CBA153`), elegant typography (Playfair Display & Inter), and subtle micro-interactions.
- **Fast LCP & Asset Optimization**: All catalog assets are optimized for size (WebP formats) with proper layout height bindings to prevent layout shifts (CLS).
- **Interactive Search Drawer**: Real-time filtering with search suggestions and responsive search result rendering.
- **Product Detail Modals**: Deep-dive product views featuring high-resolution image galleries, responsive size swatches, and detailed specifications.
- **Instant WhatsApp Checkout**: Pre-formatted orders containing customer details (name and shipping address), selected sizes, individual item breakdowns, and subtotal amounts sent directly to the customer service helpline.
- **Store Manager Portal**: Fully integrated administrative panel for real-time inventory management. Allows adding new items, modifying pricing or discount rates, hiding/showing products, and deleting listings.
- **Environment-Aware Persistence**: 
  - *Local Development*: Automatically syncs and writes catalog modifications directly to the project's source JSON files.
  - *Production (Vercel)*: Fallback layer that stores admin updates inside the user's `localStorage` to bypass read-only serverless filesystem constraints. Includes a **"Reset Catalog"** mechanism to clear local changes.

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: Vanilla HTML5 (semantic layout), custom CSS3 custom properties (variables), and modern JavaScript (ES6+ modular structure).
- **Tooling & Bundling**: Vite (underpinning the local hot reload server and production asset pipelines).
- **TypeScript**: Configured compiling verification via strict linter checks.
- **SEO & Social Optimization**: Implements full Open Graph (OG), Twitter Card metadata, and custom JSON-LD schema describing the store location, phone numbers, and active operating hours to search engines.
- **Production Headers & Caching**: Aggressive edge caching config (`vercel.json`) for static content alongside standard security policies (CSP, XSS, Frame Options).

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd zaland-collection
   ```

2. Install all development and build dependencies:
   ```bash
   npm install
   ```

### Running Locally

To boot up the Vite local development server with active file writing capabilities for the Admin Portal:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Building for Production

Compile and bundle assets under the `dist/` directory:

```bash
npm run build
```

Verify build output and configurations:

```bash
npm run preview
```

## 🔒 Security & Deployment

This project is fully optimized for deployment on serverless static hosting providers such as **Vercel**. It uses a custom `vercel.json` containing headers for:
- Strict Content Security Policy (CSP)
- Cross-Site Scripting Protection (X-XSS-Protection)
- Frame Options protection against clickjacking
- Aggressive caching headers for assets to maximize performance scores.

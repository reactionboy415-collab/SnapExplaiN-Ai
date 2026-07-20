# SnapExplaiN AI
> "Point. Snap. Understand."

SnapExplaiN AI is an advanced, production-grade AI visual assistant that helps users instantly understand everyday images using multimodal visual reasoning. Built using React, Vite, Tailwind CSS, Express, and Framer Motion, it features a premium, Apple-inspired, Linear.app layout that is fully responsive, interactive, and highly secure.

---

## 🚀 Key Features

*   **Automatic Content Recognition**: No category selection needed. Users simply upload any image (document, warning light, bill, plant, electronics, prescription label) and the AI automatically detects the subject matter.
*   **Secure Server-Side Proxy Routing**: Direct outbound requests are processed through a secure Express.js proxy handler, hiding all client telemetry and protecting API endpoints.
*   **Intelligent In-Memory Rate Limiting**: Embedded system-level rate limiting prevents DDoS, spam, and API over-consumption (supports custom limits like 5 req/min, 30 req/day per IP).
*   **Multi-Ingestion Formats**: Support for:
    *   Drag and drop file uploads
    *   Manual file picker input
    *   System Clipboard pastes (direct `Ctrl+V` captures)
    *   Integrated live camera stream modal (with multi-camera switching for mobile and guides overlay)
*   **Private Local History**: Uses a private client-side sandbox (`localStorage`) to preserve previously processed explanations, file sizes, and previews entirely offline.
*   **One-Click Portability**: Users can copy markdown, download a text summary report, or simulate instant direct sharing keys.
*   **100% Responsive Design**: Seamless fluid experience optimized for both desktops and native mobile browser engines.
*   **Aesthetic Styling**: Stunning dark & light mode toggles, micro-animations, glassmorphic floating panels, and custom loading telemetry steps.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend**: React (v19), Vite (v6), Tailwind CSS (v4), Framer Motion (v12), Lucide React.
*   **Backend**: Node.js, Express.js (integrated as Vite development middleware and a bundled CommonJS bundle in production).
*   **Markdown Parsing**: Overridden component layout rendering using `react-markdown`.
*   **Build Engine**: esbuild bundling of `server.ts` into a self-contained `dist/server.cjs` targeting zero-dependency Node execution.

---

## 📁 Project Structure

```
.
├── public/                 # Static assets & SEO descriptors
│   ├── browserconfig.xml   # IE browser tiling preferences
│   ├── llms.txt            # LLM crawler summary manifest
│   ├── manifest.json       # PWA installer specifications
│   ├── robots.txt          # SEO search engine crawlers configuration
│   ├── security.txt        # RFC 9116 security contact definitions
│   └── sitemap.xml         # XML site map indices
├── src/                    # Primary UI application source files
│   ├── components/         # Modular extracted React components
│   │   ├── AnalysisHistory.tsx   # Offline local history side drawer
│   │   ├── AnalyzerView.tsx      # Main drag/drop, paste, camera container
│   │   ├── CameraCapture.tsx     # Stream-based video/snapshot canvas module
│   │   └── ThemeToggle.tsx       # Standard light/dark state switcher
│   ├── App.tsx             # Main container, routing, and Landing Page Sections
│   ├── constants.ts        # Static Use Cases, FAQ definitions
│   ├── index.css           # Global Tailwind and custom fonts/glass configs
│   ├── main.tsx            # React application mounting point
│   └── types.ts            # Typed structures (History items, Use Cases)
├── .env.example            # Environment variables placeholder
├── LICENSE                 # MIT License file
├── metadata.json           # AI Studio application specifications
├── package.json            # Node scripts and dependencies manifests
├── server.ts               # Express proxy, validation, and rate limiter
├── tsconfig.json           # TypeScript build guidelines
└── vite.config.ts          # Vite build, watch, and aliases setup
```

---

## 📡 API Documentation

### Describe Image
Securely processes visual inputs, runs schema validations, parses base64 lengths, and proxy routes to the multimodal core.

*   **Endpoint**: `POST /api/describe`
*   **Content-Type**: `application/json`
*   **Payload Schema**:
    ```json
    {
      "base64Url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "result": "Structured markdown text output describing and explaining the subject...",
      "generatedAt": "2026-07-20T06:06:08.932Z"
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: Returned on invalid mime formats, malformed strings, or missing parameters.
    *   `429 Too Many Requests`: Returned when client IP exceeds 5 requests/minute or 30 requests/day.
    *   `500 Internal Server Error`: Returned on backend connection errors.

---

## 🚀 Deployment Guide (Vercel)

1.  **Repository Sync**: Push this codebase to your Github or GitLab repository.
2.  **Vercel Portal Setup**:
    *   Import your repository on Vercel.
    *   Set the **Framework Preset** to `Vite` (Vercel will detect package scripts automatically).
    *   Configure any required environment variables specified in `.env.example`.
3.  **Deploy**: Click **Deploy**. Vercel will trigger the `npm run build` action to compile static assets and prepare the edge-ready route distributions.

---

## 📜 License
This project is licensed under the MIT License - see the `LICENSE` file for details.

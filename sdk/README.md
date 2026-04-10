<div align="center">
  <img src="https://img.shields.io/badge/Fixora-AI%20Error%20Intelligence-4ade80?style=for-the-badge" alt="Fixora SDK" />
  <br/><br/>
  <h1>Fixora JavaScript SDK</h1>
  <p>Capture errors contextually. Understand instantly. Fix faster.</p>
  <a href="https://kunalt96.github.io/fixora/index.html"><strong>Explore the Live Website & Docs »</strong></a>
  <br/>
</div>

> **🚧 Fixora is currently in active development. Launching BETA soon!**
> For any details, email at [kunaltiwari5596@gmail.com](mailto:kunaltiwari5596@gmail.com)

---

Fixora is a next-generation, AI-driven error tracking and debugging platform. Instead of digging through endless stack traces, the Fixora SDK quietly captures anomalies inside your frontend JavaScript or React applications, pushes them to your multi-tenant backend, and delivers an exact, AI-generated solution detailing why the failure occurred and exactly what code blocks to correct.

## 🚀 Installation

Install the library using your preferred package manager:

```bash
npm install @kuntiwar/fixora-sdk
# OR
yarn add @kuntiwar/fixora-sdk
# OR
pnpm install @kuntiwar/fixora-sdk
```

## 🛠 Usage & Integration

Setting up Fixora requires just two lines of code. For maximum observability, you must initialize the SDK at the topmost level of your application (e.g., `index.js`, `main.js`, or `App.jsx`).

```javascript
import { init } from "@kuntiwar/fixora-sdk";

// Initialize to instantly attach window.onerror and unhandledrejection listeners
init({
  apiURL: "http://localhost:4000/api", // Replace with your production API URL
  apiKey: "your-fixora-api-key"        // Acquire this via your Fixora Administrator Dashboard
});
```

### What does it do?
Once `init()` is called, Fixora silently listens in the background. If any unhandled exceptions or rejected promises slip through your code, Fixora automatically scoops up the stack trace, the application state, and the URL environment, piping it down to the dashboard without interrupting your users.

## ✨ Features

- **Automated JavaScript Error Capturing:** Globals handlers to catch everything before the browser crashes.
- **Generative AI Diagnostics:** Don't just track the error—explain it and generate a code fix using Gemini Flash logic on the backend side.
- **Multi-tenant Architecture:** Completely isolated storage. 100% of errors are grouped to your specific `apiKey`.
- **Intelligent Deduplication:** Identical errors are grouped up to bump occurrence counters, avoiding log bloat.
- **Micro Latency:** Less than `2kb` packed. Performance first. Zero impact on load times.

## 🔗 Links

- **Documentation & UI Platform:** [https://kunalt96.github.io/fixora/index.html](https://kunalt96.github.io/fixora/index.html)
- **GitHub Repository:** [https://github.com/kunalt96/fixora](https://github.com/kunalt96/fixora)
- **Report an Issue:** [Fixora Issues](https://github.com/kunalt96/fixora/issues)

## 💡 License

This project is licensed under the MIT License - see the LICENSE file for details.

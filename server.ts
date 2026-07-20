import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Simple in-memory rate limiter
interface RateLimitInfo {
  timestamps: number[];
  dailyCount: number;
  lastResetDay: number;
}

const rateLimitDb = new Map<string, RateLimitInfo>();

const LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQ_PER_WINDOW = 5; // max 5 requests per minute
const MAX_REQ_PER_DAY = 30; // max 30 requests per day

function getClientIp(req: express.Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    return ip.trim();
  }
  return req.socket.remoteAddress || "unknown-ip";
}

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const today = new Date().getUTCDate();

  let info = rateLimitDb.get(ip);
  if (!info) {
    info = {
      timestamps: [],
      dailyCount: 0,
      lastResetDay: today,
    };
    rateLimitDb.set(ip, info);
  }

  // Reset daily limit if it's a new day
  if (info.lastResetDay !== today) {
    info.dailyCount = 0;
    info.lastResetDay = today;
  }

  // Filter timestamps within current minute window
  info.timestamps = info.timestamps.filter(ts => now - ts < LIMIT_WINDOW_MS);

  if (info.timestamps.length >= MAX_REQ_PER_WINDOW) {
    return {
      allowed: false,
      message: "Rate limit exceeded. Maximum 5 requests per minute. Please wait a moment.",
    };
  }

  if (info.dailyCount >= MAX_REQ_PER_DAY) {
    return {
      allowed: false,
      message: "Daily rate limit reached. Maximum 30 requests per day to prevent API abuse.",
    };
  }

  // Record this request
  info.timestamps.push(now);
  info.dailyCount += 1;
  return { allowed: true };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use increased payload limit for larger base64 images
  app.use(express.json({ limit: "15mb" }));

  // API Route for describing images
  app.post("/api/describe", async (req, res) => {
    try {
      let { base64Url } = req.body;

      if (!base64Url) {
        return res.status(400).json({ error: "Missing image payload. Please provide a valid image." });
      }

      // If it is a remote URL, fetch and convert to base64 data URI first
      if (base64Url.startsWith("http://") || base64Url.startsWith("https://")) {
        try {
          const fetchRes = await fetch(base64Url);
          if (!fetchRes.ok) {
            return res.status(400).json({ error: "Failed to fetch remote sample image from source." });
          }
          const arrayBuffer = await fetchRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const mimeTypeFromHeader = fetchRes.headers.get("content-type") || "image/jpeg";
          base64Url = `data:${mimeTypeFromHeader};base64,${buffer.toString("base64")}`;
        } catch (fetchErr) {
          console.error("[SnapExplaiN Server] Error fetching remote image:", fetchErr);
          return res.status(400).json({ error: "Failed to download and secure the remote sample image." });
        }
      }

      // Secure validations
      // 1. File size check (approximate base64 length check)
      const base64Length = base64Url.length;
      const sizeInBytes = (base64Length * 3) / 4;
      const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
      if (sizeInBytes > MAX_SIZE_BYTES) {
        return res.status(400).json({ error: "Image size too large. Maximum allowed size is 10MB." });
      }

      // 2. Format validation
      const formatMatch = base64Url.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      if (!formatMatch) {
        return res.status(400).json({ error: "Invalid image format. Must be a valid base64 image data URI." });
      }

      const mimeType = formatMatch[1];
      const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      if (!allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({
          error: `Unsupported format: ${mimeType}. Only JPEG, PNG, WEBP, and GIF images are supported.`,
        });
      }

      // 3. Rate limiting check
      const ip = getClientIp(req);
      const limitResult = checkRateLimit(ip);
      if (!limitResult.allowed) {
        return res.status(429).json({ error: limitResult.message });
      }

      // Secure outbound request to external API (proxied server-side)
      console.log(`[SnapExplaiN Server] Routing image analysis securely (IP: ${ip}, Size: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB, Format: ${mimeType})`);

      const targetUrl = "https://imageprompt.org/api/ai/images/describe";
      
      const payload = {
        base64Url: base64Url,
        instruction: "detail",
        prompt: "",
        language: "en"
      };

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "accept": "*/*",
          "origin": "https://imageprompt.org",
          "referer": "https://imageprompt.org/describe-image",
          "user-agent": "Mozilla/5.0 (Linux; Android 12; LAVA Blaze Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.46 Mobile Safari/537.36",
          "x-requested-with": "mark.via.gp",
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          "accept-language": "en-IN,en-US;q=0.9,en;q=0.8",
          "sentry-trace": "fbe006165b3d4081b73b461c96122123-9fe9c98e0face819-1",
          "baggage": "sentry-environment=vercel-production,sentry-release=5b1491935ad37a0bb03211c455a516dfdf04b63e,sentry-public_key=a8864b61109c38b3bf1b1f93712338fc,sentry-trace_id=fbe006165b3d4081b73b461c96122123,sentry-sampled=true,sentry-sample_rand=0.9604531531267552,sentry-sample_rate=1"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[SnapExplaiN Server] AI endpoint returned status ${response.status}: ${errorText}`);
        return res.status(response.status).json({
          error: "The AI service encountered an issue. Please try again in a few moments.",
        });
      }

      const data = await response.json();
      return res.json(data);

    } catch (err: any) {
      console.error("[SnapExplaiN Server] Internal error processing request:", err);
      return res.status(500).json({
        error: "An internal server error occurred while processing your request. Please try again.",
      });
    }
  });

  // Serve static assets and Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SnapExplaiN Server] Server is booted and listening on port ${PORT}`);
  });
}

startServer();

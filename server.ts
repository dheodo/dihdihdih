import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  
  // Enable trust proxy to correctly recognize X-Forwarded-Proto header behind Cloud Run / Nginx proxies
  app.set("trust proxy", true);

  const httpServer = createServer(app);
  const io = new Server(httpServer);
  const PORT = 3000;

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("chat-event", (data) => {
      console.log("Event received:", data);
    });
  });

  // Sitemap.xml dynamic endpoint matching current host protocol and domain
  app.get("/sitemap.xml", (req, res) => {
    const host = req.get("host") || "";
    // On localhost or local networks, default to http. On public web environments, force secure https
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.startsWith("192.168.") || host.startsWith("10.");
    const protocol = isLocal ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Home Page -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- About Us Section -->
  <url>
    <loc>${baseUrl}/?page=about</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Services Section -->
  <url>
    <loc>${baseUrl}/?page=services</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Projects Section -->
  <url>
    <loc>${baseUrl}/?page=project</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Reviews Section -->
  <url>
    <loc>${baseUrl}/?page=reviews</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

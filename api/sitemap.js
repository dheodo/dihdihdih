export default function handler(req, res) {
  const host = req.headers.host || "";
  // Check if we are running in localhost or local development environment
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

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(sitemap);
}

import { createFileRoute } from "@tanstack/react-router";

const staticPaths = [
  "/",
  "/properties",
  "/buy",
  "/rent",
  "/residential",
  "/commercial",
  "/list-property",
  "/about",
  "/contact",
  "/privacy",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        const origin = new URL(request.url).origin;
        let properties = [];
        try {
          const page = await context.getBase44().entities.Properties.filter(
            { published: true },
            { limit: 200 },
          );
          properties = page.items || [];
        } catch {
          properties = [];
        }

        const urls = [
          ...staticPaths.map((path) => ({ loc: `${origin}${path}`, priority: "0.8" })),
          ...properties.map((p) => ({
            loc: `${origin}/property/${p.slug}`,
            priority: "0.7",
            lastmod: (p.updated_date || p.created_date || "").slice(0, 10),
          })),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, s-maxage=3600",
          },
        });
      },
    },
  },
});
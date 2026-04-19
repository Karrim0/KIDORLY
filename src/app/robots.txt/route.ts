export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /login

Sitemap: ${process.env.NEXT_PUBLIC_APP_URL || "https://kidorly.com"}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}

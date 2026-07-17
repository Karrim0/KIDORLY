# Kidorly

Multilingual kids e-commerce storefront and admin dashboard for the Egyptian market. The experience is mobile-first, supports Arabic (RTL), English, and German, and includes products, categories, brands, offers, wishlist, cart, checkout, WhatsApp confirmation, and store management.

## Highlights

- Immersive mobile-first storefront with a split, full-viewport hero, pointer parallax, touch navigation, responsive product grids, and reduced-motion support.
- Fast native-scroll category circles on mobile, a GSAP collection story on desktop, an age-based product explorer, an infinite partner loop, and clear buying-journey sections.
- Homepage order, visibility, hero desktop/mobile media, collections, and age-group media are controlled from the admin dashboard.
- Server-verified checkout: product prices, discounts, availability, variants, and shipping are calculated on the server.
- Protected admin routes with signed JWT sessions, rate-limited login, and bcrypt password hashes.
- Idempotent order submission and private order-success links.
- Localized metadata, canonical/hreflang links, JSON-LD, sitemap, robots, and social sharing image.
- Security headers, validated media uploads, and admin-only mutation endpoints.
- Next.js 16, TypeScript, Prisma/PostgreSQL, Tailwind CSS, next-intl, Zod, and React Hook Form.
- Motion and GSAP power the presentation layer while native scrolling remains the default on touch devices.

## Homepage management

- `/admin/homepage`: reorder or hide homepage sections, edit localized hero copy, and upload separate desktop/mobile hero images.
- `/admin/catalog`: create, edit, order, show, feature, and upload card/banner media for collections and age groups.
- `/admin/products`: assign each product to its collections and age groups; those assignments power homepage content and shop filters.

Recommended hero assets are WebP/AVIF: roughly `1600×1400` for desktop and `1080×1200` for mobile, with the main subject kept near the center. Collection banners work best at `1600×1100`; age-group media at `1200×900`.

## Setup

Requires Node.js 20.9 or newer and PostgreSQL.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set every value. Generate the admin password hash with:

   ```bash
   node -e "console.log(require('bcryptjs').hashSync('replace-with-a-strong-password', 12))"
   ```

   Generate `JWT_SECRET` with at least 32 random bytes, for example:

   ```bash
   openssl rand -hex 32
   ```

3. Apply the database migrations and generate Prisma Client:

   ```bash
   npx prisma migrate deploy
   npm run db:generate
   ```

   The latest migration adds optional card and banner media to age groups without deleting existing data.

4. Optionally seed a new database, then start development:

   ```bash
   npm run db:seed
   npm run dev
   ```

Open `http://localhost:3000`. Never commit `.env` or real credentials.

## Quality checks

Run the full validation suite before deployment:

```bash
npm run check
```

This runs ESLint, unit tests, TypeScript validation, and a production build.

## Main scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run check` | Run all quality checks |
| `npm run db:migrate` | Create/apply a development migration |
| `npx prisma migrate deploy` | Apply migrations in production |
| `npm run db:seed` | Seed a new database |
| `npm run db:studio` | Open Prisma Studio |

## Deployment checklist

- Set `NEXT_PUBLIC_APP_URL` to the final HTTPS domain.
- Set a unique `ADMIN_PASSWORD_HASH` and a random `JWT_SECRET`.
- Configure the PostgreSQL and Cloudinary credentials.
- Run `npx prisma migrate deploy` before starting the new release.
- Review shipping prices, WhatsApp/payment instructions, products, and product media from the admin dashboard.
- Run `npm run check` in CI before every deployment.

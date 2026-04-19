# Kidorly — Premium Kids E-Commerce Platform

A production-quality, multilingual (EN/AR/DE) e-commerce web application for selling kids products across Egypt. Built with Next.js 14, TypeScript, Prisma, PostgreSQL, Tailwind CSS, and shadcn/ui.

## Features

### Public Store
- **Multilingual** — Full Arabic (RTL), English, German support
- **Product catalog** — Categories, filtering, sorting, search
- **Product details** — Image gallery, color/size variants, discount display
- **Cart system** — Client-side with localStorage persistence
- **Guest checkout** — Home or hotel delivery, WhatsApp integration
- **Smart pricing** — Product → Category → Global discount priority
- **Payment methods** — Cash on Delivery, Vodafone Cash, InstaPay
- **WhatsApp CTA** — Pre-filled order message with clickable link
- **SEO** — Dynamic sitemap, robots.txt, per-page metadata, hreflang

### Admin Dashboard
- **Dashboard overview** — Order stats, recent orders, quick actions
- **Orders** — Search, filter, status updates, WhatsApp quick-contact
- **Products** — Full CRUD, multilingual fields, variants, images, SEO
- **Categories** — Full CRUD, multilingual, image, discount
- **Discounts** — Global, category, product-level management
- **Homepage editor** — Editable sections (hero, announcement, trust, etc.)
- **Settings** — WhatsApp, payment, delivery, contact, social, SEO
- **Media** — Cloudinary upload with URL copy

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jose) + bcryptjs |
| i18n | next-intl (EN/AR/DE) |
| Forms | React Hook Form + Zod |
| Media | Cloudinary |
| Fonts | Outfit (Latin) + Cairo (Arabic) |

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/          # Public store pages
│   │   │   ├── shop/          # Product listing
│   │   │   ├── product/[slug] # Product detail
│   │   │   ├── category/[slug]# Category listing
│   │   │   ├── offers/        # Discounted products
│   │   │   ├── checkout/      # Guest checkout
│   │   │   ├── order-success/ # Confirmation + WhatsApp
│   │   │   ├── contact/       # Contact channels
│   │   │   ├── faq/           # FAQ accordion
│   │   │   └── policies/      # Privacy, terms, shipping
│   │   ├── (admin)/admin/     # Admin dashboard
│   │   │   ├── orders/        # Order management
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── categories/    # Category CRUD
│   │   │   ├── discounts/     # Discount management
│   │   │   ├── homepage/      # Homepage editor
│   │   │   ├── settings/      # Site settings
│   │   │   └── media/         # Image uploads
│   │   └── (auth)/login/      # Admin login
│   └── api/                   # API routes
├── actions/                   # Server actions
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── public/                # Store components
│   └── admin/                 # Admin components
├── hooks/                     # React hooks (cart)
├── lib/                       # Utilities
├── messages/                  # i18n translations
├── styles/                    # Global CSS
└── types/                     # TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Cloudinary account (for image uploads)

### 1. Clone & Install

```bash
git clone <repo-url>
cd kidorly
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kidorly"
ADMIN_EMAIL="admin@kidorly.com"
ADMIN_PASSWORD="your-secure-password"
JWT_SECRET="generate-a-random-string-here"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

- **Store**: http://localhost:3000/en
- **Admin**: http://localhost:3000/en/admin
- **Login**: http://localhost:3000/en/login

### 5. Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Add to your `.env` file
4. Images uploaded via Admin → Media will be stored in Cloudinary

## Discount Priority System

Discounts follow a clear priority hierarchy:

1. **Product discount** (highest priority) — set directly on the product
2. **Category discount** — applied to all products in a category
3. **Global discount** (lowest priority) — applied to all products

Only one discount applies per product — the most specific one wins. This is implemented in `src/lib/utils.ts → getEffectiveDiscount()`.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Docker / VPS

```bash
npm run build
npm start
```

## Key Design Decisions

- **Guest checkout only** — No user accounts; orders finalize via WhatsApp
- **WhatsApp-first** — All payment & communication flows through WhatsApp
- **Single admin** — Simple JWT auth, no role system (yet)
- **Key-value settings** — Flexible admin-editable configuration
- **Manual translations** — No machine translation; all content manually entered in 3 languages
- **Delivery by city** — Configurable shipping fees per city
- **Hotel delivery** — Special checkout fields for tourist hotel delivery

## License

Private — All rights reserved.

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

```
kidorly
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ prisma
│  ├─ schema.prisma
│  └─ seed.ts
├─ public
│  ├─ favicon.svg
│  ├─ images
│  │  ├─ hero.jpg
│  │  ├─ hero10.png
│  │  ├─ hero2.png
│  │  ├─ hero3.png
│  │  ├─ hero4.png
│  │  ├─ hero5.png
│  │  ├─ hero6.png
│  │  ├─ hero7.png
│  │  ├─ hero8.png
│  │  ├─ hero9.png
│  │  └─ logo.png
│  ├─ manifest.json
│  └─ placeholder.svg
├─ README.md
├─ src
│  ├─ actions
│  │  ├─ orders.ts
│  │  ├─ products.ts
│  │  └─ settings.ts
│  ├─ app
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ login
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ logout
│  │  │  │     └─ route.ts
│  │  │  ├─ brands
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ categories
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ media
│  │  │  │  └─ route.ts
│  │  │  ├─ orders
│  │  │  │  ├─ checkout
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ products
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ settings
│  │  │  │  └─ route.ts
│  │  │  └─ upload
│  │  │     └─ route.ts
│  │  ├─ layout.tsx
│  │  ├─ robots.txt
│  │  │  └─ route.ts
│  │  ├─ sitemap.xml
│  │  │  └─ route.ts
│  │  └─ [locale]
│  │     ├─ (admin)
│  │     │  └─ admin
│  │     │     ├─ admin-shell.tsx
│  │     │     ├─ brands
│  │     │     │  ├─ brands-list-client.tsx
│  │     │     │  ├─ new
│  │     │     │  │  └─ page.tsx
│  │     │     │  ├─ page.tsx
│  │     │     │  └─ [id]
│  │     │     │     └─ page.tsx
│  │     │     ├─ categories
│  │     │     │  ├─ categories-list-client.tsx
│  │     │     │  ├─ new
│  │     │     │  │  └─ page.tsx
│  │     │     │  ├─ page.tsx
│  │     │     │  └─ [id]
│  │     │     │     └─ page.tsx
│  │     │     ├─ dashboard-client.tsx
│  │     │     ├─ discounts
│  │     │     │  ├─ discounts-client.tsx
│  │     │     │  └─ page.tsx
│  │     │     ├─ error.tsx
│  │     │     ├─ homepage
│  │     │     │  ├─ homepage-client.tsx
│  │     │     │  └─ page.tsx
│  │     │     ├─ layout.tsx
│  │     │     ├─ loading.tsx
│  │     │     ├─ media
│  │     │     │  └─ page.tsx
│  │     │     ├─ orders
│  │     │     │  ├─ orders-list-client.tsx
│  │     │     │  ├─ page.tsx
│  │     │     │  └─ [id]
│  │     │     │     ├─ order-detail-client.tsx
│  │     │     │     └─ page.tsx
│  │     │     ├─ page.tsx
│  │     │     ├─ products
│  │     │     │  ├─ new
│  │     │     │  │  └─ page.tsx
│  │     │     │  ├─ page.tsx
│  │     │     │  ├─ products-list-client.tsx
│  │     │     │  └─ [id]
│  │     │     │     └─ page.tsx
│  │     │     └─ settings
│  │     │        ├─ page.tsx
│  │     │        └─ settings-client.tsx
│  │     ├─ (auth)
│  │     │  ├─ layout.tsx
│  │     │  └─ login
│  │     │     └─ page.tsx
│  │     ├─ (public)
│  │     │  ├─ brand
│  │     │  │  └─ [slug]
│  │     │  │     ├─ brand-detail-client.tsx
│  │     │  │     └─ page.tsx
│  │     │  ├─ brands
│  │     │  │  ├─ brands-client.tsx
│  │     │  │  └─ page.tsx
│  │     │  ├─ category
│  │     │  │  └─ [slug]
│  │     │  │     └─ page.tsx
│  │     │  ├─ checkout
│  │     │  │  ├─ checkout-client.tsx
│  │     │  │  └─ page.tsx
│  │     │  ├─ contact
│  │     │  │  ├─ contact-client.tsx
│  │     │  │  └─ page.tsx
│  │     │  ├─ error.tsx
│  │     │  ├─ faq
│  │     │  │  ├─ faq-client.tsx
│  │     │  │  └─ page.tsx
│  │     │  ├─ home-client.tsx
│  │     │  ├─ layout.tsx
│  │     │  ├─ loading.tsx
│  │     │  ├─ offers
│  │     │  │  ├─ offers-client.tsx
│  │     │  │  └─ page.tsx
│  │     │  ├─ order-success
│  │     │  │  └─ [id]
│  │     │  │     ├─ order-success-client.tsx
│  │     │  │     └─ page.tsx
│  │     │  ├─ page.tsx
│  │     │  ├─ policies
│  │     │  │  ├─ page.tsx
│  │     │  │  └─ policies-client.tsx
│  │     │  ├─ product
│  │     │  │  └─ [slug]
│  │     │  │     ├─ page.tsx
│  │     │  │     └─ product-detail-client.tsx
│  │     │  ├─ shop
│  │     │  │  ├─ page.tsx
│  │     │  │  └─ shop-client.tsx
│  │     │  └─ wishlist
│  │     │     ├─ page.tsx
│  │     │     └─ wishlist-client.tsx
│  │     ├─ layout.tsx
│  │     └─ not-found.tsx
│  ├─ components
│  │  ├─ admin
│  │  │  ├─ brand-form.tsx
│  │  │  ├─ category-form.tsx
│  │  │  ├─ image-uploader.tsx
│  │  │  ├─ order-status-form.tsx
│  │  │  ├─ product-form.tsx
│  │  │  └─ stat-card.tsx
│  │  ├─ public
│  │  │  ├─ cart-drawer.tsx
│  │  │  ├─ footer.tsx
│  │  │  ├─ hero-section.tsx
│  │  │  ├─ home-sections.tsx
│  │  │  ├─ navbar.tsx
│  │  │  ├─ product-card.tsx
│  │  │  ├─ product-skeleton.tsx
│  │  │  └─ sale-timer.tsx
│  │  ├─ shared
│  │  │  ├─ empty-state.tsx
│  │  │  ├─ loading.tsx
│  │  │  ├─ reveal.tsx
│  │  │  └─ scroll-to-top.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ dialog.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ radio-group.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ switch.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     └─ tooltip.tsx
│  ├─ hooks
│  │  ├─ use-cart.tsx
│  │  ├─ use-scroll-reveal.tsx
│  │  ├─ use-toast.tsx
│  │  └─ use-wishlist.tsx
│  ├─ lib
│  │  ├─ auth.ts
│  │  ├─ cloudinary.ts
│  │  ├─ i18n.ts
│  │  ├─ navigation.ts
│  │  ├─ prisma.ts
│  │  ├─ settings.ts
│  │  ├─ utils.ts
│  │  ├─ validations.ts
│  │  └─ whatsapp.ts
│  ├─ messages
│  │  ├─ ar.json
│  │  ├─ de.json
│  │  └─ en.json
│  ├─ middleware.ts
│  ├─ styles
│  │  └─ globals.css
│  └─ types
│     ├─ global.d.ts
│     └─ index.ts
├─ structure.txt
├─ tailwind.config.ts
└─ tsconfig.json

```
```
kidorly
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ prisma
│  ├─ schema.prisma
│  └─ seed.ts
├─ public
│  ├─ favicon.svg
│  ├─ favicoon.svg
│  ├─ images
│  │  ├─ hero.jpg
│  │  ├─ hero10.png
│  │  ├─ hero2.png
│  │  ├─ hero3.png
│  │  ├─ hero4.png
│  │  ├─ hero5.png
│  │  ├─ hero6.png
│  │  ├─ hero7.png
│  │  ├─ hero8.png
│  │  ├─ hero9.png
│  │  └─ logo.png
│  ├─ manifest.json
│  └─ placeholder.svg
├─ README.md
├─ src
│  ├─ actions
│  │  ├─ orders.ts
│  │  ├─ products.ts
│  │  └─ settings.ts
│  ├─ app
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ login
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ logout
│  │  │  │     └─ route.ts
│  │  │  ├─ brands
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ categories
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ media
│  │  │  │  └─ route.ts
│  │  │  ├─ orders
│  │  │  │  ├─ checkout
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ products
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ settings
│  │  │  │  └─ route.ts
│  │  │  └─ upload
│  │  │     └─ route.ts
│  │  ├─ layout.tsx
│  │  ├─ robots.txt
│  │  │  └─ route.ts
│  │  ├─ sitemap.xml
│  │  │  └─ route.ts
│  │  └─ [locale]
│  │     ├─ (admin)
│  │     │  └─ admin
│  │     │     ├─ admin-shell.tsx
│  │     │     ├─ brands
│  │     │     │  ├─ brands-list-client.tsx
│  │     │     │  ├─ new
│  │     │     │  │  └─ page.tsx
│  │     │     │  ├─ page.tsx
│  │     │     │  └─ [id]
│  │     │     │     └─ page.tsx
│  │     │     ├─ categories
│  │     │     │  ├─ categories-list-client.tsx
│  │     │     │  ├─ new
│  │     │     │  │  └─ page.tsx
│  │     │     │  ├─ page.tsx
│  │     │     │  └─ [id]
│  │     │     │     └─ page.tsx
│  │     │     ├─ dashboard-client.tsx
│  │     │     ├─ discounts
│  │     │     │  ├─ discounts-client.tsx
│  │     │     │  └─ page.tsx
│  │     │     ├─ error.tsx
│  │     │     ├─ homepage
│  │     │     │  ├─ homepage-client.tsx
│  │     │     │  └─ page.tsx
│  │     │     ├─ layout.tsx
│  │     │     ├─ loading.tsx
│  │     │     ├─ media
│  │     │     │  └─ page.tsx
│  │     │     ├─ orders
│  │     │     │  ├─ orders-list-client.tsx
│  │     │     │  ├─ page.tsx
│  │     │     │  └─ [id]
│  │     │     │     ├─ order-detail-client.tsx
│  │     │     │     └─ page.tsx
│  │     │     ├─ page.tsx
│  │     │     ├─ products
│  │     │     │  ├─ new
│  │     │     │  │  └─ page.tsx
│  │     │     │  ├─ page.tsx
│  │     │     │  ├─ products-list-client.tsx
│  │     │     │  └─ [id]
│  │     │     │     └─ page.tsx
│  │     │     └─ settings
│  │     │        ├─ page.tsx
│  │     │        └─ settings-client.tsx
│  │     ├─ (auth)
│  │     │  ├─ layout.tsx
│  │     │  └─ login
│  │     │     └─ page.tsx
│  │     ├─ (public)
│  │     │  ├─ brand
│  │     │  │  └─ [slug]
│  │     │  │     ├─ brand-detail-client.tsx
│  │     │  │     └─ page.tsx
│  │     │  ├─ brands
│  │     │  │  ├─ brands-client.tsx
│  │     │  │  └─ page.tsx
│  │     │  ├─ category
│  │     │  │  └─ [slug]
│  │     │  │     └─ page.tsx
│  │     │  ├─ checkout
│  │     │  │  ├─ checkout-client.tsx
│  │     │  │  └─ page.tsx
│  │     │  ├─ contact
│  │     │  │  ├─ contact-client.tsx
│  │     │  │  └─ page.tsx
│  │     │  ├─ error.tsx
│  │     │  ├─ faq
│  │     │  │  ├─ faq-client.tsx
│  │     │  │  └─ page.tsx
│  │     │  ├─ home-client.tsx
│  │     │  ├─ layout.tsx
│  │     │  ├─ loading.tsx
│  │     │  ├─ offers
│  │     │  │  ├─ offers-client.tsx
│  │     │  │  └─ page.tsx
│  │     │  ├─ order-success
│  │     │  │  └─ [id]
│  │     │  │     ├─ order-success-client.tsx
│  │     │  │     └─ page.tsx
│  │     │  ├─ page.tsx
│  │     │  ├─ policies
│  │     │  │  ├─ page.tsx
│  │     │  │  └─ policies-client.tsx
│  │     │  ├─ product
│  │     │  │  └─ [slug]
│  │     │  │     ├─ page.tsx
│  │     │  │     └─ product-detail-client.tsx
│  │     │  ├─ shop
│  │     │  │  ├─ page.tsx
│  │     │  │  └─ shop-client.tsx
│  │     │  └─ wishlist
│  │     │     ├─ page.tsx
│  │     │     └─ wishlist-client.tsx
│  │     ├─ layout.tsx
│  │     └─ not-found.tsx
│  ├─ components
│  │  ├─ admin
│  │  │  ├─ brand-form.tsx
│  │  │  ├─ category-form.tsx
│  │  │  ├─ image-uploader.tsx
│  │  │  ├─ order-status-form.tsx
│  │  │  ├─ product-form.tsx
│  │  │  └─ stat-card.tsx
│  │  ├─ public
│  │  │  ├─ cart-drawer.tsx
│  │  │  ├─ footer.tsx
│  │  │  ├─ hero-section.tsx
│  │  │  ├─ home-sections.tsx
│  │  │  ├─ navbar.tsx
│  │  │  ├─ product-card.tsx
│  │  │  ├─ product-skeleton.tsx
│  │  │  └─ sale-timer.tsx
│  │  ├─ shared
│  │  │  ├─ empty-state.tsx
│  │  │  ├─ loading.tsx
│  │  │  ├─ reveal.tsx
│  │  │  └─ scroll-to-top.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ dialog.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ radio-group.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ switch.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     └─ tooltip.tsx
│  ├─ hooks
│  │  ├─ use-cart.tsx
│  │  ├─ use-scroll-reveal.tsx
│  │  ├─ use-toast.tsx
│  │  └─ use-wishlist.tsx
│  ├─ lib
│  │  ├─ auth.ts
│  │  ├─ cloudinary.ts
│  │  ├─ i18n.ts
│  │  ├─ navigation.ts
│  │  ├─ prisma.ts
│  │  ├─ settings.ts
│  │  ├─ utils.ts
│  │  ├─ validations.ts
│  │  └─ whatsapp.ts
│  ├─ messages
│  │  ├─ ar.json
│  │  ├─ de.json
│  │  └─ en.json
│  ├─ middleware.ts
│  ├─ styles
│  │  └─ globals.css
│  └─ types
│     ├─ global.d.ts
│     └─ index.ts
├─ structure.txt
├─ tailwind.config.ts
└─ tsconfig.json

```
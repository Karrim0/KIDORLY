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

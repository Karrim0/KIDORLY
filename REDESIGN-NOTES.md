# Kidorly immersive storefront

## What changed

- The navbar and hero now share one light glass visual system. The navbar floats above the media instead of adding a dark strip across the page.
- The desktop headline is capped to the available viewport, and the mobile hero becomes a connected media-and-content sheet with controls kept away from the subject.
- The mobile dock stays out of the initial hero and enters after the visitor scrolls, so it cannot cover the primary call to action.
- The hero no longer puts large copy and buttons over the product subject. Mobile uses a dedicated media panel followed by readable content, while desktop uses a balanced split layout.
- Categories are circular, lightweight, and use native horizontal scrolling on mobile. There is no autoplay delay or JavaScript carousel dependency.
- Products use a responsive two-column mobile grid and expand to three/four columns on larger screens.
- Featured collections form a scroll-driven story on desktop and clean visual cards on mobile.
- Age groups are interactive and show products that are actually assigned by the admin.
- Partners run in a continuous duplicated loop so the row never becomes empty.
- The buying journey, trust benefits, delivery, and payment areas use a light visual system designed for small screens.
- Cart actions provide immediate visual feedback without blocking navigation.

## Admin workflow

1. Open `/admin/homepage` to upload desktop/mobile hero images and arrange the homepage sections.
2. Open `/admin/catalog` to maintain collections and age groups, including image, banner, order, visibility, and featured status.
3. Open `/admin/products` to assign products to the correct collection and age group.
4. Only visible and featured catalog groups appear on the homepage. Visible groups remain available in shop filters.

## Deployment

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run check
```

Do not run `npm run db:seed` against the current production database. It is intended only for a new, empty development database.

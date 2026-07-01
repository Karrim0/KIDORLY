-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "City" AS ENUM ('HURGHADA', 'CAIRO', 'ALEXANDRIA');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('NOT_DELIVERED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('HOME', 'HOTEL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH_ON_DELIVERY', 'VODAFONE_CASH', 'INSTAPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID');

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "description_en" TEXT,
    "description_ar" TEXT,
    "description_de" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "description_ar" TEXT,
    "description_en" TEXT,
    "description_de" TEXT,
    "image" TEXT,
    "discount_percentage" DOUBLE PRECISION,
    "seo_title_ar" TEXT,
    "seo_title_en" TEXT,
    "seo_title_de" TEXT,
    "seo_desc_ar" TEXT,
    "seo_desc_en" TEXT,
    "seo_desc_de" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_sections" (
    "id" TEXT NOT NULL,
    "section_key" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "filename" TEXT,
    "folder" TEXT NOT NULL DEFAULT 'kidorly',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT,
    "product_name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "color" TEXT,
    "size" TEXT,
    "image" TEXT,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "delivery_type" "DeliveryType" NOT NULL,
    "address" TEXT,
    "hotel_name" TEXT,
    "guest_name" TEXT,
    "room_number" TEXT,
    "notes" TEXT,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "delivery_status" "DeliveryStatus" NOT NULL DEFAULT 'NOT_DELIVERED',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "shipping_cost" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "governorate" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "short_desc_ar" TEXT,
    "short_desc_en" TEXT,
    "short_desc_de" TEXT,
    "description_ar" TEXT,
    "description_en" TEXT,
    "description_de" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "compare_at_price" DOUBLE PRECISION,
    "discount_percentage" DOUBLE PRECISION,
    "availability" "Availability" NOT NULL DEFAULT 'AVAILABLE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "colors" TEXT[],
    "sizes" TEXT[],
    "seo_title_ar" TEXT,
    "seo_title_en" TEXT,
    "seo_title_de" TEXT,
    "seo_desc_ar" TEXT,
    "seo_desc_en" TEXT,
    "seo_desc_de" TEXT,
    "category_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "brand_id" TEXT,
    "sale_ends_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "brands_featured_idx" ON "brands"("featured" ASC);

-- CreateIndex
CREATE INDEX "brands_slug_idx" ON "brands"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "homepage_sections_section_key_key" ON "homepage_sections"("section_key" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number" ASC);

-- CreateIndex
CREATE INDEX "products_brand_id_idx" ON "products"("brand_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key" ASC);

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;


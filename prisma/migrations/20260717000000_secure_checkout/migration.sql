ALTER TABLE "orders"
ADD COLUMN "idempotency_key" TEXT,
ADD COLUMN "access_token" TEXT;

CREATE UNIQUE INDEX "orders_idempotency_key_key" ON "orders"("idempotency_key");
CREATE UNIQUE INDEX "orders_access_token_key" ON "orders"("access_token");

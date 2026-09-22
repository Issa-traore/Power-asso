-- Plans now store a monthly base price; billing duration (1/3/12 months) is chosen at checkout instead of being baked into the plan row.
ALTER TABLE "Plan" RENAME COLUMN "priceCents" TO "monthlyPriceCents";
ALTER TABLE "Plan" DROP COLUMN "interval";
DROP TYPE IF EXISTS "BillingInterval";

-- Records which billing duration a payment covered.
ALTER TABLE "Payment" ADD COLUMN "periodMonths" INTEGER NOT NULL DEFAULT 1;

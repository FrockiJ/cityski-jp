-- Migration: Add active column to order_member table
-- Date: 2025-11-12
-- Description: Adds an 'active' boolean column to the order_member table with default value true

-- Add active column with default value true
ALTER TABLE order_member
ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

-- Create index on active column for better query performance
CREATE INDEX IF NOT EXISTS idx_order_member_active
ON order_member(active);

-- Optional: Update any existing records to ensure they have active = true
UPDATE order_member
SET active = true
WHERE active IS NULL;

-- Add comment to the column for documentation
COMMENT ON COLUMN order_member.active IS 'Indicates whether the order member is active. Inactive members (false) are not displayed in listings.';

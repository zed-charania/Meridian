-- Add payment fields to n400_forms table
ALTER TABLE n400_forms
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_amount INTEGER,
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;

-- Create index for faster payment status lookups
CREATE INDEX IF NOT EXISTS idx_n400_forms_payment_status ON n400_forms(payment_status);

-- Add comment for documentation
COMMENT ON COLUMN n400_forms.payment_status IS 'Payment status: pending, paid, failed';
COMMENT ON COLUMN n400_forms.payment_id IS 'Stripe payment intent ID';
COMMENT ON COLUMN n400_forms.payment_amount IS 'Payment amount in cents';
COMMENT ON COLUMN n400_forms.payment_date IS 'When payment was completed';

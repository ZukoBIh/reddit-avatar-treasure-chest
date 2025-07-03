
-- Create a table for reward configuration
CREATE TABLE public.reward_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_type text NOT NULL UNIQUE,
  base_xp_min integer NOT NULL DEFAULT 10,
  base_xp_max integer NOT NULL DEFAULT 30,
  token_drop_chance decimal(5,4) NOT NULL DEFAULT 0.05,
  token_amount_min integer NOT NULL DEFAULT 10,
  token_amount_max integer NOT NULL DEFAULT 50,
  level_up_hroom integer NOT NULL DEFAULT 100,
  level_up_spore integer NOT NULL DEFAULT 25,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default reward configuration
INSERT INTO public.reward_config (
  config_type, 
  base_xp_min, 
  base_xp_max, 
  token_drop_chance, 
  token_amount_min, 
  token_amount_max,
  level_up_hroom,
  level_up_spore
) VALUES (
  'default', 
  10, 
  30, 
  0.05, 
  10, 
  50,
  100,
  25
);

-- Enable RLS on reward_config
ALTER TABLE public.reward_config ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read reward config
CREATE POLICY "Anyone can view reward config" 
  ON public.reward_config 
  FOR SELECT 
  USING (true);

-- Only allow updates (no inserts/deletes to keep config stable)
CREATE POLICY "Anyone can update reward config" 
  ON public.reward_config 
  FOR UPDATE 
  USING (true);

-- Add trigger to update the updated_at column
CREATE TRIGGER update_reward_config_updated_at 
  BEFORE UPDATE ON public.reward_config 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

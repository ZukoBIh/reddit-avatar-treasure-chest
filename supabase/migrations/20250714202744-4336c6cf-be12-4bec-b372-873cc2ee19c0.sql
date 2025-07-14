-- Create leveling system configuration table
CREATE TABLE public.leveling_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_xp_requirement INTEGER NOT NULL DEFAULT 100,
  xp_scaling_factor NUMERIC NOT NULL DEFAULT 1.15,
  max_level INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default leveling configuration
INSERT INTO public.leveling_config (base_xp_requirement, xp_scaling_factor, max_level) 
VALUES (100, 1.15, 100);

-- Create level-up rewards pool table
CREATE TABLE public.level_rewards_pool (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('hroom', 'spore', 'both')),
  hroom_amount INTEGER NOT NULL DEFAULT 0,
  spore_amount INTEGER NOT NULL DEFAULT 0,
  weight INTEGER NOT NULL DEFAULT 1, -- Higher weight = more likely to be selected
  min_level INTEGER NOT NULL DEFAULT 1,
  max_level INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default reward pool
INSERT INTO public.level_rewards_pool (reward_type, hroom_amount, spore_amount, weight, min_level, max_level) VALUES
('hroom', 100, 0, 5, 1, 20),
('spore', 0, 25, 5, 1, 20),
('both', 50, 15, 3, 1, 50),
('hroom', 200, 0, 4, 21, 50),
('spore', 0, 50, 4, 21, 50),
('both', 150, 30, 2, 21, 100),
('hroom', 300, 0, 3, 51, 100),
('spore', 0, 75, 3, 51, 100),
('both', 250, 50, 1, 51, 100);

-- Enable RLS
ALTER TABLE public.leveling_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_rewards_pool ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view leveling config" ON public.leveling_config FOR SELECT USING (true);
CREATE POLICY "Anyone can view level rewards pool" ON public.level_rewards_pool FOR SELECT USING (true);

-- Admin-only policies for modifications (you can adjust these based on your admin system)
CREATE POLICY "Admins can update leveling config" ON public.leveling_config FOR UPDATE USING (true);
CREATE POLICY "Admins can update level rewards pool" ON public.level_rewards_pool FOR ALL USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_leveling_config_updated_at
BEFORE UPDATE ON public.leveling_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_level_rewards_pool_updated_at
BEFORE UPDATE ON public.level_rewards_pool
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
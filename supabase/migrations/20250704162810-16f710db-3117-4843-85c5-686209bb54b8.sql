-- Create rarity-specific reward configuration table
CREATE TABLE public.rarity_rewards (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rarity TEXT NOT NULL CHECK (rarity IN ('Common', 'Rare', 'Legendary')),
    base_xp_min INTEGER NOT NULL DEFAULT 10,
    base_xp_max INTEGER NOT NULL DEFAULT 30,
    token_drop_chance NUMERIC NOT NULL DEFAULT 0.05,
    token_amount_min INTEGER NOT NULL DEFAULT 10,
    token_amount_max INTEGER NOT NULL DEFAULT 50,
    level_up_hroom INTEGER NOT NULL DEFAULT 100,
    level_up_spore INTEGER NOT NULL DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(rarity)
);

-- Enable Row Level Security
ALTER TABLE public.rarity_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies for rarity rewards
CREATE POLICY "Anyone can view rarity rewards" 
ON public.rarity_rewards 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update rarity rewards" 
ON public.rarity_rewards 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can insert rarity rewards" 
ON public.rarity_rewards 
FOR INSERT 
WITH CHECK (true);

-- Insert default values for each rarity
INSERT INTO public.rarity_rewards (rarity, base_xp_min, base_xp_max, token_drop_chance, token_amount_min, token_amount_max, level_up_hroom, level_up_spore) VALUES
('Common', 10, 30, 0.05, 10, 50, 100, 25),
('Rare', 20, 60, 0.08, 20, 80, 150, 35),
('Legendary', 50, 100, 0.12, 50, 150, 200, 50);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rarity_rewards_updated_at
BEFORE UPDATE ON public.rarity_rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  achievement_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL, -- 'chest_opens', 'collection_complete'
  requirement_value INTEGER NOT NULL DEFAULT 0,
  reward_spores INTEGER NOT NULL DEFAULT 0,
  reward_hroom INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table to track progress
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  achievement_key TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, achievement_key)
);

-- Create collection tracking table
CREATE TABLE public.collection_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  completion_bonus_claimed BOOLEAN NOT NULL DEFAULT false,
  first_completion_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements
CREATE POLICY "Anyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage achievements" 
ON public.achievements 
FOR ALL 
USING (true);

-- RLS Policies for user achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own achievements" 
ON public.user_achievements 
FOR ALL 
USING (true);

-- RLS Policies for collection completions
CREATE POLICY "Users can view their collection completion" 
ON public.collection_completions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their collection completion" 
ON public.collection_completions 
FOR ALL 
USING (true);

-- Add update trigger for timestamps
CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at
BEFORE UPDATE ON public.user_achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collection_completions_updated_at
BEFORE UPDATE ON public.collection_completions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default achievements
INSERT INTO public.achievements (achievement_key, title, description, icon, requirement_type, requirement_value, reward_spores, reward_hroom) VALUES
('first_chest', 'First Discovery', 'Open your first chest', '📦', 'chest_opens', 1, 50, 200),
('chest_opener_10', 'Treasure Hunter', 'Open 10 chests', '🗝️', 'chest_opens', 10, 100, 500),
('chest_opener_50', 'Master Explorer', 'Open 50 chests', '🏆', 'chest_opens', 50, 250, 1000),
('chest_opener_100', 'Legendary Seeker', 'Open 100 chests', '👑', 'chest_opens', 100, 500, 2500),
('collection_master', 'Collection Master', 'Collect all 5 Actrule NFTs', '🎯', 'collection_complete', 5, 1000, 5000);
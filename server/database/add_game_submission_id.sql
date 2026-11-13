ALTER TABLE public.games
ADD COLUMN IF NOT EXISTS submission_id TEXT;

UPDATE public.games
SET submission_id = id::TEXT
WHERE submission_id IS NULL;

ALTER TABLE public.games
ALTER COLUMN submission_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS games_submission_id_unique
ON public.games (submission_id);


-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Prevent duplicate usernames (case-insensitive)
CREATE UNIQUE INDEX players_username_unique
ON players (LOWER(username));

-- Games table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id TEXT NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('in_progress', 'completed')),
    winner_id UUID REFERENCES players(id),
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ
);

-- Game results table
CREATE TABLE game_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id),
    final_score INTEGER NOT NULL CHECK (final_score >= 0),
    placement INTEGER NOT NULL CHECK (placement > 0),
    UNIQUE (game_id, player_id)
);

-- Indexes
CREATE INDEX game_results_player_id_idx
ON game_results(player_id);

CREATE INDEX game_results_game_id_idx
ON game_results(game_id);

CREATE INDEX games_status_idx
ON games(status);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

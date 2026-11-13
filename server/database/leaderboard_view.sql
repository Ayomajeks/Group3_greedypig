
CREATE OR REPLACE VIEW public.leaderboard_stats
WITH (security_invoker = true)
AS

WITH player_stats AS (
    SELECT
        p.id AS player_id,
        p.username,

        COUNT(DISTINCT gr.game_id)
            FILTER (
                WHERE g.status = 'completed'
            )::INTEGER AS games_played,

        COUNT(DISTINCT g.id)
            FILTER (
                WHERE g.status = 'completed'
                AND g.winner_id = p.id
            )::INTEGER AS wins,

        COALESCE(
            MAX(gr.final_score)
                FILTER (
                    WHERE g.status = 'completed'
                ),
            0
        )::INTEGER AS best_score,

        COALESCE(
            SUM(gr.final_score)
                FILTER (
                    WHERE g.status = 'completed'
                ),
            0
        )::INTEGER AS total_score

    FROM public.players p

    LEFT JOIN public.game_results gr
        ON gr.player_id = p.id

    LEFT JOIN public.games g
        ON g.id = gr.game_id

    GROUP BY p.id, p.username
),

calculated_stats AS (
    SELECT
        player_id,
        username,
        wins,
        games_played,

        CASE
            WHEN games_played = 0 THEN 0
            ELSE ROUND(
                (wins::NUMERIC / games_played) * 100,
                2
            )
        END AS win_rate,

        best_score,
        total_score

    FROM player_stats
)

SELECT
    ROW_NUMBER() OVER (
        ORDER BY
            wins DESC,
            win_rate DESC,
            best_score DESC,
            username ASC
    )::INTEGER AS rank,

    player_id,
    username,
    wins,
    games_played,
    win_rate,
    best_score,
    total_score

FROM calculated_stats;

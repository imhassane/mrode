exports.INSERT_THREAD = `
  INSERT INTO forum_thread_fth (fth_title, fth_content, mid_id, fth_tokens)
  VALUES ($1, $2, $3, to_tsvector($1 || ' ' || $2))
  RETURNING *
`;

exports.GET_LAST_THREADS = `
  SELECT
    fth_id, fth_title, fth_content,
    fth_inserted_at, fth_updated_at,
    fth_up_votes, fth_down_votes, fth_answers_count,
    fth_views,
    mid_first_name, mid_last_name, mid_avatar_url, fth.mid_id,
    mid_inserted_at
  FROM forum_thread_fth as fth
  JOIN mlm_identity_mid USING (mid_id)
  WHERE fth_visible = true
  ORDER BY fth_id DESC
  OFFSET $1 LIMIT $2
`;

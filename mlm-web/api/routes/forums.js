const router = require("express").Router();

const db = require("../pool");
const queries = require("../queries");

router.get("/", async (req, res) => {
  let { start, count } = req.query;
  if(!start)
    start = 0;
  if(!count)
    count = 10;

  try {
    const threadsQuery = await db.query(queries.GET_LAST_THREADS, [start, count]);
    return res.send({ data: threadsQuery.rows });
  } catch {
    return res.status(500).send({ error: "Une erreur est survenue" });
  }
});

router.get("/thread/replies/:thread/:limit/", async (req, res) => {
  let { limit, thread } = req.params;
  thread = parseInt(thread);
  if(!thread || isNaN(thread))
    return res.status(404).send({ error: "Ce thread n'existe pas" });

  if(!limit) limit = 10;
  else limit = parseInt(limit);

  try {
    const { rows } = await db.query(`
      SELECT
        ftr_id, ftr_content, ftr_up_votes, ftr_down_votes, ftr_answers_count,
        ftr_inserted_at, ftr_updated_at,
        mid_first_name, mid_last_name, mid_avatar_url
      FROM forum_thread_reply_ftr
      JOIN mlm_identity_mid mim on forum_thread_reply_ftr.mid_id = mim.mid_id
      WHERE thread_id = $1
      LIMIT $2
    `, [thread, limit]);

    return res.send({ data: rows });
  } catch {
    return res.status(500).send({ error: "Une erreur est survenue" });
  }
});

router.post("/thread/new", async (req, res) => {
  const { title, description, author } = req.body;
  if(!title || title.trim().length < 10)
    return res.status(400).send({ error: "La question doit contenir plus de 10 caractères" });

  if(!description || description.trim().length < 30)
    return res.status(400).send({ error: "La question doit contenir plus de 30 caractères" });

  if(!author)
    return res.status(400).send({ error: "Vous devez être connecté pour poser une question" });

  try {

    const threadQuery = await db.query(queries.INSERT_THREAD, [
      title, description, parseInt(author)
    ]);

    return res.send({ data: threadQuery.rows[0] });
  } catch {
    return res.status(500).send({ error: "Une erreur interne s'est produite" });
  }
});

router.post("/thread/reply/:id/", async (req, res) => {
  const { reply, author } = req.body;
  const threadId = req.params.id;

  if(!threadId)
    return res.status(400).send({ error: "Ce thread n'existe pas" });

  if(!author)
    return res.status(400).send({ error: "Vous devez être connecté" });

  const client = await db.connect();
  try {
    // Vérification de l'existance du thread.
    const { rowCount } = await client.query("SELECT fth_id FROM forum_thread_fth WHERE fth_id = $1", [threadId]);
    if(rowCount !== 1) {
      client.release();
      return res.status(404).send({ error: "Ce thread n'existe pas" });
    }

    await client.query('BEGIN');
    const { rows } = await client.query(`
        INSERT INTO forum_thread_reply_ftr (mid_id, thread_id, ftr_content, ftr_tokens)
        VALUES ($1, $2, $3, to_tsvector($3))
        RETURNING ftr_id
      `,
      [parseInt(author), threadId, reply]);
    await client.query(`
      UPDATE forum_thread_fth
        SET fth_answers_count = fth_answers_count + 1,
            fth_views = fth_views + 1
      WHERE fth_id = $1
    `, [threadId]);

    const replyQuery = await client.query(`
      SELECT
        ftr_id, ftr_content, ftr_up_votes, ftr_down_votes, ftr_answers_count,
        ftr_inserted_at, ftr_updated_at,
        mid_first_name, mid_last_name, mid_avatar_url
      FROM forum_thread_reply_ftr
      JOIN mlm_identity_mid mim on forum_thread_reply_ftr.mid_id = mim.mid_id
      WHERE ftr_id = $1
    `, [rows[0].ftr_id]);
    await client.query('COMMIT');
    client.release();

    return res.send({ data: replyQuery.rows[0] });
  } catch (ex) {
    try {
      client.release();
      await client.query('ROLLBACK');
    } catch {}
    console.log(ex.message)
    return res.status(500).send({ error: "Une erreur interne est survenue" });
  }
});



module.exports = router;

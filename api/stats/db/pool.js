const {Pool} = require('pg');

const pool = new Pool();

pool.on('error', (err, _client) => {
    // TODO: logging.
    console.log(err.message);
});

module.exports = {
    query: async (text, params) => {
        return await pool.query(text, params);
    },
    connect: async () => {
        return await pool.connect();
    }
};
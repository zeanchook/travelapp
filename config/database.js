// const debug = require("debug")("pern:config:database");
const { Pool } = require("pg");
const connectionString = process.env.PGDB_URL;

const pool = new Pool({
  connectionString,
});

const checkDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log(
      `Connected to PostgreSQL database at ${client.host}, Port:${client.port}`,
    );
    client.release();
  } catch (err) {
    console.error("Error connecting to the database", err.stack);
    process.exit(-1);
  }
};

checkDbConnection();

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;

//

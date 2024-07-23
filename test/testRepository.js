const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const host = process.env.DBHOST;
const user = process.env.DBUSER; 
const password = process.env.DBPASSWORD;
const database = process.env.DBDATABASE;
const port = process.env.DBPORT;

const pool = mysql.createPool({ 
  host: host,
  user: user,
  password: password,
  database: database,
  port: port,
});

async function getTest() {
    const connection = await pool.getConnection(); 
    try {
      const [rows] = await connection.query('SELECT * FROM user');
      return rows.length > 0 ? rows : null;
    } catch (err) {
      console.error('Database Error:', err);
      throw err;
    } finally {
      connection.release();
    }
  }

module.exports = { getTest };

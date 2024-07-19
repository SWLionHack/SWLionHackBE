const mysql = require('mysql2/promise');

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
    const [rows] = await connection.query(
      'SELECT * FROM users'
    );
    if (rows.length > 0) {
      return rows
    } else {
      return null;
    }
  } catch (err) {
    console.error('Database Error:', err);
    throw err;  // 에러 발생 시 상위 스택으로 전파
  } finally {
    connection.release();
  }
}

module.exports = { getTest };

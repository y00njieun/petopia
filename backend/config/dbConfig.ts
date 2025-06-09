import mysql, { createPool } from "mysql2";
import {config} from 'dotenv';
config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);


console.log(` 연결된 데이터베이스: ${dbConfig.database}`);


pool.getConnection((err, connection) => {
  if(err) {
    console.error('DB 연결 실패', err);
    return;
  }
  console.log('DB 연결 성공');
  connection.release();
});

export default pool;
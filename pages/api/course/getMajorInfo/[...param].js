const pool = require("../../../../lib/db")

export default async function handler(req, res) {
  const connection = await pool.getConnection(async (conn) => conn)
  const [rows] = await connection.query(`select * from major`)
  connection.release()
  res.status(200).json({ rows })
}

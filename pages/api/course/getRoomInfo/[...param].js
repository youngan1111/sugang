const pool = require("../../../../lib/db")

export default async function handler(req, res) {
  const connection = await pool.getConnection(async (conn) => conn)
  const [rows] = await connection.query(
    `select * from room r left join building b on r.building_id = b.building_id`
  )
  connection.release()
  res.status(200).json({ rows })
}

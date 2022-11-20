const pool = require("../../../../lib/db")

export default async function handler(req, res) {
  const { param } = req.query
  if (param.length != 0) {
    let whereStatement = `${param[0]}`
    for (let i = 1; i < param.length; i++) {
      whereStatement += " and " + param[i]
    }

    const connection = await pool.getConnection(async (conn) => conn)
    const [rows] = await connection.query(
      `SELECT s.student_id, s.name student_name, m.name major, l.name lecturer, year, state FROM student s LEFT JOIN major m ON s.major_id = m.major_id LEFT JOIN lecturer l ON s.lecturer_id = l.lecturer_id WHERE ${whereStatement}`
    )
    connection.release()
    res.status(200).json({ rows })
  }
}

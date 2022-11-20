const pool = require("../../../../lib/db")

export default async function handler(req, res) {
  const { param } = req.query
  // student_id, state

  const connection = await pool.getConnection(async (conn) => conn)
  const [rows] = await connection.query(
    `UPDATE student SET state = '${param[1]}' WHERE student_id = '${param[0]}'`
  )
  connection.release()
  return res.status(200).json({
    success: true,
    message: "학적 변경을 완료했습니다.",
  })
}

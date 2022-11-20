const pool = require("../../../../lib/db")

export default async function handler(req, res) {
  const { param } = req.query
  // clss_id course_id

  const connection = await pool.getConnection(async (conn) => conn)
  await connection.query(
    `DELETE FROM schedule WHERE class_id='${param[0]}' and course_id='${param[1]}'`
  )
  await connection.query(
    `DELETE FROM desired_schedule WHERE class_id='${param[0]}' and course_id='${param[1]}'`
  )
  await connection.query(`DELETE FROM time WHERE class_id='${param[0]}'`)
  await connection.query(
    `DELETE FROM class WHERE class_id='${param[0]}' and course_id='${param[1]}'`
  )

  connection.release()
  return res.status(200).json({
    success: true,
    message: "과목이 폐강되었습니다.",
  })
}

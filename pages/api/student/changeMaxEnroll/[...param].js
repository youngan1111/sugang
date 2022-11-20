const pool = require("../../../../lib/db")

export default async function handler(req, res) {
  const { param } = req.query
  // clss_id, occupancy, changed_max_enroll
  if (param[1] < param[2]) {
    return res.status(200).json({
      error: true,
      message: "수강정원이 강의실 수용인원보다 많습니다.",
    })
  }
  const connection = await pool.getConnection(async (conn) => conn)
  const [rows] = await connection.query(
    `UPDATE class SET person_max = '${param[2]}' WHERE class_id = '${param[0]}'`
  )
  connection.release()
  return res.status(200).json({
    success: true,
    message: "과목이 증원되었습니다.",
  })
}

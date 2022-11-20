const pool = require("../../../../lib/db")

export default async function handler(req, res) {
  const { param } = req.query
  // courseId, name, credit

  const connection = await pool.getConnection(async (conn) => conn)

  let response = await connection.query(
    `select count(*) cnt from course where course_id='${param[0]}'`
  )
  if (response[0][0].cnt != 0) {
    return res.status(200).json({
      error: true,
      message: "이미 존재하는 학수번호입니다.",
    })
  }

  if (param[2] < 1) {
    return res.status(200).json({
      error: true,
      message: "학점은 1점 이상부터 가능합니다.",
    })
  }

  if (!Number.isInteger(Number(param[2]))) {
    return res.status(200).json({
      error: true,
      message: "학점은 소수점이 불가합니다.",
    })
  }

  const [rows] = await connection.query(
    `INSERT INTO course(course_id, name, credit) VALUES ('${param[0]}','${param[1]}','${param[2]}')`
  )
  connection.release()
  return res.status(200).json({
    success: true,
    message: `새로운 과목이 생성되었습니다.`,
  })
}

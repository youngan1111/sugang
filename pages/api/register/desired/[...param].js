const pool = require("../../../../lib/db")

export default async function handler(req, res) {
  const { param } = req.query
  if (param.length != 0) {
    let whereStatement = `${param[0]}`
    for (let i = 1; i < param.length; i++) {
      whereStatement += " and " + param[i]
    }

    const connection = await pool.getConnection(async (conn) => conn)
    // 이미 희망한 과목인지 체크
    let response = await connection.query(
      `SELECT COUNT(*) cnt FROM desired_schedule WHERE student_id = '${param[0]}' AND class_id = '${param[2]}'`
    )
    if (response[0][0].cnt > 0) {
      return res.status(200).json({
        error: true,
        message: `이미 희망한 과목입니다.`,
      })
    }

    // 수강 신청하기
    await connection.query(
      `INSERT INTO desired_schedule(course_id, class_id, student_id) VALUES ('${param[1]}','${param[2]}',${param[0]});`
    )

    connection.release()
    return res.status(200).json({
      success: true,
      message: "희망수업 등록 완료되었습니다.",
    })
  }
}

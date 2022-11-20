const pool = require("../../../../lib/db")

// 수강신청 가능한지 체크하는 middleware (재수강, 정원, 시간, 최대학점)
export default async function handler(req, res) {
  const { param } = req.query
  // [ '2018003125', 'GEN5026', '10103', '30', '3' ]

  const grade = {
    "A+": 0,
    A0: 1,
    "B+": 2,
    B0: 3,
    "C+": 4,
    C0: 5,
    "D+": 6,
    D0: 7,
    F: 8,
  }

  let isReRegister = false

  const connection = await pool.getConnection(async (conn) => conn)
  // 이미 신청한 과목인지 체크
  let response = await connection.query(
    `SELECT COUNT(*) cnt FROM schedule WHERE student_id = '${param[0]}' AND class_id = '${param[2]}'`
  )
  if (response[0][0].cnt > 0) {
    return res.status(200).json({
      error: true,
      message: `이미 신청한 과목입니다.`,
    })
  }

  // 조건1. 재수강 체크
  let [rows] = await connection.query(
    `SELECT * FROM credits WHERE student_id = '${param[0]}' AND course_id = '${param[1]}'`
  )
  if (rows.length != 0) {
    for (let i = 0; i < rows.length; i++) {
      if (grade[rows[i].grade] < 4) {
        connection.release()
        return res.status(200).json({
          error: true,
          message: `이전 성적(${rows[i].grade})이 B0 이상이므로 신청을 할 수 없습니다.`,
        })
      }
    }
    isReRegister = true
  }

  // 조건2. 정원초과 체크
  response = await connection.query(
    `SELECT COUNT(*) cnt FROM schedule WHERE course_id = '${param[1]}' AND class_id = '${param[2]}'`
  )
  if (response[0][0].cnt == param[3]) {
    connection.release()
    return res.status(200).json({
      error: true,
      message: `해당 과목의 수강정원이 다 찼습니다.`,
    })
  }

  // 조건3. 동일 시간대 체크
  response = await connection.query(
    `SELECT begin, end FROM schedule s LEFT JOIN time t ON s.class_id = t.class_id WHERE student_id = '${param[0]}' and begin != 'NO' AND end != 'NO'`
  )
  let response2 = await connection.query(
    `SELECT begin, end FROM time WHERE class_id = '${param[2]}'`
  )
  if (response2[0][0].begin != "NO") {
    for (const newClass of response2[0]) {
      for (const value of response[0]) {
        if (
          new Date(value.end) > new Date(newClass.begin) &&
          new Date(newClass.end) > new Date(value.begin)
        ) {
          connection.release()
          return res.status(200).json({
            error: true,
            message: "동일한 시간대에 기신청 과목이 존재합니다.",
          })
        }
      }
    }
  }

  // 조건4. 최대 18학점 신청가능
  response = await connection.query(
    `SELECT SUM(credit) totalCredit FROM schedule s LEFT JOIN class c ON s.class_id = c.class_id WHERE student_id = '${param[0]}'`
  )
  if (Number(response[0][0].totalCredit) + Number(param[4]) > 18) {
    connection.release()
    return res.status(200).json({
      error: true,
      message: `수강신청 최대학점(18)을 초과했습니다`,
    })
  }

  // 수강 신청하기
  await connection.query(
    `INSERT INTO schedule(course_id, class_id, student_id, re_register) VALUES ('${param[1]}','${param[2]}',${param[0]}, '${isReRegister}');`
  )

  connection.release()
  return res.status(200).json({
    success: true,
    message: `${isReRegister ? "재" : ""}수강 신청이 완료되었습니다.`,
  })
}

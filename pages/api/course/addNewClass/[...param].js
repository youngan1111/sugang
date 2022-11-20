const pool = require("../../../../lib/db")

export default async function handler(req, res) {
  const { param } = req.query

  const connection = await pool.getConnection(async (conn) => conn)

  let response = await connection.query(
    `select count(*) cnt from class where class_id='${param[0]}'`
  )
  if (response[0][0].cnt != 0) {
    return res.status(200).json({
      error: true,
      message: "이미 존재하는 수업번호입니다.",
    })
  }

  await connection.query(
    `INSERT INTO class(class_id, class_no, course_id, name, major_id, year, credit, lecturer_id, person_max, opened, room_id) VALUES ('${param[0]}','1115','${param[1]}','${param[2]}','${param[3]}','${param[4]}','${param[5]}','${param[6]}','${param[7]}','${param[8]}','${param[9]}')`
  )

  if (param[10] == 1) {
    // 2번째 수업도 있는 경우
    if (param[13] != "NO") {
      await connection.query(
        `INSERT INTO time(class_id, period, begin, end) values('${param[0]}','2','${param[13]}','${param[14]}')`
      )
    }
    await connection.query(
      `INSERT INTO time(class_id, period, begin, end) values('${param[0]}','1','${param[11]}','${param[12]}')`
    )
  } else if (param[10] == 0) {
    // 1번째 수업만 있는 경우
    await connection.query(
      `INSERT INTO time(class_id, period, begin, end) values('${param[0]}','1','${param[11]}','${param[12]}')`
    )
  }

  connection.release()
  return res.status(200).json({
    success: true,
    message: `수업이 개설되었습니다.`,
  })
}

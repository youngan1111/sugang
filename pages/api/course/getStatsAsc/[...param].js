const pool = require("../../../../lib/db")

export default async function handler(req, res) {
  const grade = {
    "A+": 4.5,
    A0: 4.0,
    "B+": 3.5,
    B0: 3,
    "C+": 2.5,
    C0: 2,
    "D+": 1.5,
    D0: 1,
    F: 0,
  }

  const connection = await pool.getConnection(async (conn) => conn)
  const [rows] = await connection.query(
    `select a.course_id, c.name, AVG(grade) avg_grade, c.credit from (SELECT credits_id, student_id, course_id, year, REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(grade, 'A+', 4.5), 'A0', 4), 'B+', 3.5), 'B0', 3), 'C+', 2.5), 'C0', 2), 'D+', 1.5), 'D0', 1), 'F', 0) grade FROM credits) a left join course c on a.course_id = c.course_id GROUP BY course_id order by avg_grade asc limit 10`
  )

  for (const value of rows) {
    const response = await connection.query(
      `select * from credits where course_id='${value.course_id}'`
    )
    value.count = response[0].length
    value.grades = response[0].map((ele) => grade[ele.grade])
  }

  connection.release()
  res.status(200).json({ rows })
}

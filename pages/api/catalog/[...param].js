const pool = require("../../../lib/db")

export default async function handler(req, res) {
  const { param } = req.query
  if (param.length != 0) {
    let whereStatement = `${param[0]}`
    for (let i = 1; i < param.length; i++) {
      whereStatement += " and " + param[i]
    }

    const connection = await pool.getConnection(async (conn) => conn)
    const [rows] = await connection.query(
      `SELECT c.year, c.class_id, c.course_id, c.credit, c.name course_name, l.name lecturer_name, t1.begin begin1, t1.end end1, t2.begin begin2, t2.end end2, c.person_max, r.occupancy, b.name building_name, r.room_id FROM class c LEFT JOIN lecturer l ON c.lecturer_id = l.lecturer_id LEFT JOIN time t1 ON c.class_id = t1.class_id and t1.period = 1 LEFT JOIN room r ON c.room_id = r.room_id LEFT JOIN building b ON r.building_id = b.building_id left join time t2 ON c.class_id = t2.class_id and t2.period = 2 WHERE ${whereStatement}`
    )

    for await (const [key, value] of rows.entries()) {
      const response = await connection.query(
        `SELECT COUNT(*) cnt FROM schedule WHERE class_id='${value.class_id}'`
      )
      rows[key].enrolled = response[0][0].cnt
    }

    connection.release()
    res.status(200).json({ rows })
  }
}

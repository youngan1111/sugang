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
      `DELETE FROM schedule WHERE ${whereStatement}`
    )

    connection.release()
    return res.status(200).json({
      success: true,
      message: "수강취소되었습니다.",
    })
  }
}

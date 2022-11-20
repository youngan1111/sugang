import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
const pool = require("../../../lib/db")

// nextauth 라이브러리에서 제공하는 credential auth를 획득하는 함수
// {
//   user: {
//     name: string
//     email: string
//     image: string
// }
// user 아래의 name, image, email 로만 유저 정보를 세션에서 가지고 있을 수 있어 이름은 다르지만 image에는 권한 email에는 유저의 아이디를 저장한다.

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const connection = await pool.getConnection(async (conn) => conn)
        if (credentials.admin === "on") {
          const [rows] = await connection.query(
            "SELECT * from `admin` where `admin_id` = ? and `password` = ?",
            [credentials.id, credentials.pw]
          )
          // user 아래의 name, image, email 로만 유저 정보를 세션에서 가지고 있을 수 있어 이름은 다르지만 image에는 권한 email에는 유저의 아이디를 저장한다.
          rows[0]["image"] = "admin"
          rows[0]["email"] = rows[0].admin_id

          if (rows.length != 0) return rows[0]
        } else {
          const [rows] = await connection.query(
            "SELECT * from `student` where `student_id` = ? and `password` = ?",
            [credentials.id, credentials.pw]
          )
          rows[0]["image"] = "user"
          rows[0]["email"] = rows[0].student_id

          if (rows.length != 0) return rows[0]
        }
        connection.release()
        return Promise.reject(new Error("Unknown Error"))
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/relogin",
  },
}
export default NextAuth(authOptions)

import Header from "../../../components/Header"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { useRouter } from "next/router"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

export default function StudentSchedule() {
  const [studentScore, setStudentScore] = useState([])
  const [numberOfCourse, setNumberOfCourse] = useState(0)
  const [sumOfCredits, setSumOfCredits] = useState(0)
  const { data: session, status } = useSession()

  const router = useRouter()
  const [student_id, student_name] = router.query.param

  let temp = []

  const fetchData = async () => {
    const { data } = await axios.get(
      `/api/student/getScore/c.student_id=${student_id}`
    )
    setStudentScore(data.rows)

    setNumberOfCourse(data.rows.length)
    let sum = 0
    data.rows.map((e) => {
      sum += Number(e.credit)
    })
    setSumOfCredits(sum)
  }

  useEffect(() => {
    if (status == "authenticated") fetchData()
  }, [status])

  return (
    <>
      <Header />
      <Typography sx={{ ml: 3, mt: 1, mb: 2 }} variant="h5" gutterBottom>
        · {student_name} 성적 조회
      </Typography>
      <Typography sx={{ ml: 3 }} variant="subtitle2">
        이수내역: {numberOfCourse}과목 / {sumOfCredits}학점
      </Typography>

      <Paper elevation={1} sx={{ m: 3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>학수번호</TableCell>
                <TableCell align="center">과목명</TableCell>
                <TableCell align="center">학점</TableCell>
                <TableCell align="center">등급</TableCell>
                <TableCell align="center">수강년도</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentScore.length != 0 ? (
                studentScore.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.course_id}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.credit}</TableCell>
                    <TableCell align="center">{row.grade}</TableCell>
                    <TableCell align="center">{row.year}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    성적 없음
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}

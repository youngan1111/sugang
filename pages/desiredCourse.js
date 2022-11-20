import TextField from "@mui/material/TextField"
import Header from "../components/Header"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import axios from "axios"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useSession } from "next-auth/react"
import timeHandler from "../utils/timestampHandler"

export default function MyCurrentList() {
  const [myCurrentList, setMyCurrentList] = useState([])
  const [numberOfCourse, setNumberOfCourse] = useState(0)
  const [sumOfCredits, setSumOfCredits] = useState(0)
  const { data: session, status } = useSession()

  // 월요일이 1부터이기에 앞에 채워준다.
  const day = ["", "월", "화", "수", "목", "금", "토"]

  const fetchData = async () => {
    const { data } = await axios.get(
      `/api/register/showDesired/student_id=${session.user.email}`
    )

    setMyCurrentList(data.rows)
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
        · 희망수업
      </Typography>
      <Typography sx={{ ml: 3 }} variant="subtitle2">
        {numberOfCourse}과목 / {sumOfCredits}학점
      </Typography>

      <Paper elevation={1} sx={{ m: 3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>학년</TableCell>
                <TableCell align="center">수업번호</TableCell>
                <TableCell align="center">학수번호</TableCell>
                <TableCell align="center">교과목명</TableCell>
                <TableCell align="center">교강사</TableCell>
                <TableCell align="center">학점</TableCell>
                <TableCell align="center">수업시간</TableCell>
                <TableCell align="center">신청인원</TableCell>
                <TableCell align="center">수강정원</TableCell>
                <TableCell align="center">강의실 수용인원</TableCell>
                <TableCell align="center">강의실(건물+호수)</TableCell>
                {/* 로그인 안 했을 경우 수강취소 버튼 없고 관리자도 수강취소를 할 수 없다 */}
                {status === "authenticated" && session.user.image === "user" ? (
                  <TableCell align="center">희망취소</TableCell>
                ) : (
                  <></>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {myCurrentList.length != 0 ? (
                myCurrentList.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.year}
                    </TableCell>
                    <TableCell align="center">{row.class_id}</TableCell>
                    <TableCell align="center">{row.course_id}</TableCell>
                    <TableCell align="center">{row.course_name}</TableCell>
                    <TableCell align="center">{row.lecturer_name}</TableCell>
                    <TableCell align="center">{row.credit}</TableCell>
                    <TableCell align="center">
                      {row.begin1 == "NO"
                        ? "시간미지정 강좌"
                        : timeHandler(row.begin1, row.end1) +
                          (row.begin2 != null
                            ? timeHandler(row.begin2, row.end2)
                            : "")}
                    </TableCell>
                    <TableCell align="center">{row.enrolled}</TableCell>
                    <TableCell align="center">{row.person_max}</TableCell>
                    <TableCell align="center">{row.occupancy}</TableCell>
                    <TableCell align="center">{`${row.building_name} ${row.room_id}호`}</TableCell>
                    {status === "authenticated" &&
                    session.user.image === "user" ? (
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={async () => {
                            const { data } = await axios.get(
                              `/api/register/desiredCancel/student_id=${session.user.email}/class_id='${row.class_id}'`
                            )
                            if (data.success) {
                              fetchData()
                              alert(data.message)
                            }
                          }}
                        >
                          취소
                        </Button>
                      </TableCell>
                    ) : (
                      <></>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    희망내역 없음
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

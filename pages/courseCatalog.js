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

export default function AddressForm() {
  const [classData, setClassData] = useState([])
  const [classNum, setClassNum] = useState("")
  const [grade, setGrade] = useState("")
  const [className, setClassName] = useState("")
  const [courseId, setCourseId] = useState("")
  const { data: session, status } = useSession()

  // 월요일이 1부터이기에 앞에 채워준다.
  const day = ["", "월", "화", "수", "목", "금", "토"]

  const courseSearch = async () => {
    // 수업번호, 학수번호는 완전 일치 검색 교과목명은 키워드 포함 검색
    const { data } = await axios.get(
      `/api/catalog/opened=2022${
        classNum != "" ? `/c.class_id='${classNum}'` : ""
      }${grade != "" ? `/year=${grade}` : ""}${
        className != ""
          ? `/c.name like '${encodeURI("%")}${className}${encodeURI("%")}'`
          : ""
      }${courseId != "" ? `/c.course_id='${courseId}'` : ""}`
    )
    setClassData(data.rows)
  }

  useEffect(() => {
    if (status == "authenticated") courseSearch()
  }, [status, session])

  return (
    <>
      <Header />
      <Typography sx={{ ml: 3, mt: 1, mb: 2 }} variant="h5" gutterBottom>
        · 수강편람
      </Typography>
      <Paper elevation={1} sx={{ ml: 3, mr: 3 }}>
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="수업번호"
          value={classNum}
          variant="standard"
          onChange={(e) => setClassNum(e.target.value)}
        />
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="학년"
          value={grade}
          variant="standard"
          onChange={(e) => setGrade(e.target.value)}
        />
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="학수번호"
          value={courseId}
          variant="standard"
          onChange={(e) => setCourseId(e.target.value)}
        />
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="교과목명"
          value={className}
          variant="standard"
          onChange={(e) => setClassName(e.target.value)}
        />
        <Button
          sx={{ ml: 3, mt: 2, mb: 1 }}
          variant="outlined"
          onClick={() => {
            setClassData([])
            setClassNum("")
            setGrade("")
            setClassName("")
            setCourseId("")
          }}
        >
          초기화
        </Button>
        <Button
          sx={{ ml: 2, mt: 2, mb: 1 }}
          variant="contained"
          onClick={courseSearch}
        >
          조회
        </Button>
      </Paper>

      <Paper elevation={1} sx={{ m: 3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                {/* 로그인 안 했을 경우 수강신청 버튼 없고 관리자도 수강신청을 할 수 없다 */}
                {status === "authenticated" && session.user.image === "user" ? (
                  <>
                    <TableCell align="center">수강신청</TableCell>
                    <TableCell align="center">수강희망</TableCell>
                  </>
                ) : (
                  <></>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {classData.length != 0 ? (
                classData.map((row, index) => (
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
                      <>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            onClick={async () => {
                              const { data } = await axios.get(
                                `/api/register/registration/${session.user.email}/${row.course_id}/${row.class_id}/${row.person_max}/${row.credit}`
                              )
                              if (data.error) alert(data.message)
                              else if (data.success) {
                                alert(data.message)
                                courseSearch()
                              }
                            }}
                          >
                            신청
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            onClick={async () => {
                              const { data } = await axios.get(
                                `/api/register/desired/${session.user.email}/${row.course_id}/${row.class_id}`
                              )
                              if (data.error) alert(data.message)
                              else if (data.success) alert(data.message)
                            }}
                          >
                            희망
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    해당 과목 없음
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

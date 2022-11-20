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
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import stateChange from "../utils/stateChange"
import Router from "next/router"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

export default function ChangeStudentInfo() {
  const [studentData, setStudentData] = useState([])
  const [studentName, setStudentName] = useState("")
  const [grade, setGrade] = useState("")
  const [studentState, setStudentState] = useState("")
  const [studentId, setStudentId] = useState("")
  const [open, setOpen] = useState(false)
  const [changeStudentState, setChangeStudentState] = useState([])
  const [selectStudentState, setSelectStudentState] = useState("")
  const { data: session, status } = useSession()

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  }

  const courseSearch = async () => {
    // 수업번호, 학수번호는 완전 일치 검색 교과목명은 키워드 포함 검색
    const { data } = await axios.get(
      `/api/student/getInfo/1=1${
        studentState != "" ? `/state='${studentState}'` : ""
      }${grade != "" ? `/year='${grade}'` : ""}${
        studentName != ""
          ? `/s.name like '${encodeURI("%")}${studentName}${encodeURI("%")}'`
          : ""
      }${studentId != "" ? `/student_id='${studentId}'` : ""}`
    )
    setStudentData(data.rows)
  }

  useEffect(() => {
    if (status == "authenticated" && session.user.image != "admin") {
      alert("권한이 없습니다.")
      Router.push("/")
    } else if (status == "authenticated" && session.user.image == "admin") {
      courseSearch()
    }
  }, [session, status])

  return (
    <>
      <Header />
      <Typography sx={{ ml: 3, mt: 1, mb: 2 }} variant="h5" gutterBottom>
        · 학생 조회 및 변경
      </Typography>
      <Paper elevation={1} sx={{ ml: 3, mr: 3 }}>
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="이름"
          value={studentName}
          variant="standard"
          onChange={(e) => setStudentName(e.target.value)}
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
          label="학번"
          value={studentId}
          variant="standard"
          onChange={(e) => setStudentId(e.target.value)}
        />
        <FormControl
          variant="standard"
          sx={{ ml: 3, mb: 2, mt: 0.5, minWidth: 160 }}
        >
          <InputLabel>학적상태</InputLabel>
          <Select
            value={studentState}
            label="학적상태"
            onChange={(e) => setStudentState(e.target.value)}
          >
            <MenuItem value={"in"}>재학</MenuItem>
            <MenuItem value={"recess"}>휴학</MenuItem>
            <MenuItem value={"out"}>자퇴</MenuItem>
          </Select>
        </FormControl>
        <Button
          sx={{ ml: 3, mt: 2, mb: 1 }}
          variant="outlined"
          onClick={() => {
            setStudentData([])
            setStudentName("")
            setGrade("")
            setStudentState("")
            setStudentId("")
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
                <TableCell>학번</TableCell>
                <TableCell align="center">학년</TableCell>
                <TableCell align="center">이름</TableCell>
                <TableCell align="center">전공</TableCell>
                <TableCell align="center">지도교수</TableCell>
                <TableCell align="center">학적상태</TableCell>
                {/* 로그인 안 했을 경우 수강신청 버튼 없고 관리자만 하단 정보 조회할 수 있다. */}
                {status === "authenticated" &&
                session.user.image === "admin" ? (
                  <>
                    <TableCell align="center">학적</TableCell>
                    <TableCell align="center">금학기 시간표</TableCell>
                    <TableCell align="center">성적</TableCell>
                  </>
                ) : (
                  <></>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {studentData.length != 0 ? (
                studentData.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.student_id}
                    </TableCell>
                    <TableCell align="center">{row.year}</TableCell>
                    <TableCell align="center">{row.student_name}</TableCell>
                    <TableCell align="center">{row.major}</TableCell>
                    <TableCell align="center">{row.lecturer}</TableCell>
                    <TableCell align="center">
                      {stateChange(row.state)}
                    </TableCell>
                    {status === "authenticated" &&
                    session.user.image === "admin" ? (
                      <>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => {
                              setOpen(true)
                              setChangeStudentState([
                                row.student_name,
                                row.student_id,
                                row.state,
                              ])
                            }}
                          >
                            변경
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            onClick={() => {
                              Router.push(
                                `/studentDetail/schedule/${row.student_id}/${row.student_name}`
                              )
                            }}
                          >
                            조회
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            onClick={() => {
                              Router.push(
                                `/studentDetail/score/${row.student_id}/${row.student_name}`
                              )
                            }}
                          >
                            조회
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
                  <TableCell colSpan={9} align="center">
                    해당 학생 없음
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal
          open={open}
          onClose={() => {
            setOpen(false)
            setChangeStudentState([])
          }}
        >
          <Box sx={style}>
            <Typography variant="h6" component="h2">
              {changeStudentState[0]} 학적 변경
            </Typography>

            <FormControl
              variant="standard"
              sx={{ ml: 3, mb: 2, mt: 0.5, minWidth: 160 }}
            >
              <InputLabel>학적상태</InputLabel>
              <Select
                value={selectStudentState}
                label="학적상태"
                onChange={(e) => setSelectStudentState(e.target.value)}
              >
                <MenuItem value={"in"}>재학</MenuItem>
                <MenuItem value={"recess"}>휴학</MenuItem>
                <MenuItem value={"out"}>자퇴</MenuItem>
              </Select>
            </FormControl>

            <Container>
              <Button
                variant="outlined"
                onClick={async () => {
                  const { data } = await axios.get(
                    `/api/student/changeStudentState/${changeStudentState[1]}/${selectStudentState}`
                  )
                  if (data.success) {
                    alert(data.message)
                    setOpen(false)
                    setChangeStudentState([])
                    courseSearch()
                  }
                }}
              >
                변경
              </Button>
              <Button
                variant="outlined"
                sx={{ ml: 1 }}
                color="error"
                onClick={() => {
                  setOpen(false)
                  setChangeStudentState([])
                }}
              >
                취소
              </Button>
            </Container>
          </Box>
        </Modal>
      </Paper>
    </>
  )
}

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
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"

export default function AddressForm() {
  const [classData, setClassData] = useState([])
  const [classNum, setClassNum] = useState("")
  const [grade, setGrade] = useState("")
  const [className, setClassName] = useState("")
  const [courseId, setCourseId] = useState("")
  const [maxEnroll, setMaxEnroll] = useState("")
  const { data: session, status } = useSession()
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)
  const [enrollModalTransfer, setEnrollModalTransfer] = useState([])
  const [manualModalOpen, setManulModalOpen] = useState(false)
  const [manualModalTransfer, setManualModalTransfer] = useState([])
  const [manualStudentId, setManualStudentId] = useState("")

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
      `/api/catalog/opened=2022${
        classNum != "" ? `/class_id='${classNum}'` : ""
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
        · 과목 조회 및 변경
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
                <TableCell align="center">신청인원</TableCell>
                <TableCell align="center">수강정원</TableCell>
                <TableCell align="center">강의실 수용인원</TableCell>
                <TableCell align="center">강의실(건물+호수)</TableCell>
                {/* 로그인 안 했을 경우 수강신청 버튼 없고 관리자도 수강신청을 할 수 없다 */}
                {status === "authenticated" &&
                session.user.image === "admin" ? (
                  <>
                    <TableCell align="center">수강정원</TableCell>
                    <TableCell align="center">수강허용</TableCell>
                    <TableCell align="center">관리</TableCell>
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
                    <TableCell align="center">{row.enrolled}</TableCell>
                    <TableCell align="center">{row.person_max}</TableCell>
                    <TableCell align="center">{row.occupancy}</TableCell>
                    <TableCell align="center">{`${row.building_name} ${row.room_id}호`}</TableCell>
                    {status === "authenticated" &&
                    session.user.image === "admin" ? (
                      <>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setEnrollModalOpen(true)
                              setEnrollModalTransfer([
                                row.class_id,
                                row.occupancy,
                              ])
                            }}
                          >
                            증원
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            onClick={async () => {
                              setManulModalOpen(true)
                              setManualModalTransfer([
                                row.course_id,
                                row.class_id,
                                row.credit,
                              ])
                            }}
                          >
                            추가
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="error"
                            onClick={async () => {
                              const { data } = await axios.get(
                                `/api/register/removeClass/${row.class_id}/${row.course_id}`
                              )
                              if (data.success) {
                                courseSearch()
                                alert(data.message)
                              }
                            }}
                          >
                            폐강
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

        <Modal
          open={enrollModalOpen}
          onClose={() => {
            setEnrollModalOpen(false)
            setEnrollModalTransfer([])
          }}
        >
          <Box sx={style}>
            <Container>
              <Typography variant="h6" component="h2">
                수강정원 증원
              </Typography>
              <Typography variant="h7">
                강의실 수용인원: {enrollModalTransfer[1]}
              </Typography>
            </Container>

            <TextField
              variant="standard"
              fullWidth
              value={maxEnroll}
              label="강의실 수용인원보다 작아야함"
              onChange={(e) => setMaxEnroll(e.target.value)}
              sx={{ mb: 1 }}
            />

            <Container>
              <Button
                variant="outlined"
                onClick={async () => {
                  if (maxEnroll <= enrollModalTransfer[1]) {
                    const { data } = await axios.get(
                      `/api/student/changeMaxEnroll/${enrollModalTransfer[0]}/${enrollModalTransfer[1]}/${maxEnroll}`
                    )
                    if (data.success) {
                      alert(data.message)
                      setEnrollModalOpen(false)
                      setEnrollModalTransfer([])
                      courseSearch()
                      setMaxEnroll("")
                    } else if (data.error) {
                      alert(data.message)
                    }
                  } else {
                    alert("수강정원이 강의실 수용인원보다 많습니다.")
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
                  setEnrollModalOpen(false)
                  setEnrollModalTransfer([])
                  setMaxEnroll("")
                }}
              >
                취소
              </Button>
            </Container>
          </Box>
        </Modal>
        <Modal
          open={manualModalOpen}
          onClose={() => {
            setManulModalOpen(false)
            setManualModalTransfer([])
          }}
        >
          <Box sx={style}>
            <Container>
              <Typography variant="h6" component="h2">
                수강허용 반영
              </Typography>
            </Container>

            <TextField
              variant="standard"
              fullWidth
              value={manualStudentId}
              label="수강 허용할 학생의 학번 입력"
              onChange={(e) => setManualStudentId(e.target.value)}
              sx={{ mb: 1 }}
            />

            <Container>
              <Button
                variant="outlined"
                onClick={async () => {
                  const { data } = await axios.get(
                    `/api/student/addStudentEnroll/${manualModalTransfer[0]}/${manualModalTransfer[1]}/${manualStudentId}/${manualModalTransfer[2]}`
                  )
                  if (data.success) {
                    alert(data.message)
                    setManulModalOpen(false)
                    setManualModalTransfer([])
                    courseSearch()
                    setManualStudentId("")
                  } else if (data.error) {
                    alert(data.message)
                  }
                }}
              >
                추가
              </Button>
              <Button
                variant="outlined"
                sx={{ ml: 1 }}
                color="error"
                onClick={() => {
                  setManulModalOpen(false)
                  setManualModalTransfer([])
                  setManualStudentId("")
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

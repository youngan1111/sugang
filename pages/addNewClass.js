import TextField from "@mui/material/TextField"
import Header from "../components/Header"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import { useRouter } from "next/router"

export default function AddNewClass() {
  const [courseData, setCourseData] = useState([])
  const [professorData, setProfessorData] = useState([])
  const [roomData, setRoomData] = useState([])
  const [majorData, setMajorData] = useState([])
  const [majorId, setMajorId] = useState("")
  const [roomId, setRoomId] = useState("")
  const [professorId, setProfessorId] = useState("")
  const [classId, setClassId] = useState("")
  const [grade, setGrade] = useState("") // 학년
  const [credit, setCredit] = useState("") // 학점
  const [personMax, setPersonMax] = useState("") // 학점
  const [openYear, setOpenYear] = useState("")
  const [courseId, setCourseId] = useState("")
  const [courseName, setCourseName] = useState("")
  const [occupancy, setOccupancy] = useState("")
  const [firstDay, setFirstDay] = useState("")
  const [firstStartTime, setFirstStartTime] = useState("")
  const [firstEndTime, setFirstEndTime] = useState("")
  const [secondDay, setSecondDay] = useState("")
  const [secondStartTime, setSecondStartTime] = useState("")
  const [secondEndTime, setSecondEndTime] = useState("")
  const { data: session, status } = useSession()

  const router = useRouter()

  const initialSearch = async () => {
    const { data } = await axios.get(`/api/course/getInfo/1=1`)
    setCourseData(data.rows)

    let response = await axios.get(`/api/course/getProfessorInfo/1=1`)
    setProfessorData(response.data.rows)

    response = await axios.get(`/api/course/getRoomInfo/1=1`)
    setRoomData(response.data.rows)

    response = await axios.get(`/api/course/getMajorInfo/1=1`)
    setMajorData(response.data.rows)
  }

  useEffect(() => {
    if (status == "authenticated" && session.user.image != "admin") {
      alert("권한이 없습니다.")
      Router.push("/")
    } else if (status == "authenticated" && session.user.image == "admin") {
      initialSearch()
    }
  }, [status, session])

  return (
    <>
      <Header />
      <Typography sx={{ ml: 3, mt: 1, mb: 2 }} variant="h5" gutterBottom>
        · 수업 개설
      </Typography>
      <Paper elevation={1} sx={{ ml: 3, mr: 3 }}>
        <FormControl
          variant="standard"
          sx={{ ml: 3, mb: 2, mt: 0.5, minWidth: 160 }}
        >
          <InputLabel>과목선택</InputLabel>
          <Select
            value={courseId}
            label="학수번호"
            onChange={(e) => {
              courseData.map((ele) => {
                ele.course_id == e.target.value ? setCourseName(ele.name) : ""
              })
              setCourseId(e.target.value)
            }}
          >
            {courseData.map((ele) => (
              <MenuItem key={ele.course_id} value={ele.course_id}>
                {`${ele.name} (${ele.credit}학점)`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="수업번호(중복불가)"
          value={classId}
          variant="standard"
          onChange={(e) => setClassId(e.target.value)}
        />
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="개강연도"
          value={openYear}
          variant="standard"
          onChange={(e) => setOpenYear(e.target.value)}
        />
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="학년"
          value={grade}
          variant="standard"
          onChange={(e) => setGrade(e.target.value)}
        />
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5, width: 300 }}
          label="과목 선택과 동일한 학점을 입력하세요"
          value={credit}
          variant="standard"
          onChange={(e) => setCredit(e.target.value)}
        />
        <FormControl
          variant="standard"
          sx={{ ml: 3, mb: 2, mt: 0.5, minWidth: 160 }}
        >
          <InputLabel>설강학과</InputLabel>
          <Select value={majorId} onChange={(e) => setMajorId(e.target.value)}>
            {majorData.map((ele) => (
              <MenuItem key={ele.major_id} value={ele.major_id}>
                {ele.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ ml: 3, mb: 2, mt: 0.5, minWidth: 160 }}
        >
          <InputLabel>교강사 선택</InputLabel>
          <Select
            value={professorId}
            onChange={(e) => setProfessorId(e.target.value)}
          >
            {professorData.map((ele) => (
              <MenuItem key={ele.lecturer_id} value={ele.lecturer_id}>
                {ele.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ ml: 3, mb: 2, mt: 0.5, minWidth: 160 }}
        >
          <InputLabel>강의실 선택</InputLabel>
          <Select
            value={roomId}
            onChange={(e) => {
              roomData.map((ele) =>
                ele.room_id == e.target.value ? setOccupancy(ele.occupancy) : ""
              )
              setRoomId(e.target.value)
            }}
          >
            {roomData.map((ele) => (
              <MenuItem key={ele.room_id} value={ele.room_id}>
                {`${ele.name} ${ele.room_id}호 ${ele.occupancy}명`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="수강정원"
          value={personMax}
          variant="standard"
          onChange={(e) => setPersonMax(e.target.value)}
        />

        <Typography sx={{ ml: 3, mt: 3 }}>
          - 토요일과 평일 강의 시작시간이 18시 포함 이후 수업인 경우 E-러닝
          강의로 분류됩니다.(종료시간이 넘는 경우는 괜찮습니다.)
        </Typography>
        <Typography sx={{ ml: 3, mt: 1 }}>첫번째 수업시간(필수)</Typography>
        <FormControl
          variant="standard"
          sx={{ ml: 3, mb: 2, mt: 0.5, minWidth: 160 }}
        >
          <InputLabel>요일</InputLabel>
          <Select
            value={firstDay}
            onChange={(e) => setFirstDay(e.target.value)}
          >
            <MenuItem value={1}>월</MenuItem>
            <MenuItem value={2}>화</MenuItem>
            <MenuItem value={3}>수</MenuItem>
            <MenuItem value={4}>목</MenuItem>
            <MenuItem value={5}>금</MenuItem>
            <MenuItem value={6}>토</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5, width: 150 }}
          type="time"
          onChange={(e) => setFirstStartTime(e.target.value)}
        />
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5, width: 150 }}
          type="time"
          onChange={(e) => setFirstEndTime(e.target.value)}
        />
        <Typography sx={{ ml: 3, mt: 1 }}>두번째 수업시간(선택)</Typography>
        <FormControl
          variant="standard"
          sx={{ ml: 3, mb: 2, mt: 0.5, minWidth: 160 }}
        >
          <InputLabel>요일</InputLabel>
          <Select
            value={secondDay}
            onChange={(e) => setSecondDay(e.target.value)}
          >
            <MenuItem value={1}>월</MenuItem>
            <MenuItem value={2}>화</MenuItem>
            <MenuItem value={3}>수</MenuItem>
            <MenuItem value={4}>목</MenuItem>
            <MenuItem value={5}>금</MenuItem>
            <MenuItem value={6}>토</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5, width: 150 }}
          type="time"
          onChange={(e) => setSecondStartTime(e.target.value)}
        />
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5, width: 150 }}
          type="time"
          onChange={(e) => setSecondEndTime(e.target.value)}
        />

        <Button
          sx={{ ml: 2, mt: 2, mb: 1 }}
          variant="contained"
          onClick={async () => {
            console.log(firstDay, firstStartTime, firstEndTime)
            if (
              classId != "" &&
              courseId != "" &&
              courseName != "" &&
              majorId != "" &&
              grade != "" &&
              credit != "" &&
              professorId != "" &&
              personMax != "" &&
              openYear != "" &&
              roomId != "" &&
              occupancy != "" &&
              firstStartTime != "" &&
              firstEndTime != "" &&
              firstDay != ""
            ) {
              if (occupancy < personMax) {
                alert("정원이 강의실 허용인원보다 많습니다.")
              } else {
                if (
                  firstStartTime.split(":")[0] < firstEndTime.split(":")[0] ||
                  (firstStartTime.split(":")[0] == firstEndTime.split(":")[0] &&
                    firstStartTime.split(":")[1] < firstEndTime.split(":")[1])
                ) {
                  // 1900-01-03T05:30:00.000Z 이런 형식으로 시간 만들어 주기
                  let firstBegin, firstEnd, secondBegin, secondEnd
                  if (firstStartTime.split(":")[0] >= 18) {
                    firstBegin = firstEnd = "NO"
                  } else {
                    let a = new Date(
                      `1900-01-0${firstDay}T${firstStartTime}:00.000Z`
                    )
                    a.setHours(a.getHours() - 9)
                    firstBegin = `1900-01-0${firstDay}T${
                      a.toISOString().split("T")[1]
                    }`

                    a = new Date(`1900-01-0${firstDay}T${firstEndTime}:00.000Z`)
                    a.setHours(a.getHours() - 9)
                    firstEnd = `1900-01-0${firstDay}T${
                      a.toISOString().split("T")[1]
                    }`
                  }

                  if (
                    secondDay != "" ||
                    secondStartTime != "" ||
                    secondEndTime != ""
                  ) {
                    if (
                      secondDay != "" &&
                      secondStartTime != "" &&
                      secondEndTime != ""
                    ) {
                      if (
                        secondStartTime.split(":")[0] <
                          secondEndTime.split(":")[0] ||
                        (secondStartTime.split(":")[0] ==
                          secondEndTime.split(":")[0] &&
                          secondStartTime.split(":")[1] <
                            secondEndTime.split(":")[1])
                      ) {
                        // 이곳은 두번째 수업도 있는 곳 종료시간이 시작시간보다 뒤에있어야한다.
                        // 1900-01-03T05:30:00.000Z 이런 형식으로 시간 만들어 주기
                        if (secondStartTime.split(":")[0] >= 18) {
                          secondBegin = secondEnd = "NO"
                        } else {
                          let b = new Date(
                            `1900-01-0${secondDay}T${secondStartTime}:00.000Z`
                          )
                          b.setHours(b.getHours() - 9)
                          secondBegin = `1900-01-0${secondDay}T${
                            b.toISOString().split("T")[1]
                          }`

                          b = new Date(
                            `1900-01-0${secondDay}T${secondEndTime}:00.000Z`
                          )
                          b.setHours(b.getHours() - 9)
                          secondEnd = `1900-01-0${secondDay}T${
                            b.toISOString().split("T")[1]
                          }`
                        }

                        const { data } = await axios.get(
                          `/api/course/addNewClass/${classId}/${courseId}/${courseName}/${majorId}/${grade}/${credit}/${professorId}/${personMax}/${openYear}/${roomId}/1/${firstBegin}/${firstEnd}/${secondBegin}/${secondEnd}`
                        )
                        if (data.success) {
                          alert(data.message)
                          router.reload(window.location.pathname)
                        } else if (data.error) {
                          alert(data.message)
                        }
                      } else {
                        alert(
                          "두번째 수업의 종료시간은 시작시간보다 나중이여야합니다."
                        )
                      }
                    } else {
                      alert("두번째 수업의 모든 정보를 입력해주세요.")
                    }
                  } else {
                    // 두번째 수업 없는 경우
                    const { data } = await axios.get(
                      `/api/course/addNewClass/${classId}/${courseId}/${courseName}/${majorId}/${grade}/${credit}/${professorId}/${personMax}/${openYear}/${roomId}/0/${firstBegin}/${firstEnd}`
                    )
                    if (data.success) {
                      alert(data.message)
                      router.reload(window.location.pathname)
                    } else if (data.error) {
                      alert(data.message)
                    }
                  }
                } else {
                  alert("첫번째 수업 종료시간은 시작시간보다 나중이여야합니다.")
                }
              }
            } else {
              alert("모든 정보를 입력해주세요.")
            }
          }}
        >
          설강
        </Button>
      </Paper>
    </>
  )
}

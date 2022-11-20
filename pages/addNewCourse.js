import TextField from "@mui/material/TextField"
import Header from "../components/Header"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"

export default function AddNewClass() {
  const [credit, setCredit] = useState("")
  const [courseName, setCourseName] = useState("")
  const [courseId, setCourseId] = useState("")
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status == "authenticated" && session.user.image != "admin") {
      alert("권한이 없습니다.")
      Router.push("/")
    }
  }, [status, session])

  return (
    <>
      <Header />
      <Typography sx={{ ml: 3, mt: 1, mb: 2 }} variant="h5" gutterBottom>
        · 과목 생성
      </Typography>
      <Paper elevation={1} sx={{ ml: 3, mr: 3 }}>
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="학수번호 ex)ITE2038"
          value={courseId}
          variant="standard"
          onChange={(e) => setCourseId(e.target.value)}
        />
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="교과목명"
          value={courseName}
          variant="standard"
          onChange={(e) => setCourseName(e.target.value)}
        />
        <TextField
          sx={{ ml: 3, mb: 2, mt: 0.5 }}
          label="학점"
          value={credit}
          variant="standard"
          onChange={(e) => setCredit(e.target.value)}
        />
        <Button
          sx={{ ml: 2, mt: 2, mb: 1 }}
          variant="contained"
          onClick={async () => {
            if (courseId !== "" && courseName !== "" && credit !== "") {
              const { data } = await axios.get(
                `/api/course/addNewCourse/${courseId}/${courseName}/${credit}`
              )
              if (data.success) {
                alert(data.message)
                setCredit("")
                setCourseId("")
                setCourseName("")
              } else if (data.error) {
                alert(data.message)
              }
            } else {
              alert("모든 부분을 입력해주세요.")
            }
          }}
        >
          생성
        </Button>
      </Paper>
    </>
  )
}

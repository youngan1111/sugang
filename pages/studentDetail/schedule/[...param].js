import Header from "../../../components/Header"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import axios from "axios"
import timestamp2day from "../../../utils/timestamp2day"
import { useRouter } from "next/router"

const ComponentsWithNoSSR = dynamic(
  () => import("../../../components/Timetable"),
  {
    ssr: false,
  }
)

export default function StudentSchedule() {
  const [myCurrentList, setMyCurrentList] = useState({})
  const [timeFreeClass, setTimeFreeClass] = useState([])
  const [numberOfCourse, setNumberOfCourse] = useState(0)
  const [sumOfCredits, setSumOfCredits] = useState(0)
  const { data: session, status } = useSession()

  const router = useRouter()
  const [student_id, student_name] = router.query.param

  let events = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    thursday: [],
    saturday: [],
    sunday: [],
  }
  let temp = []

  const fetchData = async () => {
    const { data } = await axios.get(
      `/api/register/myCurrentList/student_id=${student_id}`
    )

    setNumberOfCourse(data.rows.length)
    let sum = 0
    data.rows.map((e) => {
      sum += Number(e.credit)
    })
    setSumOfCredits(sum)

    for (const value of data.rows) {
      if (value.begin1 != "NO") {
        events[timestamp2day(value.begin1)].push({
          id: value.class_id,
          name: value.course_name + " " + value.lecturer_name,
          type: "custom",
          startTime: new Date(value.begin1.replace("1900", "2022")),
          endTime: new Date(value.end1.replace("1900", "2022")),
        })
        if (value.begin2 != null) {
          events[timestamp2day(value.begin2)].push({
            id: value.class_id,
            name: value.course_name + " " + value.lecturer_name,
            type: "custom",
            startTime: new Date(value.begin2.replace("1900", "2022")),
            endTime: new Date(value.end2.replace("1900", "2022")),
          })
        }
      } else temp.push(value.course_name + " " + value.lecturer_name)
    }
    setTimeFreeClass(temp)
    setMyCurrentList(events)
  }

  useEffect(() => {
    if (status == "authenticated") fetchData()
  }, [status])

  return (
    <>
      <Header />
      <Typography sx={{ ml: 3, mt: 1, mb: 2 }} variant="h5" gutterBottom>
        · {student_name} 시간표
      </Typography>
      <Typography sx={{ ml: 3 }} variant="subtitle2">
        금학기 신청내역: {numberOfCourse}과목 / {sumOfCredits}학점
      </Typography>

      <Paper elevation={1} sx={{ m: 3 }}>
        <ComponentsWithNoSSR events={myCurrentList} />
      </Paper>

      <Paper elevation={1} sx={{ m: 3, mt: -2 }}>
        {timeFreeClass.map((ele, index) => (
          <Typography key={index}>{ele}</Typography>
        ))}
      </Paper>
    </>
  )
}

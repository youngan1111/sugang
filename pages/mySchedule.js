import Header from "../components/Header"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import axios from "axios"
import timestamp2day from "../utils/timestamp2day"

const ComponentsWithNoSSR = dynamic(() => import("../components/Timetable"), {
  ssr: false,
})

export default function MySchedule() {
  const [myCurrentList, setMyCurrentList] = useState({})
  const [timeFreeClass, setTimeFreeClass] = useState([])
  const { data: session, status } = useSession()

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
      `/api/register/myCurrentList/student_id=${session.user.email}`
    )

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
        · 내 시간표
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

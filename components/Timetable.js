import * as React from "react"
import Timetable from "react-timetable-events"

export default function timetable({ events }) {
  return <Timetable events={events} style={{ height: "500px" }} />
}

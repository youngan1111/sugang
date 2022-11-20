import Header from "../components/Header"
import Paper from "@mui/material/Paper"
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
import Router from "next/router"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

export default function ChangeStudentInfo() {
  const [statsData, setStatsData] = useState([])
  const [statsDataAsc, setStatsDataAsc] = useState([])
  const [statsDataDiff, setStatsDataDiff] = useState([])
  const [statsDataDiffAsc, setStatsDataDiffAsc] = useState([])
  const { data: session, status } = useSession()

  const statisticSearch = async () => {
    const { data } = await axios.get(`/api/course/getStats/1=1`)
    setStatsData(data.rows)

    const response = await axios.get(`/api/course/getStatsAsc/1=1`)
    setStatsDataAsc(response.data.rows)

    const res = await axios.get(`/api/course/getStatsDiff/1=1`)
    setStatsDataDiff(res.data.rows)

    const respo = await axios.get(`/api/course/getStatsDiffAsc/1=1`)
    setStatsDataDiffAsc(respo.data.rows)
  }

  useEffect(() => {
    if (status == "authenticated" && session.user.image != "admin") {
      alert("권한이 없습니다.")
      Router.push("/")
    } else if (status == "authenticated" && session.user.image == "admin") {
      statisticSearch()
    }
  }, [session, status])

  return (
    <>
      <Header />
      <Typography sx={{ ml: 3, mt: 1, mb: 2 }} variant="h5" gutterBottom>
        · 통계
      </Typography>

      <Paper elevation={1} sx={{ m: 3 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>평점 평균이 가장 높은 강의 TOP 10</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>학수번호</TableCell>
                    <TableCell align="center">교과목명</TableCell>
                    <TableCell align="center">학점</TableCell>
                    <TableCell align="center">총 수강생</TableCell>
                    <TableCell align="center">수강생 점수</TableCell>
                    <TableCell align="center">평점평균</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statsData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.course_id}
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.credit}</TableCell>
                      <TableCell align="center">{row.count}</TableCell>
                      <TableCell align="center">
                        {row.grades.join("+")} = {row.avg_grade * row.count}
                      </TableCell>
                      <TableCell align="center">{row.avg_grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>평점 평균이 가장 낮은 강의 TOP 10</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>학수번호</TableCell>
                    <TableCell align="center">교과목명</TableCell>
                    <TableCell align="center">학점</TableCell>
                    <TableCell align="center">총 수강생</TableCell>
                    <TableCell align="center">수강생 점수</TableCell>
                    <TableCell align="center">평점평균</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statsDataAsc.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.course_id}
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.credit}</TableCell>
                      <TableCell align="center">{row.count}</TableCell>
                      <TableCell align="center">
                        {row.grades.join("+")} = {row.avg_grade * row.count}
                      </TableCell>
                      <TableCell align="center">{row.avg_grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              평점 평균과 특정 과목의 학점 간 차이(평점평균-과목학점)가 가장 큰
              Top10
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>학수번호</TableCell>
                    <TableCell align="center">교과목명</TableCell>
                    <TableCell align="center">총 수강생</TableCell>
                    <TableCell align="center">수강생 점수</TableCell>
                    <TableCell align="center">평점평균</TableCell>
                    <TableCell align="center">학점</TableCell>
                    <TableCell align="center">평점평균 - 학점</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statsDataDiff.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.course_id}
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.count}</TableCell>
                      <TableCell align="center">
                        {row.grades.join("+")} = {row.avg_grade * row.count}
                      </TableCell>
                      <TableCell align="center">{row.avg_grade}</TableCell>
                      <TableCell align="center">{row.credit}</TableCell>
                      <TableCell align="center">
                        {row.avg_grade - row.credit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              평점 평균과 특정 과목의 학점 간 차이(평점평균-과목학점)가 가장
              작은 Top10
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>학수번호</TableCell>
                    <TableCell align="center">교과목명</TableCell>
                    <TableCell align="center">총 수강생</TableCell>
                    <TableCell align="center">수강생 점수</TableCell>
                    <TableCell align="center">평점평균</TableCell>
                    <TableCell align="center">학점</TableCell>
                    <TableCell align="center">평점평균 - 학점</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statsDataDiffAsc.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.course_id}
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.count}</TableCell>
                      <TableCell align="center">
                        {row.grades.join("+")} = {row.avg_grade * row.count}
                      </TableCell>
                      <TableCell align="center">{row.avg_grade}</TableCell>
                      <TableCell align="center">{row.credit}</TableCell>
                      <TableCell align="center">
                        {row.avg_grade - row.credit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </>
  )
}

//import dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";

// import components
import DayList from "./DayList";
import Appointment from "components/Appointment/index";

//import css to the file
import "components/Application.scss";

//import helper functions
import { getAppointmentsForDay, getInterview } from "helpers/selectors";

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm"
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Jingu Kang",
//       interviewer: {
//         id: 3,
//         name: "Mildred Nazir",
//         avatar: "https://i.imgur.com/T2WwVfS.png"
//       }
//     }
//   },
//   {
//     id: 5,
//     time: "4pm",
//     interview: {
//       student: "Francis Bourgouin",
//       interviewer: {
//         id: 5,
//         name: "Sven Jones",
//         avatar: "https://i.imgur.com/twYrpay.jpg"
//       }
//     }
//   }
// ];

export default function Application(props) {
  const [state, setState] = useState({
    day:"Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const setDay = (day) => setState({ ...state, day});

  useEffect(() => {
    const daysURL = "http://localhost:8001/api/days";
    const appointmentsURL = "http://localhost:8001/api/appointments";
    const interviewersURL = "http://localhost:8001/api/interviewers";

    Promise.all([
      axios.get(daysURL),
      axios.get(appointmentsURL),
      axios.get(interviewersURL)
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviews: all[2].data}));
    });

  }, []);

  const parsedAppointment = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return(
    <Appointment 
      key={appointment.id} 
      id={appointment.id}
      time={appointment.time} 
      interview={interview} 
    />);
  });
  return (
    <main className="layout">
      <section className="sidebar">
        <img className="sidebar--centered" src="images/logo.png" alt="Interview Scheduler"/>
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu"><DayList days={state.days} day={state.day} setDay={setDay} /></nav>
        <img className="sidebar__lhl sidebar--centered" src="images/lhl.png" alt="Lighthouse Labs"/>
      </section>
      <section className="schedule">
        {parsedAppointment}
        <Appointment key="last" time="5pm" />
      </section>
    </main>

    
  );
}

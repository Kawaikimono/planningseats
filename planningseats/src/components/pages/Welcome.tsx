import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";

const Welcome = () => {

  const redirect = useNavigate();

    const handleNewEvent = () => {
        fetch('/api/events', {method:"POST"}).then((data)=>{
            return data.json()
        }).then((data)=>{
          return redirect(`/seatplanning/${data.event_id}`)
        })
    }

    let [event, setEvent] = useState("")
    

  return (
    <div className="centerWelcome center">
      <br />
      <h2>
        Thank you for using Planning Seats for all your event planning needs!
      </h2>
      <br />
      <br />
      <div className="boxWelcome">
        <h4>
          If you already have a seatting chart, please enter your event id
          here:
        </h4>
        <br />
        <form action={`/${event}`}>
        <input type="text" name="eventId" onChange={(e) => setEvent(e.target.value)}></input>
        <button className="btnWelcome btns" type="submit">Find my Event</button>
        </form>
        <br />
        <br />
        <br />
        <h4>
          If this is your first time here, on the next page please provide the
          number of tables you need created and have a CSV file of your guests
          names ready!
        </h4>
        <br />
          <button className="btns" onClick={handleNewEvent}>Start Planning!</button>
        <Link to="/seatplanning">
        </Link>
      </div>
    </div>
  );
};

export default Welcome;

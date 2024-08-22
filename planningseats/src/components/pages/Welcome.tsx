import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Welcome = () => {
  const redirect = useNavigate();

  const handleNewEvent = () => {
    fetch("/api/events", { method: "POST" })
      .then((data) => {
        if (data.status >= 500) {
          setErrorMsg(`I'm really sorry, something went wrong`);
          throw {};
        }
        return data.json();
      })
      .then((data) => {
        return redirect(`/seatplanning/${data.event_id}`);
      })
      .catch(() => {});
  };

  let [event, setEvent] = useState("");
  let [errMsg, setErrorMsg] = useState("");

  const findEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(+event)) {
      setErrorMsg("Please provide a numeric Event ID");
      return;
    }

    fetch(`/api/events/${event}`).then((resp) => {
      if (resp.status == 404) {
        setErrorMsg(`We have no record for event id ${event}`);
      } else if (resp.status >= 500) {
        setErrorMsg(`I'm really sorry, something went wrong`);
      } else {
        return redirect(`/${event}`);
      }
    });
  };

  return (
    <div className="centerWelcome center">
      <br />
      <h2>
        Thank you for using Planning Seats for all your event planning needs!
      </h2>
      <br />
      <div className="boxWelcome">
        <h4>
          If you already have a seatting chart, please enter your event id here:
        </h4>

        {errMsg != "" ? (
          <>
            <br />
            <p className="errorpretty">Apologies...<span className="error">{errMsg}</span></p>
          </>
        ) : (
          <></>
        )}

        <form onSubmit={findEvent}>
          <br />
          <input
            type="text"
            name="eventId"
            onChange={(e) => {
              setEvent(e.target.value)
            }}
          ></input>
          <button className="btnWelcome btns" type="submit">
            Find my Event
          </button>
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
        <button className="btns" onClick={handleNewEvent}>
          Start Planning!
        </button>
        <Link to="/seatplanning"></Link>
      </div>
    </div>
  );
};

export default Welcome;

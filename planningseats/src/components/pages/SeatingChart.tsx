import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const SeatingChart = () => {
  const redirect = useNavigate();
  const {id} = useParams();
  let [errMsg, setErrorMsg] = useState("");
  const onTableCreate = (e: any) =>{
    e.preventDefault()
    const numTables = parseInt(e.target.table.value)
    if (Number.isNaN(numTables)){
      setErrorMsg("Please provide a numeric number of tables");
      return
    }
    else if (Number.isFinite(+numTables)){
      setErrorMsg("Please make sure your input is a positive whole number");
      return
    }
    fetch(`/api/events/${id}/tables`, {
      method:"POST",
      headers: {
        Accept: 'application.json',
        'Content-Type': "application/json"
      },
      body: JSON.stringify({"number_of_tables": numTables
    })
  }).then((data)=>{
      return data.json()
  }).then((_)=>{
      redirect(`/${id}`)
  })
  }
  return (
    <div className="center">
      <h2></h2>
      <br />
      <form id="form" onSubmit={onTableCreate}  className="boxWelcome">
        <h3>How many tables?</h3>
        <br />
        {errMsg != "" ? (
          <>
            <p className="errorpretty">Apologies...<span className="error">{errMsg}</span></p>
            <br />
            <br />
          </>
        ) : (
          <></>
        )}
        <input required type="text" id="tables" name="table"/> <br /> <br />
          <input
            type="submit"
            className="btns"
            id="subseat"
            value="Let's get started"
          />
      </form>
    </div>
  );
};

export default SeatingChart;

import { useNavigate, useParams } from "react-router-dom";

const SeatingChart = () => {
  const redirect = useNavigate();
  const {id} = useParams();
  const onTableCreate = (e: any) =>{
    e.preventDefault()
    const numTables = parseInt(e.target.table.value)
    if (Number.isNaN(numTables)){
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

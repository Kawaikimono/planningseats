import { useParams } from "react-router-dom";
import { Name }from "../../model"

interface Props {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  namesList: Name[][];
  setNamesList: React.Dispatch<React.SetStateAction<Name[][]>>
}
const SeatTables = ({name, setName, namesList, setNamesList}: Props)=>{

const {id} = useParams();

const handleAdd = (e:any) =>{
  e.preventDefault()
  const guestName = e.target.guestName.value
  fetch(`/api/events/${id}/guests`, {
    method:"POST",
    headers: {
      Accept: 'application.json',
      'Content-Type': "application/json"
    },
    body: JSON.stringify({
      "guest_name": guestName
  })
}).then((data)=>{
    return data.json()
}).then((data)=>{
    let oldNamesList=namesList
    oldNamesList[0] = [...namesList[0], { id: data.guest_id, name: data.guest_name, table_id: -1}]
    setNamesList(oldNamesList);
    setName("");
})
}
return (
    <form className="boxSeatTables center" onSubmit={handleAdd}>
      <input
        type="input"
        value={name}
        name="guestName"
        onChange={(e) => setName(e.target.value)}
        placeholder="Guests Name"
        className="seatTablesInput inputFocus"
      />
      <button className="btns btnWelcome" type="submit">
        Add Guest
      </button>
    </form>
  );
};

export default SeatTables;

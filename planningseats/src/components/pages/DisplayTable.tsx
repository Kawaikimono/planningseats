import React, {useState, useRef} from 'react'
import { StrictModeDroppable } from "../properties/StrictModeDroppable";
import { GoTrash, GoPencil, GoCheckCircle } from "react-icons/go";
import { Name, Table } from '../../model';
import DisplayNameCards from './DisplayNameCards';

interface Props {
    table: Table
    table_number: number;
    tableNameMap: Name[][];
    setTableNameMap: React.Dispatch<React.SetStateAction<Name[][]>>
    event_id:number
  }

const DisplayTable: React.FC<Props> = ({table, tableNameMap, setTableNameMap, event_id}:Props ) => {
    let [note, setNote] = useState(table.note);
    let [isEdit, setIsEdit]= useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const submitForm = (e: React.MouseEvent, id: number)=> {
        noteEdit((e as React.FormEvent), id)
    }

    const clearForm = (e: React.MouseEvent, id: number) =>{
        note=""
        noteEdit((e as React.FormEvent), id)
    }

    const noteEdit = (e:React.FormEvent, table_id:number)=>{
        e.preventDefault();
        fetch(`/api/events/${event_id}/tables/${table_id}`,{
            method:"PATCH",
            headers: {
                Accept: 'application.json',
                'Content-Type': "application/json"
              },body: JSON.stringify({
                "note": note
              })
        }).then((_)=>{
            setNote(
                note
            );
        }).finally(()=>{
            setIsEdit(false);
        })
    }

  return (
    <div><StrictModeDroppable droppableId={`${table.id}`}>
    {(provided, snapshot) => (
      <div
        className={`displayTables ${
          snapshot.isDraggingOver ? "dragtable" : ""
        }`}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <span className="tableHeader">
          Table {table.table_number}
        </span>
        <form
          onSubmit={(e)=>{noteEdit(e, table.id)}}>
            {isEdit ? (
            <span className='tablenote singleNameCardText'><input
              id='width'
              ref={inputRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            /> <GoCheckCircle className='icon7' onClick={(e)=>{submitForm(e, table.id);}}/></span>
          ) : (
                <h5 className="tablenote">
                    {note}{" "}
                    <div className="hide right">
                    <span className="icon3">
                        <GoPencil onClick={()=> {
                            if (!isEdit) {
                                setIsEdit(!isEdit);
                            }
                        }}/>
                    </span>
                    <span className="icon3">
                        <GoTrash onClick={(e) => clearForm(e, table.id)}/>
                    </span>
                    </div>
                </h5>
          )}
        </form>

        {tableNameMap[table.table_number] && tableNameMap[
        table.table_number].length ? tableNameMap[table.table_number].map((guest, index) => (
          <DisplayNameCards
            event_id={event_id}
            index={index}
            name={guest}
            key={guest.id}
            table_number={table.table_number}
            names={tableNameMap}
            setNames={setTableNameMap}
          />
        )): <></>}
        {provided.placeholder}
      </div>
    )}
  </StrictModeDroppable></div>
  )
}

export default DisplayTable
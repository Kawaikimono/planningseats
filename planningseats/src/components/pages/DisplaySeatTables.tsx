import React, { useState, useEffect } from "react";
import { Name, Table } from "../../model";
import DisplayNameCards from "./DisplayNameCards";
import { useParams, useNavigate } from "react-router-dom";
import { StrictModeDroppable } from "../properties/StrictModeDroppable";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { GoTrash, GoPlusCircle } from "react-icons/go";
import SeatTables from "./SeatTables";
import LinkInfo from "./LinkInfo";
import { Tooltip } from 'react-tooltip'
import DisplayTable from "./DisplayTable";

interface Props {
}

const DisplaySeatTables: React.FC<Props> = ({
}: Props) => {
  const redirect = useNavigate();
  let [tableList, setTableList] = useState<Table[]>([]);
  let [tableNameMap, setTableNameMap] = useState<Name[][]>([]);
  let [tableReverseLookup, setTableReverseLookup] = useState(
    new Map<number, number>()
  );
  let [name, setName] = useState("");
  const { id } = useParams();

  useEffect(() => {
    let fetchedTablesList: Table[] = [];
    let fetchedTableNameMap: Name[][] = [];
    let fetchedTableReverseLookup = new Map<number, number>();

    fetch(`/api/events/${id}`)
    .then((data) => {
      if (data.status == 404) {
        return redirect(`/`)
      }
    
    fetch(`/api/events/${id}/tables`)
    .then((data) => {
        return data.json();
    })
    .then((data) => {
        fetchedTablesList.length = data.tables.length;
        for (let t of data.tables) {
        fetchedTablesList[t.table_number - 1] = {
            id: t.id,
            isNote: false,
            table_number: t.table_number,
            note: t.note,
        };
        }
        for (let t of fetchedTablesList) {
            if (t.id){
                const x: Name[] = [];
                fetchedTableNameMap.push(x);
                fetchedTableReverseLookup.set(t.id, t.table_number);
            }
        }
        const x: Name[] = [];
        fetchedTableNameMap.push(x);
        fetch(`/api/events/${id}/guests`)
          .then((data) => {
            return data.json();
          })
          .then((data) => {
            for (let n of data.guests) {
              const curr_guest: Name = {
                id: n.id,
                name: n.guest_name,
                table_id: n.table_id,
              };
              if (n.table_id != null && n.table_id != undefined && n.table_id !=0) {
                const table_number = fetchedTableReverseLookup.get(n.table_id);
                fetchedTableNameMap[table_number!].push(curr_guest);
              } else {
                fetchedTableNameMap[0].push(curr_guest);
              }
            }

            setTableList(fetchedTablesList);
            setTableReverseLookup(fetchedTableReverseLookup);
            setTableNameMap(fetchedTableNameMap);
          });
    });

  })

  }, []);

  const addTBL = ()=>{
    fetch(`/api/events/${id}/tables`,{
      method:"PATCH"
    })
    .then((data) => {
        return data.json();
    })
    .then((data) => {
      const newTable:Table={
        id:data.table_id,
        table_number:data.table_number,
        note:"",
        isNote:false
      }
      tableList.push(newTable)
      tableNameMap.push([])
      tableReverseLookup.set(newTable.id, newTable.table_number)
      setTableList([...tableList])
  })}

  const deleteTBL = ()=>{
    fetch(`/api/events/${id}/tables`,{
      method:"DELETE"
    })
    .then((_) => {
      const victim = tableList.pop()!;
      while(tableNameMap[victim.table_number].length != 0){
        let standingGuest = tableNameMap[victim.table_number].pop()!
        standingGuest.table_id=0
        tableNameMap[0].push(standingGuest)
      }
      tableReverseLookup.delete(victim.id)
      tableNameMap.pop()
      setTableList([...tableList])
      setTableNameMap([...tableNameMap])
    })
  }

  const onDragEnd = (result: DropResult) => {
    document.documentElement.removeAttribute("style");
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceId = parseInt(source.droppableId);
    const targetId = parseInt(destination.droppableId);
    let sourceIdx = 0;
    let targetIdx = 0;
    if (targetId != 0) {
      targetIdx = tableReverseLookup.get(targetId!)!;
    }
    if (sourceId != 0) {
      sourceIdx = tableReverseLookup.get(sourceId!)!;
    }
    let add,
      active = tableNameMap[sourceIdx],
      complete = tableNameMap[targetIdx];

    add = active[source.index];
    active.splice(source.index, 1);
    complete.splice(destination.index, 0, add);
    let destTable: number | null = targetId;
    if (destTable == 0) {
      destTable = null;
    }

    fetch(`/api/events/${id}/guests/${add.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_id: destTable,
      }),
    }).then((_) => {
      tableNameMap[sourceIdx] = active;
      tableNameMap[targetIdx] = complete;
      setTableNameMap(tableNameMap);
    });
  };
  return (
    <>
     <LinkInfo/>
      {" "}
      <SeatTables
        name={name}
        namesList={tableNameMap}
        setName={setName}
        setNamesList={setTableNameMap}
      />
      <DragDropContext onDragStart={()=>{document.documentElement.setAttribute("style", "scroll-behavior: auto");
}} onDragEnd={onDragEnd}>
        <div className="container phone">
          <StrictModeDroppable droppableId="0">
            {(provided, snapshot) => (
              <div
                className={`displaySeatingTables ${
                  snapshot.isDraggingOver ? "dragtable" : ""
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span className="tableHeader">Guests</span>
                {tableNameMap.length ? tableNameMap[0].map((guest, index) => (
                  <DisplayNameCards
                    event_id={parseInt(id!)}
                    index={index}
                    name={guest}
                    key={guest.id}
                    table_number={0}
                    names={tableNameMap}
                    setNames={setTableNameMap}
                  />
                )): <></>}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>

          <div className="tablesUpDown">
            {tableList.length ? tableList.map((table, table_number) => {
              return (
                <DisplayTable
                key={table.id}
                table={table}
                table_number={table_number}
                tableNameMap={tableNameMap}
                setTableNameMap={setTableNameMap}
                event_id={parseInt(id!)}
                />
              );
            }) : <></>}
            <div className="displayTables">
              <span className="tableHeader">
                Edit Tables{" "}
                <div className="hide">
                  <span className="icon4 addTBL" onClick={addTBL}>
                    <GoPlusCircle />
                    <Tooltip anchorSelect=".addTBL" place="top">
                      Add a table
                    </Tooltip>
                  </span>{" "}
                  <span className="icon5 deleteTBL" onClick={deleteTBL}>
                    <GoTrash />
                    <Tooltip anchorSelect=".deleteTBL" place="right">
                      Delete your last table
                    </Tooltip>
                  </span>
                </div>
              </span>
            </div>
          </div>
        </div>
      </DragDropContext>
    </>
  );
};

export default DisplaySeatTables;

import React, { useEffect, useRef, useState } from "react";
import { Name } from "../../model";
import { Draggable } from "react-beautiful-dnd";
import { GoTrash, GoPencil, GoCheckCircle } from "react-icons/go";

interface Props {
  index: number;
  name: Name;
  names: Name[][];
  table_number: number;
  setNames: React.Dispatch<React.SetStateAction<Name[][]>>;
  event_id:number;
}

const DisplayNameCards = ({ index, name, names, table_number, setNames, event_id }: Props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(name.name);
  const formId = `guestForm${name.id}`

  const handleDelete = (id: number) => {
    fetch(`/api/events/${event_id}/guests/${id}`,{
        method:"DELETE"
    }).then((_)=>{
        let oldNames = names
        oldNames[table_number] = oldNames[table_number].filter((name) => name.id !== id)
        setNames(oldNames);
    })
    };

const submitForm = (e: React.MouseEvent, id: number)=> {
    handleEdit((e as React.FormEvent), id)
}

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    fetch(`/api/events/${event_id}/guests/${id}`,{
        method:"PATCH",
        headers: {
            Accept: 'application.json',
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            "guest_name": editName
          })
    }).then((_)=>{
        let oldNames = names
        oldNames[table_number] = oldNames[table_number].map((name) => (name.id === id ? { ...name, name: editName } : name))
        setNames(
          [...oldNames]
        );
        
    }).finally(()=>{
        setEdit(false);
    })
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  return (
    <Draggable draggableId={name.id.toString()} index={index}>
      {(provided) => (
        <form
          className="singleNameCard"
          onSubmit={(e) => handleEdit(e, name.id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          id={formId}
        >
          {edit ? (
            <>
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <GoCheckCircle className='icon' onClick={(e)=>{submitForm(e, name.id);}}/>
            </>
          ) : (
            <><span className="singleNameCardText">{name.name}</span>
            <div>
                <span
                className="icon"
                onClick={() => {
                    if (!edit) {
                    setEdit(!edit);
                    }
                }}
                >
                <GoPencil />
                </span>
                <span className="icon" onClick={() => handleDelete(name.id)}>
                <GoTrash />
                </span>
            </div></>
          )}
        </form>
      )}
    </Draggable>
  );
};

export default DisplayNameCards;

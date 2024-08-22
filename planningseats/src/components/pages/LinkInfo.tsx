import { GoTrash, GoPencil, GoPaperclip, GoCheckCircle} from "react-icons/go";
import { useParams } from "react-router-dom";
import { CgArrowsScrollV } from "react-icons/cg";
import { Tooltip } from 'react-tooltip'
import { useEffect, useState } from "react";
import { Event } from "../../model";


const LinkInfo = () => {

  function unsecuredCopyToClipboard(text:string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  }

    async function copyThat():Promise<void> {
     if (navigator.clipboard) 
     {await navigator.clipboard.writeText(location.href);}
     else {
      unsecuredCopyToClipboard(location.href);
     }
  }

  const {id} = useParams();
  let [event, setEvent] = useState<Event>()
  
  useEffect(() => {
    fetch(`/api/events/${id}`).then((data)=>{
      return data.json()
    }).then((data)=>{
      event = {
        id: parseInt(id!),
        isNote: false,
        note: data.note,
        isTitle: false,
        title: data.title
      }
      if(event.title == null) {
        event.title = ""
      }
      if(event.note == null) {
        event.note = ""
      }
      setEvent(event)
    })
  },[])

  const handleTitle = (e: React.FormEvent) => {
    e.preventDefault()
    fetch(`/api/events/${id}`,{
      method:"PATCH",
      headers: {
        Accept: 'application.json',
        'Content-Type': "application/json"
      },body: JSON.stringify({
        "title": event?.title
      })
    }).then((_)=>{
      event!.isTitle=false
      setEvent(structuredClone(event))
    })
  }
  const handleNote = (e: React.FormEvent) => {
    e.preventDefault()
    fetch(`/api/events/${id}`,{
      method:"PATCH",
      headers: {
        Accept: 'application.json',
        'Content-Type': "application/json"
      },body: JSON.stringify({
        "note": event?.note
      })
    }).then((_)=>{
      event!.isNote=false
      setEvent(structuredClone(event))
    })
  }

  const handleToggle = (isTitle: Boolean) => {
    if(isTitle){
      event!.isTitle = true
    } else {
      event!.isNote = true
    }
    setEvent(structuredClone(event))
  }

  const handleGarbage = (e:React.MouseEvent) =>{
    event!.note = ""
    handleNote(e as React.FormEvent)
  }

    
    return (
      <div className="center">
        <h4 className="spaceabove fancy"><CgArrowsScrollV /> Your event id is: {id} <span className="icon clippy" onClick={copyThat}><GoPaperclip /></span> 
        <Tooltip anchorSelect=".clippy" place="right">Copy your event link for later</Tooltip><CgArrowsScrollV /></h4>
          {
            event && event.isTitle ? (
              <form onSubmit={handleTitle}>
                <br/>
              <input className="singleNameCardText width3" onChange={(e)=>{event!.title = e.target.value; setEvent(structuredClone(event))}} value={event!.title}  ></input><GoCheckCircle className="icon7" onClick={(e)=>handleTitle(e as React.FormEvent)}/>
              </form>
              ) : (
              <span onClick={()=>{handleToggle(true)}}><h2 className="spaceabove fancy2" > {
                event ? event.title ? (event?.title) : (<>Name Your Event</>) : (<>.</>)
              }<Tooltip anchorSelect=".fancy2" place="right">Edit Title</Tooltip></h2></span>)
          }
            <div className="boxSeatTables2" id= "noted">
          {
                event && event.isNote ? (
                  <form onSubmit={handleNote}>
                    <input className="singleNameCardText width" onChange={(e) => {event!.note = e.target.value; setEvent(structuredClone(event))}} value={event!.note}></input>  <span className="icon"><GoCheckCircle onClick={(e)=>handleNote(e as React.FormEvent)} /></span>
                  </form> ) : (
                  <h4>{event?.note} <span className="icon6 hide"><GoPencil onClick={()=>handleToggle(false)} /></span><span className="icon6 hide"><GoTrash onClick={handleGarbage}/></span></h4>)
          }
              
        </div>
      </div>
    );
  };
  
  export default LinkInfo;
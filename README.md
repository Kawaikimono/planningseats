<a id="readme-top"></a>
# About Planning Seats

![Screenshot of planned event on Planning Seats](/static/Tibolts.png)

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-planning-seats">About Planning Seats</a>
    </li>
    <li>
      <a href="#frontend-layout">Frontend Layout</a>
      <ul>
        <li><a href="#react-components">React Components</a></li>
        <ul>
        <li><a href="#welcome">Welcome</a></li>
        <li><a href="#seatingchart">SeatingChart</a></li>
        <li><a href="#linkinfo">LinkInfo</a></li>
        <li><a href="#seattables">SeatTables</a></li>
        <li><a href="#displayseattables">DisplaySeatTables</a></li>
        <li><a href="#displaynamecards">DisplayNameCards</a></li>
        <li><a href="#displaytable">DisplayTable</a></li>
        </ul>
      </ul>
    </li>
    <li><a href="#backend-layout">Backend Layout</a></li>
    <li><a href="#running-locally">Running Locally</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>
<br/>

Do you remember in Gilmore Girls when Lorali gets drunk and takes her mother's wedding seatting chart and rearranges it? Well now at least she'd have to know what the event number is!

Designed with Wedding Planners, Event Organizers and hosts in mind, please enjoy this digital seatting chart app!


<br/>

# Frontend Layout



## React Components

In the basic React app.tsx, 3 routes are built out:
  
  * An initial event creation page/direct to current event page
  * Initial table setup page after initial event creation
  * Full event table rendering



```
Welcome
SeatingChart
LinkInfo
SeatTables
DisplaySeatTables
DisplayNameCards
DisplayTable
```

### Welcome:

This is the first page you will see upon heading to the site. In it you are given the option to create a new event or go to your current event by providing the event-id.

* If you do not have a new event you are navigated to seattingChart.

* If you DO have an event you are navigated to your current event which is based off of your event id.

<br/>

### SeatingChart:

Once you have created a new event you will be redirected here. In this form you will be asked to provide the number of tables you think you will need for your event. Do not worry if you are unsure, you will be able to edit the number of tables later.

<br/>

### LinkInfo:

After you have navigated to your event either via giving your event id or gennerating a new event, this is the component that keeps track of your event id for you as well as any event title or event notes you may want. All fields are editable and the paperclip icon will copy the url event link into your local clip board for your convenience.

<br/>

### SeatTables

SeatTables handles the addition of new guests to your event. Once you type in a name to the input field, it will display under the "Guest" table on the left of your screen.

<br/>

### DisplaySeatTables

This component takes in the SeatTables, DisplayNameCards, and DisplayTable components and passes on properties to each of these components. It's job is to coordinate formating across these components as well as persisting names and their coresponding table ids (if present) to the event. Table ids are assigned on the "drop" portion of the drag and drop. Additionally new tables are creatable and your last table is deletable from this component.

<br/>

### DisplayNameCards

Renders name cards to the page. All name cards are editable and deletable.

<br/>

### DisplayTable

Based off of the number of tables you enter in SeatingChart this component will generate that number of tables. Additionally table notes are editable and deletable in this component.


<br/>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Backend Layout

## Database Design

This database is centered around 3 tables:

* Events
* Tables
* Guests

For each Event there is an associated title and note that is defaulted to an empty string.

In each Table, there an event id is linked as well as a possible note and table number.

Guests are also linked to the event id and as they are dragged and dropped into tables the table id is then added to it's guest

### Table Definitions
#### Events

| Column Name   | Data Type      |  Constraints |
|----------|:-------------:|------:|
| id |  integer | PRIMARY KEY |
| title |    text   |    |
| note | text |    |

#### Tables

| Column Name   | Data Type      |  Constraints |
|----------|:-------------:|------:|
| id |  integer | PRIMARY KEY |
| event_id |    integer  | NOT NULL FOREIGN KEY(EVENT.ID)   |
| note | text |    |
|  table_number  |  integer    |    |

#### Guests

| Column Name   | Data Type      |  Constraints |
|----------|:-------------:|------:|
| id |  integer | PRIMARY KEY |
| event_id |    integer  | NOT NULL FOREIGN KEY(EVENT.ID)   |
| table_id |    integer  | FOREIGN KEY(TABLE.ID)   |
| guest_name | text |    |

<br/>

## Flask API

Several pathways for full CRUD fuctionality were made for updating each of the above database tables. 
### Events
Create: `POST /api/events/ {} -> {event_id}`
Update: `PATCH /api/events/<event_id> {note, title} -> {updated event data}`
### Guests
Create: `POST /api/events/<event_id>/guests {name} -> {guest_id, name}`
Read: `GET /api/events/<event_id>/guests {} -> {[list of guests]}`
Update: `PATCH /api/events/<event_id>/guests/<guest_id> {name or table number} -> {updated guest info}`
Delete: `DELETE /api/events/<event_id>/guests/<guest_id> {} -> {}`
### Tables
Note: `table number` for any new table is always the max available for the given event.
Create (bulk): `POST /api/events/<event_id>/tables {number of tables} -> {[list of new tables]}`
Create (single): `PATCH /api/events/<event_id>/tables {note} -> {new table}`
Read: `GET /api/events/<event_id>/tables {} -> {[List of tables]}`
Update: `PATCH /api/events/<event_id>/tables/<table_id> {note} -> {table with updated note}`
Delete `DELETE /api/events/<event_id>/tables {} -> {}`

All requests are handled via Flask, proxied via the `/api/` proxy defined in the vite config.

<br/>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Built With

This project is built with:

* React 
* Typescript
* Sqlite3
* Python
* react-tooltip
* react-beautiful-dnd
* react-icons/go
* react-router-dom
* Google Fonts
* Flask

<p align="right">(<a href="#readme-top">back to top</a>)</p>


# Running Locally

This project will be live on the web soon but until then, please use these steps to run the project:


Install npm and all dependencies
  ```sh
  npm install npm@latest -g
  npm install
  ```
Install python dependencies
  ```sh
  mkdir venv
  cd venv && python3 -m venv
  source bin/activate
  cd ..
  pip install -r requirements.txt
  ```

  To run the app, be sure to run both the python server and vite webserver:

  ```sh
  npm run dev
  python3 -m flask run --port 8080
  ```
  NOTE: In case the flask port needs to change, please update the proxy settings in vite.config.ts to appropriately match


<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Roadmap

As with any project there is more functionality that I would like to expand on.

Next step goals:
- [ ] Add CSV name import functionality
- [ ] Add extensive error handling on front and back end

Stretch goals:
- [ ] Edit and read only modes (with possible pin)
- [ ] Pin reset
- [ ] Color Schemes
- [ ] Selecting multiple people to move to a table
- [ ] Dynamically reorganizing tables (possibly spacially)


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE` for more details. 


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Contact

- Aly Geiger- [GitHub](https://github.com/Kawaikimono)
- Video demo of this [project](https://drive.google.com/file/d/1M-ZQwi__SyPlXp9TgOBONfs6B9zBTKuh/view)
- This project [repo](https://github.com/Kawaikimono/planningseats)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Acknowledgments

Thank you to CS50's David Malan and crew for the amazing online coding course. You have helped tremendously on this journey. Additional thanks to:

* Roadside Coder's [Youtube Channel](https://choosealicense.com)
* Othneildrew [Best-README-Template's Readme](https://github.com/othneildrew/Best-README-Template/blob/master/README.md?plain=1)
* Megan, for getting married and making me think of this idea



<p align="right">(<a href="#readme-top">back to top</a>)</p>

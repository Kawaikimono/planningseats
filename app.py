import os
from helpers import apology
from flask import Flask, flash, redirect, render_template, request, g
import sqlite3

# Configure application
app = Flask(__name__, static_url_path='/', static_folder='planningseats')


@app.before_request
def before_request():
    g.db = sqlite3.connect("planningseats.db")

@app.teardown_request
def close_request(err):
    if hasattr(g, 'db'):
        g.db.close()


# Initial event creation
@app.route("/api/events", methods=["POST"])
def events():
    """
    expected POST payload: 
        {}
    ------
    expected POST repsonse: 
        {"event_id": [INT]}

    """
    cursor=g.db.cursor()
    sql="INSERT INTO events DEFAULT VALUES"
    cursor.execute(sql)
    g.db.commit()
    cursor.execute("SELECT last_insert_rowid()")
    res=cursor.fetchall()
    new_event_id=res[0][0]
    return {"event_id":new_event_id}


# Event change: Note/Title
@app.route("/api/events/<event_id>", methods=["GET", "PATCH"])
def patch_event(event_id):
    """
    expected PATCH payload: 
        {"title": TEXT
        "note": TEXT}
    -----
    expected PATCH response:
        {"title": TEXT
        "note": TEXT}

    """
    cursor=g.db.cursor()
    if request.method == "PATCH":
        set_strings = []
        set_values = []
        if "title" in request.json: 
            set_strings.append("title=?")
            set_values.append(request.json["title"])
        if "note" in request.json: 
            set_strings.append("note=?")
            set_values.append(request.json["note"])
        if len(set_strings) == 0:
            return {}
        sql=f"UPDATE events SET {', '.join(set_strings)} WHERE id=?"
        set_values.append(event_id)
        cursor.execute(sql,set_values)
        g.db.commit()
    cursor.execute("SELECT title, note FROM events WHERE id=?", (event_id))
    res=cursor.fetchall()
    updated_event_id=res[0]
    return {"title":updated_event_id[0],"note":updated_event_id[1]}



# Initial guest creation
@app.route("/api/events/<event_id>/guests", methods=["GET","POST"])
def guests(event_id):
    """
    expected POST payload:
    {"guest_name": TEXT}
    -----
    expected POST response:
    {"guest_id": INT
    guest_name: TEXT}
    -----
    expected GET response:
        {"guests": 
        [{"id": INT,
        table_id: INT,
        "guest_name": TEXT}]}

    """
    cursor=g.db.cursor()

    if request.method == "POST":
        guest_name = request.json["guest_name"]
        sql="INSERT INTO guests (event_id, guest_name) VALUES (?,?)"
        cursor.execute(sql,(event_id, guest_name))
        g.db.commit()
        cursor.execute("SELECT last_insert_rowid()")
        res=cursor.fetchall()
        new_guest_id=res[0][0]
        return {"guest_id":new_guest_id, "guest_name":guest_name}

    else:
        sql="SELECT guest_name, table_id, id FROM guests WHERE event_id = ?"
        cursor.execute(sql, (event_id))
        res=cursor.fetchall()
        guests = [{"guest_name": row[0], "table_id": row[1], "id": row[2]} for row in res]
        return {"guests":guests}
    

# Guest change: Guests_name/Table_id
@app.route("/api/events/<event_id>/guests/<guest_id>", methods=["GET","PATCH","DELETE"])
def patch_guest(event_id, guest_id):
    """
    expected PATCH payload: 
        {"guest_name": TEXT
        "table_id": TEXT}
    -----
    expected PATCH response:
        {"guest_name": TEXT
        "table_id": TEXT}

    """

    cursor=g.db.cursor()
    if request.method == "PATCH":
        set_strings = []
        set_values = []
        if "guest_name" in request.json: 
            set_strings.append("guest_name=?")
            set_values.append(request.json["guest_name"])
        if "table_id" in request.json: 
            set_strings.append("table_id=?")
            set_values.append(request.json["table_id"])
        if len(set_strings) == 0:
            return {}
        sql=f"UPDATE guests SET {', '.join(set_strings)} WHERE id=? AND event_id=?"
        set_values.append(guest_id)
        set_values.append(event_id)
        cursor.execute(sql,set_values)
        g.db.commit()
    elif request.method== "DELETE":
        cursor.execute("DELETE FROM guests WHERE id=? AND event_id =? ", (guest_id,event_id))
        g.db.commit()
        return ""
    cursor.execute("SELECT guest_name, table_id FROM guests WHERE event_id=? AND id=?", (event_id,guest_id))
    res=cursor.fetchall()
    updated_guest_id=res[0]
    return {"guest_name":updated_guest_id[0],"table_id":updated_guest_id[1]}
    


# Initial table creation, deletion and addition
@app.route("/api/events/<event_id>/tables", methods=["GET","POST","DELETE","PATCH"])
def tables(event_id):
    """
    expected POST payload:
        {"number_of_tables": [INT]}
    -----
    expected POST response:
        {"tables":[{"id":INT
        "table_number":INT
        "note":TEXT}]}
    -----
    expected GET payload:
        {"tables":[{"id":INT
        "table_number":INT
        "note":TEXT}]}

    """

    cursor=g.db.cursor()

    if request.method == "POST":
        number_of_tables = request.json["number_of_tables"]
        insert_data=[]
        insert_strings=[]
        for n in range(number_of_tables):
            insert_strings.append("(?,?)")
            insert_data.extend((event_id,n+1))
        sql=f"INSERT INTO tables (event_id, table_number) VALUES {', '.join(insert_strings)}"
        cursor.execute(sql,insert_data)
        g.db.commit()
        cursor.execute("SELECT id, table_number FROM tables WHERE event_id = ?", (event_id))
        res=cursor.fetchall()
        tables = [{"table_id": row[0], "table_number": row[1], "note": ""} for row in res]
        return {"tables":tables}
    elif request.method == "GET":
        sql="SELECT id, table_number, note FROM tables WHERE event_id = ?"
        cursor.execute(sql, (event_id))
        res=cursor.fetchall()
        tables = [{"id": row[0], "table_number": row[1], "note": row[2] if row[2] is not None else""} for row in res]
        return {"tables":tables}
    elif request.method == "PATCH":
        sql="SELECT max(table_number) FROM tables WHERE event_id = ?"
        cursor.execute(sql, (event_id))
        res=cursor.fetchall()
        new_table_number=res[0][0]+1
        sql="INSERT INTO tables (event_id, table_number) VALUES (?,?)"
        cursor.execute(sql,(event_id,new_table_number))
        g.db.commit()
        cursor.execute("SELECT id, max(table_number) FROM tables WHERE event_id = ?", (event_id))
        row=cursor.fetchall()[0]
        tables = {"table_id": row[0], "table_number": row[1], "note": None}
        return tables
    else: #DELETE case
        sql="SELECT id, max(table_number) FROM tables WHERE event_id = ?"
        cursor.execute(sql, (event_id))
        res=cursor.fetchall()
        table_id=res[0][0]
        print(table_id)
        sql="UPDATE guests SET table_id = NULL WHERE table_id = ?"
        cursor.execute(sql, (table_id,))
        deletesql="DELETE FROM tables WHERE id = ?"
        cursor.execute(deletesql, (table_id,))
        g.db.commit()
        return ''



# Table change: Note
@app.route("/api/events/<event_id>/tables/<table_id>", methods=["PATCH"])
def patch_table(event_id, table_id):
    """
    expected PATCH payload: 
        {"note": TEXT}
    -----
    expected PATCH response:
        {"note": TEXT}

    """
    if request.method == "PATCH":
        if "note" not in request.json:
            return {}
        cursor=g.db.cursor()
        sql=f"UPDATE tables SET note=? WHERE id=? AND event_id=?"
        cursor.execute(sql,(request.json["note"], table_id, event_id))
        g.db.commit()
        cursor.execute("SELECT note FROM tables WHERE event_id=? and id=?", (event_id,table_id))
        res=cursor.fetchall()
        updated_guest_id=res[0]
        return {"note":updated_guest_id[0]}

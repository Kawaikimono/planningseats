DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS guests;
DROP TABLE IF EXISTS tables;

CREATE TABLE events
(
    id INTEGER PRIMARY KEY,
    title TEXT,
    note TEXT DEFAULT ''
);

CREATE TABLE guests
(
    id INTEGER PRIMARY KEY,
    event_id INTEGER NOT NULL,
    guest_name TEXT,
    table_id INTEGER,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (table_id) REFERENCES tables(id)
);

CREATE TABLE tables
(
    id INTEGER PRIMARY KEY,
    table_number INTEGER,
    event_id INTEGER NOT NULL,
    note TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id)
);
export interface Name{
    id:number;
    name:string;
    table_id:number;
}

export interface Table{
    id:number;
    isNote:boolean;
    table_number:number;
    note:string;
}

export interface Event{
    id:number;
    isNote:boolean;
    note:string;
    isTitle:boolean;
    title:string;
}
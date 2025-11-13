import { readFileSync } from "fs";
import MDBReader from "mdb-reader";

console.log("Hello");

const buffer = readFileSync("E:\\Downloads\\Other\\DOK 16GB 22.7.2012\\heichal haim\\Heichal.mdb");
const reader = new MDBReader(buffer);

const tables = reader.getTableNames(); // ['Cats', 'Dogs', 'Cars']
console.log(JSON.stringify(tables, null, 2));



// const table = reader.getTable("Cats");
// table.getColumnNames(); // ['id', 'name', 'color']
// table.getData(); // [{id: 5, name: 'Ashley', color: 'black'}, ...]






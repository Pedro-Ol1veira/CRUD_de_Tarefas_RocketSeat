import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  select(table, search) {
    let data = this.#database[table] ?? [];
    if (search.title || search.description) {
      data = data.filter((row) => {
        return (
          row.title.includes(search.title) ||
          row.description.includes(search.description)
        );
      });
    }

    return data;
  }

  delete(table, id) {
    const taskIndex = this.#database[table].findIndex(row => row.id == id);
    
    if(taskIndex > -1) {
      this.#database[table].splice(taskIndex, 1);
      this.#persist();
    } else {
      throw new Error("Id inválido");
    }
    
    
  }

  update(table, id, data) {
    const taskIndex = this.#database[table].findIndex(row => row.id == id);
    
    if(taskIndex > -1) {
      this.#database[table][taskIndex].title = data.title;
      this.#database[table][taskIndex].description = data.description;
      this.#database[table][taskIndex].updated_at = Date.now();
      
      this.#persist();
    } else {
      throw new Error("Id inválido");
    }
    
    
  }
}

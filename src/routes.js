import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "../utils/buid-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.query;

      const tasks = database.select("tasks", { title, description });

      res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      try {
        database.delete('tasks', id);
        res.writeHead(204).end();
      } catch (error) {
        res.writeHead(404).end(error.message);
      }
    },
  },
];

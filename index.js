// Stage 0 - Start the Server
const express = require("express");
const app = express();
const port = 3000;

const MY_TASKS = [
  { id: 1, title: "Pray to God", done: false },
  { id: 2, title: "Check Discord and X", done: true },
  { id: 3, title: "Prepare to go out", done: false },
];

const tasks = MY_TASKS.map((task) => ({ ...task }));

app.get("/", (req, res) => {
  res.status(200).send("Hello! My Node.js server is working.");
});

/////////////////////////////////////
// Stage 1
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks", "/stats", "/reset"],
  });
});

/////////////////////////////////////////
//Stage 2: Read list and single task
app.get("/tasks", (req, res) => {
  let result = tasks;

  // Extras: GET /tasks?done=true  → only finished (or only open) tasks.
  if (req.query.done !== undefined) {
    if (req.query.done !== "true" && req.query.done !== "false") {
      return res.status(400).json({ error: "done must be true or false" });
    }

    const done = req.query.done === "true";
    result = result.filter((t) => t.done === done);
  }

  // Extras: GET /tasks?search=milk → tasks whose title contains the word.
  if (req.query.search !== undefined) {
    const word = String(req.query.search).trim();
    if (word === "") {
      return res.status(400).json({ error: "search must not be empty" });
    }

    const lower = word.toLocaleLowerCase();
    result = result.filter((t) => t.title.toLocaleLowerCase().includes(lower));
  }
  res.json(result);
});

/////////////////////////////
// Get Task with id
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  res.json(task);
});

////////////////////////////
// Get Stats
app.get("/stats", (req, res) => {
  const done = tasks.filter((t) => t.done).length;
  res.json({
    total: tasks.length,
    done,
    open: tasks.length - done,
  });
});

//Stage 3: Create
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (title === undefined || title === null || String(title).trim() === "") {
    return res
      .status(400)
      .json({ error: "title is required and cannot be empty" });
  }

  const id = tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
  const task = { id, title: String(title).trim(), done: false };

  tasks.push(task);
  res.status(201).json(tasks);
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(port, () => {
  console.log(`Hello server, CRUD API listening on port ${port}`);
});

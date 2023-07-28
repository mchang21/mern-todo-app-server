const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json()); // Use express.json() middleware for parsing JSON data

// Use async/await for database connection
(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
        console.log("MongoDB database connection established successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // Exit the application on connection failure
    }
})();

todoRoutes.route('/').get(async (req, res) => {
    try {
        const todos = await Todo.find(); // Use await to wait for the Promise to resolve
        res.json(todos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
});

todoRoutes.route('/:id').get(async (req, res) => {
    try {
        let id = req.params.id;
        const todo = await Todo.findById(id);
        res.json(todo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
});

todoRoutes.route('/add').post(async (req, res) => {
    try {
        let todo = new Todo(req.body);
        await todo.save();
        res.status(200).json({ 'todo': "Todo added successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).send("Adding new Todo failed");
    }
});

todoRoutes.route('/update/:id').post(async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            res.status(404).send("Data is not found");
        } else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            await todo.save();
            res.json("Todo updated");
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("Update not possible")
    }
})

todoRoutes.route('/:id').delete(async (req, res) => {
    try {
        const todoID = req.params.id;
        const todo = await Todo.findByIdAndDelete(todoID);

        if (!todo) {
            res.status(404).json({ error: "Data not found" });
        } else {
            res.json( { message: "Todo deleted successfully" } );
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.use('/todos', todoRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
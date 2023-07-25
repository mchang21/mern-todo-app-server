const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

todoRoutes.route('/').get(async function (req, res) {
    try {
        const todos = await Todo.find(); // Use await to wait for the Promise to resolve
        res.json(todos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
});

todoRoutes.route('/:id').get(async function (req, res) {
    try {
        let id = req.params.id;
        const todo = await Todo.findById(id);
        res.json(todo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
});

todoRoutes.route('/add').post(async function (req, res) {
    try {
        let todo = new Todo(req.body);
        await todo.save();
        res.status(200).json({ 'todo': "Todo added successfully"});
    } catch (err) {
        console.log(err);
        res.status(400).send("Adding new Todo failed");
    }
});

todoRoutes.route('/update/:id').post(async function (req, res) {
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

app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
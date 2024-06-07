const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

let items = [
    { id: 1, name: 'pomme', description: 'fruit' },
    { id: 2, name: 'carotte', description: 'légume' }
];
app.get("/items", (req, res) => {
    res.status(200).send(items);
});

app.get('/items/:id', (req, res) => {
    const { id } = req.params;
    const item = items.find(item => item.id == id);
    if (item) {
        res.status(200).send(item);
    } else {
        res.status(404).send({ message: 'Item not found' });
    }
});


app.post("/items", (req, res) => {

    const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
    const newItem = { id: newId, ...req.body };

    items.push(newItem);
    res.status(201).send(newItem);
});


app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const item = items.find(item => item.id == id);
    if (item) {
        item.name = name;
        item.description = description;
        res.status(200).send(item);
    } else {
        res.status(404).send({ message: 'Item not found' });
    }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


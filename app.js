const express = require("express");
const bodyParser = require("body-parser");
const argon2 = require("argon2");

const app = express();
const port = 3000;

app.use(bodyParser.json());

let users = [
    { id: 1, name: 'Jacques', description: 'pilote', password: 'jacquo' },
    { id: 2, name: 'Marie', description: 'prof', password:'mario' }
];

const hashPassword = (req, res, next) => {

    argon2.hash(req.body.password)
        .then((hashedPassword) => {

            req.body.password = hashedPassword;

            next();
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

app.get("/users", (req, res) => {
    res.status(200).send(users);
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id == id);
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send({ message: 'User not found' });
    }
});

app.post("/users", hashPassword, (req, res) => {
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser = { id: newId, ...req.body };
    users.push(newUser);
    res.status(201).send(newUser);
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const user = users.find(user => user.id == id);
    if (user) {
        user.name = name;
        user.description = description;
        res.status(200).send(user);
    } else {
        res.status(404).send({ message: 'User not found' });
    }
});


// const verifyPassword = (req, res) => {
//     argon2
//       .verify(req.user.password, req.body.password)
//       .then((isVerified) => {
//         if (isVerified) {
//             console.log("verifiée")
//           const payload = { sub: req.user.id };
  
//           const token = jwt.sign(payload, process.env.JWT_SECRET, {
//             expiresIn: "4h",
//           }
//         );

// a faire : création du Token / Bear / autorisation de la requête avec le token 



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
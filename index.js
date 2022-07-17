const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const fileupload = require('express-fileupload')
const mongoose = require("mongoose");
let MONGO_URI = "mongodb+srv://amathakbari:24l63AQs7kQ8D3hX@my-db.m8xjh.mongodb.net/DreamLogger?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI);
let db = mongoose.connection
const validator = require("email-validator");
const fs = require("fs");
let files = ["main", "add", "my_dreams"]
let credentials = db.collection("credentials");
let dreams = db.collection("dreams");
app.use(express.json(), fileupload());
let waiting;
app.use(express.static('public'));

function direct(string){
    return __dirname + "/public/" + string;
}

app.get('/', function (req, res) {
    res.sendFile(direct("index.html"));
})

app.get("/:id", (req, res) => {
    let id = req.params.id;
    if (files.includes(id)) {
        res.sendFile(direct(`${id}.html`))
    } else {
        res.send("<h1>ERROR 404<br>This is not the page you're looking for.")
    }
})

app.get("*", (req, res) => {
    
})

server.listen(3000,'localhost', () => {
    console.log('Server running at http://localhost:3000')
})
mongoose.connection.on("connected", (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Database Connected")
    }
})





app.post("/cred", (req, res) => {
    console.log(1)
    let uname = req.body.u;
    let psw = req.body.p;
    let type = req.body.t;
    credentials.findOne({uname: uname}, (err, doc) => {
        if (type == "login") {
            if (doc == null || doc.password != psw) {
                return res.json({status: false, message: "Incorrect Login or Password.<br>Please try again."})
            }
            return res.json({status: true})
        }
        let data = {
            uname: uname,
            password: psw,
        }
        if (doc == null) {
            credentials.insertOne(data);
            if (validator.validate(uname)){
                return res.json({status: true})
            } else {
                return res.json({status: false, message: "That email is invalid.<br>Please try again."})
            }
        } else if (doc != null) {
            return res.json({status: false, message: "That email is already in our system.<br>Please try again."})
        }
        return res.json({status: false, message: "An error occured.<br>Please try again."})
    })
})


app.post("/add", (req, res) => {
    let data = req.body;
    waiting = data;
})

async function a(query){
    let cursor = dreams.find(query);
    let b = await cursor.toArray();
    return b;
}

app.post("/query", (req, res) => {
    let query = req.body;
    let key = Object.keys(query)[0]
    let value = Object.values(query)[0]
    let a = dreams.find({});
    a.toArray().then(function(elements){
        let all = [];
        elements.forEach(element => {
            let k = Object.keys(element).indexOf(key);
            k = Object.values(element)[k];
            console.log(k)
            if (k == value){
                all.push(element);
            }
        });
        console.log(all)
        return res.json({status: true, d: all})
    })
})

app.post("/get", (req, res) => {
    let tags = req.body.tags;
    let a = dreams.find({});
    let objs = [];
    a.toArray().then(function(elements){
        let all = [];
        console.log(tags)
        if (tags == "[]" || tags == []){
            return res.json({status:true, d: elements})
        }
        elements.forEach(element => {
            let t = element.tags;
            if (t.some(r=>tags.includes(r))) {
                all.push(element);
            }
        })
        return res.json({status: true, d: all})
    })
})

app.post("/img", (req, res) => {
    if (waiting === null || waiting == undefined) {
        return res.json({status: false})
    }
    let data = waiting;
    let name = data.title;
    let file = req.files.f.data;
    let path = __dirname + "/public/dream_pics/" + name + ".png";
    let path2 = "/dream_pics/" + name + ".png";
    fs.writeFileSync(path, file);
    data.image = path2;
    console.log(data)
    dreams.insertOne(data);
    waiting = null;
    return res.json({status: true})
})
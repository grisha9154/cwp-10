const express =require('express');
const fs = require('fs');
const app = express();

app.get('/',(req,res)=>{
   res.send('Hello world!!!');
});
app.get('/api/films/readall',readAllFilms);
app.get('/api/films/read',readFilms);

app.listen(3000,()=>{
    console.log("Server listening on port 3000")
});

function readFilms(req,res) {
    fs.readFile("./top250.json",(err,copy)=>{
        let text = JSON.parse(copy);
        let params = req.query;
        for(let i=0;i<text.length;i++){
            if(text[i].id==params.id){
                res.send(text[i]);
                break;
            }
        }
    })
}
function readAllFilms(req, res) {
    fs.readFile("./top250.json",function (err, copy) {
        let text = JSON.parse(copy);
        text.sort(sIncPosition);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify(text));
})}

function sIncPosition(i, ii) {
    if(i.position>ii.position) return 1;
    else if(i.position<ii.position) return -1;
    else return 0;
}
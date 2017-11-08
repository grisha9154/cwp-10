const express =require('express');
const fs = require('fs');
const app = express();

app.use(require('body-parser').json({extend:true}));

app.get('/',(req,res)=>{
   res.send('Hello world!!!');
});
app.get('/api/films/readall',readAllFilms);
app.get('/api/films/read',readFilms);
app.post('/api/films/create',createFilms);

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
function createFilms(req, res) {
    fs.readFile("./top250.json",(err,copy)=>{
        let text = JSON.parse(copy);
        const id = text.length;
        const body = req.body;
        if(validBody(body)){
            let value = {
                id:id,
                title:body.title,
                rating:body.rating,
                year:body.year,
                budget:body.budget,
                gross:body.gross,
                poster:body.poster,
                position:body.position
            };
            text = validPosition(value,text);
            const write = fs.createWriteStream("./top250.json");
            write.write(JSON.stringify(text));
            res.send(value);
        }

    })
}

function validPosition(value, text) {
    let key = true;
    for(let i=0;i<text.length;i++){
        if(text[i].position==value.position){
            value = chaingePosition(value,text,i);
            key = false;
            break;
        }
    }
    if(key){
        value.position = (text[text.length-1].position+1);
        text.push(value);
    }
    return text;
}

function chaingePosition(value,text,i) {
     let buf = text;
     text[i] = value;
     for(let j = i;j<text.length;j++){
         text[j+1] = buf[j];
     }
     return value;
}
function validBody(body) {
if(body.title==undefined) return false;
if(body.rating==undefined|| body.rating<0) return false;
if(body.year==undefined||body.year<1900) return false;
if(body.budget==undefined||body.budget<0)return false;
if(body.gross==undefined||body.gross<0)return false;
return true;
}
function sIncPosition(i, ii) {
    if(i.position>ii.position) return 1;
    else if(i.position<ii.position) return -1;
    else return 0;
}
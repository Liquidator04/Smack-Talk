import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
const app = express()
const port = 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/test',(req,res)=>{
    console.log("Atleast this works");
    const options = {
        root: path.join(__dirname)
    };

    res.sendFile('Video-debate-mode/Arena.html',options, function(err){
        if(err){
            console.error('Error sending file:', err);
        } else {
            console.log('Sent: arena.html');
        }
    })
})

app.get('/Arena.html?room=1',(req,res)=>{
    console.log("Entered room=1")
    
    const options = {
        root: path.join(__dirname)
    };

    res.sendFile('Video-debate-mode/Arena.html',options, function(err){
        if(err){
            console.error('Error sending file:', err);
        } else {
            console.log('Sent: index.html');
        }
    })
})  

app.get('/', (req, res) => {    
    const options = {
        root: path.join(__dirname)
    };

    res.sendFile('Video-debate-mode/index.html', options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent: index.html');
        }
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
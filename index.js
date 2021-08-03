const http=require("http");
const fs=require("fs");
const requests=require('requests');
const console = require("console");

const homeFile=fs.readFileSync("home.html", "utf-8");

const replaceVal=(tempval,orgval) =>{
    let temp=tempval.replace("{%temp%}",((orgval.main.temp)-273).toFixed(2));
    temp=temp.replace("{%tempmin%}",((orgval.main.temp_min)-273).toFixed(2));
    temp=temp.replace("{%tempmax%}",((orgval.main.temp_max)-273).toFixed(2));
    temp=temp.replace("{%location%}",orgval.name);
    temp=temp.replace("{%country%}",orgval.sys.country);
    return temp;
};

const server=http.createServer((req,res)=>{
    if(req.url =="/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=9c7409bca6f5eff3a6280f768ac67c62")
.on('data', (chunk) =>{
    const objdata=JSON.parse(chunk);
    const Data=[objdata];
    

    const realData=Data.map((val)=>replaceVal(homeFile,val)).join("");
    res.write(realData);
    
})
.on('end', (err) => {
  if (err) return console.log('connection closed due to errors', err);
  res.end();
  
  
});
}
    
});

server.listen(3000);
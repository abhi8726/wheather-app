const http=require("http");
const fs=require("fs");
const axios=require('axios');
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

const server=http.createServer( async (req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write(homeFile);
    if(req.url === "/"){
        const resp = await axios.get("http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=9c7409bca6f5eff3a6280f768ac67c62")
        const Data=[resp.data];
        const realData=Data.map((val)=>replaceVal(homeFile,val)).join("");
        console.log(realData);
        res.write(realData);
    }
    res.end();
});

server.listen(3000, '127.0.0.1', () => {
    console.log("Server Started!!!")
});
import {readFile,writeFile} from "fs/promises";
import { createServer } from "http";
import crypto from "crypto";
import path from "path";

const PORT = 3008;
 const DATA_FILE =path.join("data" , "links.json");

const serverfile = async(res,filepath,contenttype) => {

    try {
             const data= await readFile(filepath);
                res.writeHead(200,{"Content-Type" :contenttype });
                res.end(data);
            } catch (error) {
                res.writeHead(404,{"Content-Type" :"text/plain" });
                res.end("404 page not found");
                
            }

}

const loadLinks = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    if (data.trim() === "") return {};
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(DATA_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    throw error;
  }
};

const savelinks = async (links) => {
    await writeFile(DATA_FILE,JSON.stringify(links, null, 2));
}


const server = createServer (async(req,res) => {
     console.log("Request URL:", req.url);
    if(req.method==="GET"){
        if(req.url==="/"){
            return serverfile(res,path.join("public","index.html"),"text/html")
        }
        else if(req.url==="/style.css"){
           return serverfile(res,path.join("public","style.css"),"text/css")
        }
        else if(req.url==="/links"){
          const links = await loadLinks();
          res.writeHead (200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(links));

        }
        else{
           const links = await loadLinks();
           const shortcode = req.url.slice(1);
           console.log("link red",req.url);
           if(links[shortcode]){
            res.writeHead(302,{Location : links[shortcode]});
              return res.end();
           }
           else {
     res.writeHead(404, { "Content-Type": "text/plain" });
     return res.end("Shortcode not found");
   }

        }
    }

    if (req.method === "POST" && req.url === "/shorten") {

     const links = await loadLinks();

 let body = "";
req.on("data", (chunk) => {
body = body + chunk;
});
req.on("end", async() => {
console.log(body);
const { url, shortcode } = JSON.parse(body);
if (!url) {
res.writeHead (400, { "Content-Type": "text/plain" });
return res.end("URL is required");
}
const finalshortcode = shortcode || crypto.randomBytes(4).toString("hex");

if (links [finalshortcode]) {
res.writeHead (400, { "Content-Type": "text/plain" });
return res.end("Short code already exists. Please choose another.");
}
 links[finalshortcode] = url;
 await savelinks(links);
 res.writeHead (200, { "Content-Type": "application/json" });
res.end(JSON.stringify({ success: true, shortcode: finalshortcode }));
});
}
}); 
server.listen(PORT, ()=>{
    console.log(`server running at http://localhost:${PORT}`);
})
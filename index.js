const fs = require('fs')
const http = require("http");
const url = require("url");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')

const serve = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.end("this is the overview");
  }
  else if (pathName === "/product") {
    res.end("this is the product");
  } 
  else if(pathName === '/api') {
    const productData = JSON.parse(data)
    res.writeHead(200,{
        'Content-type': 'application/json'
    })
    res.end(data)

  }
  else {
    res.writeHead(404, {
        'Content-Type': 'hello content'
    })
    res.end('<h1>Page not found</h1>')
  }
});

serve.listen(3000, "127.0.0.1", () => {
  console.log("Listening to port 3000");
});

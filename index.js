const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const dataObj = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
);
const slugs = dataObj.map((p) => slugify(p.productName, { lower: true }));

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const replaceTemplate = require('./modules/replaceTemplate');

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el));
    const overview = tempOverview.replace(
      '{%PRODUCT_CARD%}',
      cardsHtml.join('')
    );

    res.end(overview);
  }

  // product
  else if (pathname === '/product') {
    const currentProduct = dataObj[query.id];

    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(replaceTemplate(tempProduct, currentProduct));
  }

  // api
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(dataObj);
  } else {
    res.writeHead(404, {
      'Content-Type': 'hello content',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening to port 3000');
});

const http = require('http');
const fs = require('fs');
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

const server = http.createServer((req, res) => {
    fs.readFile('data.xml', 'utf8', (err, data) => {
        if (err===null){
        const parsexml = new XMLParser();

        const parsedData = parsexml.parse(data);

        let maxR = 0;
        parsedData.exchange.currency.forEach(currency => {
            if (parseFloat(currency.rate) > maxR) {
                maxR = parseFloat(currency.rate);
            }
        });

        const buildxml = new XMLBuilder();

        const xmlForSite = buildxml.build({ data: { max_rate: maxR.toString() } });

        res.writeHead(200, { 'Content-Type': 'application/xml' });
        res.write(xmlForSite);
        res.end();
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error');
            return;
        }
    });
});

const host = "localhost";
const port = 8000;
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
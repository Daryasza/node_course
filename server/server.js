require('dotenv').config();

const http = require('http');
const { DateTime } = require('luxon');

function getDateTime () {
  return DateTime.utc().toString();
};

let id = 0;

http.createServer(function (res, req) {
  if (res.method === "GET" && res.url === '/') {
    id++;

    const intervalOutput = setInterval(() => {
      console.log(id, getDateTime());
    }, process.env.INTERVAL_TIME);
  
    setTimeout(() => {
      clearInterval(intervalOutput);
      req.end(getDateTime());
  
    }, process.env.END_TIMER_MS);

  } else {
    req.end();
  }
  
}).listen(process.env.HTTP_SERVER_PORT);

console.log(`HTTP server running on port ${process.env.HTTP_SERVER_PORT}`);
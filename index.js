const express = require("express");
const log = require("./log");
const app = express();
const port = 3000;

app.use((request, response, next) => {
  const data = { headers: request.headers };
  log.createRequestContext(data);
  next();
});

const nestedFn = () => {
  setTimeout(() => {
    const reqContext = log.getRequestContext();
    console.log(`requestId nest fn`, reqContext.requestId);
  }, 1000);
};
const requestHandler = async (request, response, next) => {
  const reqContext = log.getRequestContext();
  console.log(`requestId`, reqContext.requestId);
  setTimeout(() => {
    const reqContext = log.getRequestContext();
    console.log(`requestId sleep`, reqContext.requestId);
    nestedFn();
  }, 1000);
  response.json(reqContext);
  next();
};

app.get("/", requestHandler);

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`server is listening on ${port}`);
});

const express = require('express');
const app = express();
app.use(express.json());
require("dotenv").config()

const dogRouter = require("./routes/dogs")
const foodRouter = require("./routes/dog-foods")

app.use(express.static('assets'))
app.use((req, res, next) => {
  console.log(req.method)
  console.log(req.url)
  res.on("finish", () => {
    console.log(res.statusCode)
    res.end()
  })
  next()
})

app.use(foodRouter)
app.use(dogRouter)
// For testing purposes, GET /
app.get('/', (req, res) => {

  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});
app.use((res, req, next) => {
  res.status(404)
  res.json({ error: true })

})

app.use((err, req, res, next) => {
  const error = new Error("error")
  const statusCode = err.statusCode || 500
  const message = err.message;
  const stack = err.stack;
  console.log(process.env.NOD_ENV)
  if (process.env.NOD_ENV === "development") {
    return res.json({
      message: message,
      statusCode: statusCode,
    })
  } else {
    // console.log(message, statusCode, stack)
   return res.json({
      message: message,
      statusCode: statusCode,
      stack: stack
    })
  }

})
const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));

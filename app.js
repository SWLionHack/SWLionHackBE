const express = require('express');
const app = express();
const port = process.env.PORT || 8181;

app.get('/', (req, res) => {
  res.send('Hello, Express!, end point /');
});

app.get('/api', (req, res) => {
  res.send('Hello, Express!, end point /api');
});


app.listen(port, () => {
  console.log(`Server running on :${port}`);
});

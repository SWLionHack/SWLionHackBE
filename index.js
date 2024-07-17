const express = require('express');
const app = express();
const port = process.env.PORT || 8181;

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server running on http://soulmate.pe.kr:${port}`);
});

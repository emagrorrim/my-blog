const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./public'));
app.use('/images', express.static('./static/images'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, './public/index.html'))
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("App listening on port " + port);
});
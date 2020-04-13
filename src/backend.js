/* eslint-disable arrow-body-style */
/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonToXml = require('jsontoxml');

const fs = require('fs');
const path = require('path');
const estimator = require('./estimator');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {
    flags: 'a'
  }
);

// App Set Up
app.use(
  morgan(
    (tokens, req, res) => {
      return `${[
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        Math.trunc(tokens['response-time'](req, res)) > 10
          ? `0${Math.trunc(tokens['response-time'](req, res)) > 10}`
          : Math.trunc(tokens['response-time'](req, res)) > 10
      ].join(' ')}ms`;
    },
    {
      stream: accessLogStream
    }
  )
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'frontend')));

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  console.log(req.body);
  fs.readFile(path.join(__dirname, 'access.log'), (__, data) => {
    res.set('Content-Type', 'text/plain');
    console.log(data);
    res.send(data.toString());
  });
});

app.post('/api/v1/on-covid-19/:format?', (req, res) => {
  const { format } = req.params;
  console.log(req.body);
  if (format === 'logs') {
    fs.readFile(path.join(__dirname, 'access.log'), (err, data) => {
      res.set('Content-Type', 'text/plain');
      console.log(data);
      res.send(data);
    });
    return;
  }

  const output = estimator(req.body);

  if (format === 'xml') {
    res.set('Content-Type', 'application/xml');
    console.log(jsonToXml(output));
    res.send(jsonToXml(output));
  } else {
    res.json(output);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

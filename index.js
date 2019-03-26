const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

server.use(express.json());
server.use(helmet());

const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);
const zoosUrl = '/api/zoos';
const zoosUrlById = '/api/zoos/:id';

/*
[POST] requires a req.body with fields:
  "name": "string"
*/
server.post(zoosUrl, (req, res) => {
  db('zoos')
    .insert(req.body)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

/*
[GET] requires nothing
*/
server.get(zoosUrl, (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

/*
[GET] requires an existing id in params
*/
server.get(zoosUrlById, (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

/*
[DELETE] requires an existing id in params
*/
server.delete(zoosUrlById, (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

/*
[PUT] requires an existing id in params and a req.body with fields:
  "name": "string"
*/
server.put(zoosUrlById, (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

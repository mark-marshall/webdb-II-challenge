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
  const entry = req.body;
  if (entry.name) {
    db('zoos')
      .insert(entry)
      .then(ids => {
        res.status(201).json(ids);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else {
    res
      .status(404)
      .json({ message: 'please include a name field when creating a new zoo' });
  }
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
      res
        .status(500)
        .json({ message: 'there was an error retrieving the zoos' });
    });
});

/*
[GET] requires an existing id in params
*/
server.get(zoosUrlById, (req, res) => {
  const id = req.params.id;

  db('zoos')
    .where({ id })
    .then(zoo => {
      if (zoo.length > 0) {
        res.status(200).json(zoo);
      } else {
        res
          .status(404)
          .json({ message: 'no zoos exist with the id you provided' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'there was an error retrieving your zoo' });
    });
});

/*
[DELETE] requires an existing id in params
*/
server.delete(zoosUrlById, (req, res) => {
  const id = req.params.id;

  db('zoos')
    .where({ id })
    .del()
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res
          .status(404)
          .json({ message: 'no zoos exist with the id you provided' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'there was an error deleting your zoo' });
    });
});

/*
[PUT] requires an existing id in params and a req.body with fields:
  "name": "string"
*/
server.put(zoosUrlById, (req, res) => {
  const entry = req.body;
  const id = req.params.id;

  if (entry.name) {
    db('zoos')
      .where({ id })
      .update(entry)
      .then(count => {
        if (count) {
          res.status(200).json(count);
        } else {
          res
            .status(404)
            .json({ message: 'no zoos exist with the id you provided' });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else {
    res
      .status(404)
      .json({ message: 'please include a name field when updating a new zoo' });
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

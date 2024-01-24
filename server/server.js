import express from 'express';
import pkg from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './models/index.js';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import { setupAuthRoutes } from './routes/auth.routes.js';
import { setupUserRoutes } from './routes/user.routes.js';

dotenv.config();

const { json, urlencoded } = pkg;
const app = express();

const port = process.env.PORT || 2023;

var corsOptions = {
  origin: 'http://localhost:4000',
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to  application.' });
});

// set port, listen for requests
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// connect database
const Role = db.role;

mongoose
  .connect(`mongodb://localhost:27017/E-commerce`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

// connect success create collection in database
function initial() {
  // The estimatedDocumentCount() function is quick as it estimates the number of documents in the MongoDB collection. It is used for large collections because this function uses collection metadata rather than scanning the entire collection.

  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: 'admin',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
initial();

setupAuthRoutes(app);
setupUserRoutes(app);

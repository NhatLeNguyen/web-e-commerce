import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import configViewEngine from './config/viewEngine.js';
import initWebRoute from './routes/web.js';
//database
import DatabaseConnector from './config/connectDB.js';
import mongoose from 'mongoose';
//Connect to DB
const dbConnector = new DatabaseConnector();

dotenv.config();
const port = process.env.PORT || 2023;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(cors());

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
    cookie: { maxAge: 10800000 },
  }),
);

//set session
app.get('/set_session', (req, res) => {
  //set a object to session
  let { username, password } = req.body;
  req.session.User = {
    username: username,
    password: password,
  };

  return res.status(200).json({ status: 'success' });
});

//get session
app.get('/get_session', (req, res) => {
  //check session
  console.log(req.session);
  if (req.session.User) {
    return res.status(200).json({ status: 'success', session: req.session.User });
  }
  return res.status(200).json({ status: 'error', session: 'No session' });
});
app.get('/verify-token', (req, res) => {
  //check session
  try {
    var token = req.query.token || req.body.token || '';
    var decode = jwt.verify(token, process.env.TOKEN_KEY);
    return res.status(200).json({ status: 'success', decodeData: decode });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ status: 'Invalid token' });
  }
});

//destroy session
app.get('/destroy_session', (req, res) => {
  //destroy session
  req.session.destroy(function (err) {
    return res.status(200).json({ status: 'success', session: 'cannot access session here' });
  });
});

configViewEngine(app);

app.get('/', (req, res) => {
  console.log(req.query);
  res.send(`hello from server!: ${req.query.a + req.query.b}`);
});

app.post('/login', async (req, res) => {
  //goi db
  console.log('start');
  await dbConnector.connectDB();
  console.log('end');
  // mongoose.Query

  //token

  res.send(`hehe`);
});

initWebRoute(app);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

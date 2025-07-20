import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import {requiresAuth} from './middleware/requiresAuth.js';
import {dbConnect} from './models/db.js';
import {usersRouter} from './routes/user.routes.js';
import {setupSession} from './utils/setupSession.js';

const port = 3000;

// Attempt to connect to the database
try {
  await dbConnect();
} catch (error) {
  console.log('ERROR:', error);
  process.exit(1);
}

// Setup the express server
const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(await setupSession());

// !! Used for testing !!
app.use(express.static('public'));
app.get('/protected', requiresAuth, (req, res) => {
  res.send('You are Authorized');
});

// Add the routes
app.use('/api/v1', usersRouter);

// Run the server
app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});

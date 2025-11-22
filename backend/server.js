// server.js
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import meetRoute from './routes/meet.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.use('/meet', meetRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

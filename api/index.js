import dotenv from 'dotenv';
import routes from './routes'; // Endpoints
import express from "express"; // API 
import morgan from "morgan"; // Logging
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // dev version of logger - just for simpler debugging. 
app.use(routes);

export default {
  path: '/api', // Note that all of this routes through the /api parameter to avoid conflicting with frontend routes.
  handler: app,
}

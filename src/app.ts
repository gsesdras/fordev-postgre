import 'dotenv/config'
import express, {NextFunction, Request, Response} from "express";
import "express-async-errors"
import "reflect-metadata";
import createConnection from "./database";
import { AppError } from "./errors/AppError";
import { router } from "./routes";

createConnection()
const app = express();

app.use(express.json());
app.use(router);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) =>{
  if(err instanceof AppError) {
    return res.status(err.status).json({message: err.message});
  }else{
    return res.status(500).json({message: `Internal server error ${err.message}`});
  }
})

export { app };


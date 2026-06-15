import express, { Request, Response } from 'express';
import cors from 'cors';
import router from "./routes";
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1", router);

app.use('*', (_req: Request, res: Response) => {
    return res.status(404).send({ success: false, message: 'Route not found' });
});

type CustomError = { status?: number };

app.use(async (err: CustomError, _req: any, res: any, next: any) => {
    if (err instanceof SyntaxError && err.status == 400 && 'body' in err) {
        return res.status(400).send({ success: false, message: err.message });
    }
    next();
});

export default app;

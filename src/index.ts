import http from 'http';
import app from './app';
// import { init } from './utils/kafka';
import { createSocketServer } from './utils/socket';

const server = http.createServer(app);

const io = createSocketServer(server);

const { API_PORT, DATABASE_URL } = process.env;
const port = process.env.PORT || API_PORT;

const mongoose = require('mongoose');

function connectToDbAndRunServer() {
    server.listen(port, async () => {
        console.log(`Server is running on port ${port}`);

        await mongoose.connect(DATABASE_URL);
        mongoose.connection.on('error', (error: Error) => console.log(error));
        console.log('Connect to database successfully...');

        // await init();
        // console.log('Kafka initialized successfully...');

        console.log('Web socket connected', !!io);

    });
}

export default connectToDbAndRunServer();

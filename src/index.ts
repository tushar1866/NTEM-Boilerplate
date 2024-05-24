import { connect } from 'mongoose';
import { Server } from 'http';
import app from './app';
import config from './config/config';
import logger from './config/logger';

const { info, error: _error } = logger;
const { mongoose, port } = config;

let server: Server;

connect(mongoose.url).then(() => {
    info('Connected to MongoDB');
    server = app.listen(port, () => {
        info(`Listening to port ${port}`);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: Error) => {
    _error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    info('SIGTERM received');
    if (server) {
        server.close();
    }
});

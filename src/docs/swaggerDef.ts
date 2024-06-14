import { version } from '../../package.json';
import config from '../config/config';

const swaggerDef = {
    openapi: '3.1.0',
    info: {
        title: 'NTEM Boilerplate',
        // title: 'Boilerplate with Node, Typescript, Express, Mongoose to make RESTfull API in one go',

        version,
        license: {
            name: 'MIT',
            url: 'https://github.com/tushar1866/NTEM-Boilerplate/blob/main/LICENSE',
        },
    },
    servers: [
        {
            url: `http://localhost:${config.port}/v1`,
        },
    ],
};

export default swaggerDef;

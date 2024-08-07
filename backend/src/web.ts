import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import api from '@/api';

const swaggerDocument = (() => {
    try {
        return JSON.parse(fs.readFileSync('aur-buildserver-next-backend.json', 'utf8'));
    } catch (e) {
        console.error('Failed to load swagger.json');
        return {};
    }
})();

const app = express();

app.disable('x-powered-by');

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    console.log('Serving static files enabled');
    app.use(express.static(path.join(import.meta.dirname, 'static')));
}

app.get('/aur-openapi.json', (_, res) => {
    res.sendFile('aur-openapi.json', { root: './' });
});

app.get('/aur-buildserver-next-backend.json', (_, res) => {
    res.sendFile('aur-buildserver-next-backend.json', { root: './' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
        urls: [
            {
                url: '/aur-buildserver-next-backend.json',
                name: 'AUR Buildserver Next Backend OpenAPI',
            },
        ],
    },
}));

app.use('/api', api);

app.use('/repo', express.static(path.join(import.meta.dirname, '../', 'data/repository')));

export default app;

import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Configure the app to use Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Circle App API',
            version: '1.0.0',
            description: 'Backend REST API for Circle App',
        },
    },
    apis: ['./src/routes/*.ts', './src/swagger/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const router = Router();
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default router;


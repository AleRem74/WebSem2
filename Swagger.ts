import swaggerJsdoc from 'swagger-jsdoc';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const swaggerOptions: any = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API мероприятий',
      version: '1.0.0',
      description: 'Документация API для управления мероприятиями и пользователями',
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;

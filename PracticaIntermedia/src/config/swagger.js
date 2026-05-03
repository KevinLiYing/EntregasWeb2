// src/config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BildyApp API',
    version: '1.0.0',
    description: 'Documentación de la API de BildyApp',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a5' },
          email: { type: 'string', example: 'user@email.com' },
          name: { type: 'string', example: 'Juan' },
          lastName: { type: 'string', example: 'Pérez' },
          nif: { type: 'string', example: '12345678A' },
          role: { type: 'string', enum: ['admin', 'guest'], example: 'admin' },
          status: { type: 'string', enum: ['pending', 'verified'], example: 'verified' },
          company: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a6' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string', example: 'Calle Mayor' },
              number: { type: 'string', example: '12' },
              postal: { type: 'string', example: '28001' },
              city: { type: 'string', example: 'Madrid' },
              province: { type: 'string', example: 'Madrid' }
            }
          },
          deleted: { type: 'boolean', example: false }
        }
      },
      Company: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a6' },
          name: { type: 'string', example: 'Construcciones S.A.' },
          owner: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a5' },
          logo: { type: 'string', example: 'https://logo.com/logo.png' },
          isFreelance: { type: 'boolean', example: false },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string', example: 'Avenida Central' },
              number: { type: 'string', example: '5' },
              postal: { type: 'string', example: '28002' },
              city: { type: 'string', example: 'Madrid' },
              province: { type: 'string', example: 'Madrid' }
            }
          }
        }
      },
      Client: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a7' },
          name: { type: 'string', example: 'Cliente Ejemplo' },
          cif: { type: 'string', example: 'B12345678' },
          email: { type: 'string', example: 'cliente@email.com' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string', example: 'Calle Falsa' },
              number: { type: 'string', example: '123' },
              postal: { type: 'string', example: '28003' },
              city: { type: 'string', example: 'Madrid' },
              province: { type: 'string', example: 'Madrid' }
            }
          },
          user: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a5' },
          company: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a6' },
          archived: { type: 'boolean', example: false },
          deleted: { type: 'boolean', example: false }
        }
      },
      Project: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a8' },
          name: { type: 'string', example: 'Reforma Local' },
          code: { type: 'string', example: 'PRJ-001' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string', example: 'Calle Nueva' },
              number: { type: 'string', example: '7' },
              postal: { type: 'string', example: '28004' },
              city: { type: 'string', example: 'Madrid' },
              province: { type: 'string', example: 'Madrid' }
            }
          },
          client: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a7' },
          user: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a5' },
          company: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a6' },
          active: { type: 'boolean', example: true },
          archived: { type: 'boolean', example: false },
          deleted: { type: 'boolean', example: false }
        }
      },
      DeliveryNote: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a9' },
          project: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a8' },
          client: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a7' },
          user: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a5' },
          company: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a6' },
          format: { type: 'string', enum: ['material', 'hours'], example: 'material' },
          entries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                worker: { type: 'string', example: '6634e7b2f1a2b2c1d2e3f4a5' },
                material: { type: 'string', example: 'Cemento' },
                hours: { type: 'number', example: 8 },
                quantity: { type: 'number', example: 10 },
                description: { type: 'string', example: 'Entrega de material' }
              }
            }
          },
          workDate: { type: 'string', format: 'date', example: '2026-05-03' },
          signed: { type: 'boolean', example: false },
          signatureUrl: { type: 'string', example: 'https://firma.com/firma.png' },
          pdfUrl: { type: 'string', example: 'https://pdf.com/albaran.pdf' },
          deleted: { type: 'boolean', example: false }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/controllers/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

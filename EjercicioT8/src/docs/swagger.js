
const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'PodcastHub API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerToken: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60f7c0b8e1d2c8a1b8e1d2c8' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Podcast: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60f7c0b8e1d2c8a1b8e1d2c8' },
            title: { type: 'string', example: 'Podcast Title' },
            description: { type: 'string', example: 'A great podcast about tech.' },
            author: { type: 'string', example: '60f7c0b8e1d2c8a1b8e1d2c8' },
            category: { type: 'string', enum: ['tech', 'science', 'history', 'comedy', 'news'], example: 'tech' },
            duration: { type: 'integer', example: 120 },
            episodes: { type: 'integer', example: 1 },
            published: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'jwt.token.here' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Error message' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

export default options;
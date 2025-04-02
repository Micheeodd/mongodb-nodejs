require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./router');
const cookieParser = require('cookie-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./auth.routes');

const app = express();
app.use(cookieParser());
app.use(require('sanitize').middleware);
app.use(express.json());
app.use(cors());

// Configuration Swagger
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Potion API',
        version: '1.0.0',
        description: 'Documentation de l\'API Potion',
      },
      servers: [
        { url: 'http://localhost:3000' },
      ],
      components: {
        schemas: {
          Potion: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'Potion de vie'
              },
              price: {
                type: 'number',
                example: 50
              },
              vendor: {
                type: 'string',
                example: '60d5ec9a8f4a2a001f2e3d4a'
              },
              category: {
                type: 'string',
                example: 'Soins'
              },
              strength: {
                type: 'number',
                example: 7.5
              },
              flavor: {
                type: 'number',
                example: 5.0
              },
              score: {
                type: 'number',
                example: 8.2
              }
            }
          },
          User: {
            type: 'object',
            properties: {
              username: {
                type: 'string',
                example: 'harry'
              },
              password: {
                type: 'string',
                example: 'patronus123'
              }
            }
          }
        },
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: process.env.COOKIE_NAME || 'demo_node+mongo_token'
          }
        }
      }
    },
    apis: ['./router.js', './auth.routes.js'],
  };

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur MongoDB :', err));

app.use('/potions', routes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

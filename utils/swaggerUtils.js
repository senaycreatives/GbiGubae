// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0", // Specify the version of the OpenAPI specification
    info: {
      title: "Gibigubae API", // Title of your API
      version: "1.0.0", // Version of your API
      description: "API documentation for DEC API",
    },
    servers: [
      {
        url: "http://localhost:3000", // Replace with your server URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional: specify the format of the token
          description: "JWT token for authentication",
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply the bearerAuth security scheme globally
      },
    ],
  },
  apis: ["./Routes/*.js"], // Path to the API routes or JS files containing JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  // Serve Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

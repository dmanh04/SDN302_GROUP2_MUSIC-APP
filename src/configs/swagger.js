const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0", // chuẩn OpenAPI 3
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "Tài liệu API cho hệ thống Node.js + Express + MongoDB"
    },
    servers: [
      {
        url: "http://localhost:3000/api", // URL gốc của API
        description: "Local server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.js"], // nơi chứa các route có comment Swagger
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger docs available at: http://localhost:3000/api-docs");
}

module.exports = swaggerDocs;

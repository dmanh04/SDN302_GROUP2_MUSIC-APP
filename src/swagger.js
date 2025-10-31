const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zing MP3 Clone",
      version: "1.0.0",
      description: "Zing MP3 Clone",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Server cục bộ",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
}

const specs = swaggerJsdoc(options)

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
  console.log("📘 Swagger Docs chạy tại: http://localhost:3000/api-docs")
}

module.exports = setupSwagger

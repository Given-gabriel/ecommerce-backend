import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "API docs for the E-commerce backend",
    },
    servers: [{ url: "http://localhost:4000/api" }],
  },
  apis: ["./src/routes/*.js", "./src/swagger/components.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = swaggerUi.serve;
export const swaggerDocsMiddleware = swaggerUi.setup(swaggerSpec);

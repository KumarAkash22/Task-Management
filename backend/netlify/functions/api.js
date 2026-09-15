const serverless = require("serverless-http");

const app = require("../../server");
const connectDB = require("../../config/db");

const serverlessHandler = serverless(app);

module.exports.handler = async (event, context) => {
    await connectDB();
    return serverlessHandler(event, context);
};

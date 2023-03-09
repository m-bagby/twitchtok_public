import serverless from "serverless-http";
import makeApp from "./makeApp.js";
import makeRoutes from "./makeRoutes.js";

const app = makeApp([makeRoutes]);

const handler = serverless(app);

export {handler};
import accessKeyRouter from "./routes/accessTokenRouter.js";
import frontpageRouter from "./routes/frontpageRouter.js";

const makeRoutes = (app) => {
  app.use("/accessToken", accessKeyRouter);
  app.use("/frontpage", frontpageRouter);
};

export default makeRoutes;
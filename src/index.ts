import "source-map-support/register";

import http from "http";
import createServer from "./server";
import { env, isProduction } from "./defaults/env";

createServer().then((app) => {
  const port = parseInt(env.PORT);
  app.set("port", port);
  const server = http.createServer(app);

  server.on("error", (err) => console.log(err));
  server.on("listening", () => {
    if (!isProduction) {
      console.log("Server Running on http://localhost:" + port);
    }
  });
  server.listen(port);
});

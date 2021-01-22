import app from "./app.js";
import "dotenv/config";
function main() {
  // Server port config
  const { FIRST_DEFAULT_PORT, SECOND_DEFAULT_PORT } = process.env;
  const portAssigned = FIRST_DEFAULT_PORT || SECOND_DEFAULT_PORT;
  app.set("port", portAssigned);
  const PORT = app.get("port");

  //Server launcher
  app.listen(PORT, () => {
    try {
      console.log(
        `✅ 🔥🔥🔥 >>>> Server working on PORT ${PORT}  <<<< 🔥🔥🔥 ✅`
      );
    } catch (error) {
      console.log("Server out of service", error);
    }
  });
}

main();

const { app } = require("../src/app");
const config = require("../src/config");
const {load, unload} = require("../src/loader");

async function start() {
  await load();

  const server = app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
  });

  const graceful = async (signal) => {
    console.log(`\n${signal} received. Closing...`);
    server.close(async () => {
      await unload();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => graceful('SIGINT'));
  process.on('SIGTERM', () => graceful('SIGTERM'));
}

start();
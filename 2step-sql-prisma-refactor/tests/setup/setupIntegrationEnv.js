require("dotenv").config({ path: ".env.test" });

const path = require("path");
const { execSync } = require("child_process");

execSync(
  `cross-env DATABASE_URL="${process.env.DATABASE_URL}" npx prisma migrate deploy`,
  {
    cwd: path.resolve(__dirname, "../../"),
    stdio: "inherit",
  }
);

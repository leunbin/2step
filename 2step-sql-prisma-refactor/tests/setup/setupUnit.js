// const path = require("path");
// const { execSync } = require("child_process");

// require("dotenv").config({ path: ".env.test" });
// console.log("🔥 Loaded .env.test →", process.env.DATABASE_URL);

// const projectRoot = path.resolve(__dirname, "../../");

// try {
//   console.log("🚀 Running prisma migrate deploy (TEST DB)...");

//   execSync(
//     `cross-env DATABASE_URL="${process.env.DATABASE_URL}" npx prisma migrate deploy`,
//     {
//       cwd: projectRoot,
//       stdio: "inherit",
//     }
//   );

//   console.log("✅ Migration complete!");
// } catch (e) {
//   console.error("❌ MIGRATION ERROR");
//   console.error(e);
// }

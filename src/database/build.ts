import "dotenv/config";
import format from "../utils/console";
import { initializeDatabase } from ".";

initializeDatabase()
  .then(() => {
    console.log(format.success("Database built successfully"));
  })
  .catch((err) => {
    console.error(err);
    console.log(format.fail("Failed to build database"));
  })
  .finally(() => process.exit());

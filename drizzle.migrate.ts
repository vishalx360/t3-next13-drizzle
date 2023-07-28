import { migrate } from "drizzle-orm/neon-http/migrator";

import { drizzleDB } from "./drizzle";

(async () => {
  await migrate(drizzleDB, { migrationsFolder: "drizzle/migrations" });
})();

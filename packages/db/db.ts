import postgres from 'postgres';
import { Config } from 'sst/node/config';
import { drizzle } from 'drizzle-orm/postgres-js';
// import { migrate } from 'drizzle-orm/postgres-js/migrator';

// for migrations
// const migrationClient = postgres(Config.STAGE === "dev" ? "postgresql://myuser:mypassword@localhost:5432/ctc-cms-db?schema=public" : Config.DB_URL, { max: 1 });
// migrate(drizzle(migrationClient), ...)

// for query purposes
const queryClient = postgres(Config.DB_URL);
const db = drizzle(queryClient);

export default db;
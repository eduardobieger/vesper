import "dotenv/config";

export const config = {
  databaseUrl: process.env.DATABASE_URL!,
  argon2Salt: process.env.ARGON2_SALT!,
};

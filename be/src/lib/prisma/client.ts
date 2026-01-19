import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { config } from "../../utils/config.js";

const dsn = `${config.db.url}`;
const adapter = new PrismaPg({ connectionString: dsn });
const prisma = new PrismaClient({ adapter });

export { prisma }

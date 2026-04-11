const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.event.upsert({
    where: { id: "mode-avion" },
    update: {
      name: "Mode Avion",
      date: new Date("2026-05-16T18:00:00.000Z"),
      location: "Parakou, Benin",
      totalTickets: 150,
    },
    create: {
      id: "mode-avion",
      name: "Mode Avion",
      date: new Date("2026-05-16T18:00:00.000Z"),
      location: "Parakou, Benin",
      totalTickets: 150,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

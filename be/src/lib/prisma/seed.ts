import { USER_ROLE } from "../../generated/prisma/enums.js";
import { Hasher } from "../../utils/hasher.js";
import { prisma } from "./client.js";

async function main() {
    // Clean Up (Order matters)
    await prisma.$executeRaw`
    TRUNCATE TABLE
      "User"
    RESTART IDENTITY CASCADE;
  `;

    await prisma.user.createMany({
        data: [
            {
                username: "udinkantong",
                full_name: "Udin Sumaruddin",
                email: "admin@example.com",
                password: await Hasher.hash("password"),
                role: USER_ROLE.ADMIN,
            },
            {
                username: "jokan",
                full_name: "Joko Anwar",
                email: "joko.anwar@example.com",
                password: await Hasher.hash("password"),
                role: USER_ROLE.USER,
            },
            {
                username: "salsabila",
                full_name: "Salsabila Putri",
                email: "salsabila.putri@example.com",
                password: await Hasher.hash("password"),
                role: USER_ROLE.USER,
            },
            {
                username: "rizkydev",
                full_name: "Rizky Pratama",
                email: "rizky.pratama@example.com",
                password: await Hasher.hash("password"),
                role: USER_ROLE.USER,
            },
            {
                username: "ayudewi",
                full_name: "Ayu Dewi Lestari",
                email: "ayu.dewi@example.com",
                password: await Hasher.hash("password"),
                role: USER_ROLE.USER,
            },
            {
                username: "baguswira",
                full_name: "Bagus Wira Saputra",
                email: "bagus.wira@example.com",
                password: await Hasher.hash("password"),
                role: USER_ROLE.USER,
            },
            {
                username: "nandaputra",
                full_name: "Nanda Putra Wijaya",
                email: "nanda.wijaya@example.com",
                password: await Hasher.hash("password"),
                role: USER_ROLE.USER,
            },
        ],
    });

    console.log("✅ Seeding completed successfully");
}

main()
    .catch((e) => {
        console.error("Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

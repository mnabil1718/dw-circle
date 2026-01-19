import { USER_ROLE } from "../../generated/prisma/enums.js";
import { Hasher } from "../../utils/hasher.js";
import { prisma } from "./client.js";

async function main() {
    //  Clean Up (Order matters)
    await prisma.$executeRaw`
    TRUNCATE TABLE
      "User"
    RESTART IDENTITY CASCADE;
  `;

    // users
    await prisma.user.createMany({
        data: [
            {
                username: "udinkantong",
                full_name: "Udin Sumaruddin",
                email: "admin@example.com",
                password: await Hasher.hash("password"),
                role: USER_ROLE.ADMIN,
            },
        ],
    });


    console.log("Seeding completed successfully");
}

main()
    .catch((e) => {
        console.error("Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

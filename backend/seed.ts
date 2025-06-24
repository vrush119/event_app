import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create some users
  const users = await prisma.user.createMany({
    data: [
     { name: "Vrushali", email: "vrushali@example.com", password: "pass123" },
      { name: "Ankit", email: "ankit@example.com", password: "pass123" },
      { name: "Sana", email: "sana@example.com", password: "pass123" },
      { name: "Dev", email: "dev@example.com", password: "pass123" },

    ],
        skipDuplicates: true,
  });

  // Fetch created users to get their IDs
  const userList = await prisma.user.findMany();

  // Create events and connect users as attendees
  await prisma.event.create({
    data: {
      name: "TechX Hackathon 2025",
      location: "IISc Bangalore",
      startTime: new Date("2025-07-05T10:00:00Z"),
      attendees: {
        connect: [ { id: userList[0].id }, { id: userList[1].id } ],
      },
    },
  });

  await prisma.event.create({
    data: {
      name: "React Native Bootcamp",
      location: "Online",
      startTime: new Date("2025-07-20T09:00:00Z"),
      attendees: {
        connect: [ { id: userList[2].id }, { id: userList[3].id } ],
      },
    },
  });

  await prisma.event.create({
    data: {
      name: "College Fest: Spark 2025",
      location: "PES University",
      startTime: new Date("2025-08-01T10:00:00Z"),
      attendees: {
        connect: [ { id: userList[0].id }, { id: userList[2].id } ],
      },
    },
  });

  console.log("✅ Seed completed.");
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

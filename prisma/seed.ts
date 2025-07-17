import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Regular User",
      email: "user@example.com",
      password,
      role: "USER",
    },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        title: "iPhone 14",
        description: "Brand new iPhone 14",
        price: 999,
        image: "https://example.com/iphone.jpg",
        category: "Electronics",
        sellerId: user.id,
      },
      {
        title: "Gaming Laptop",
        description: "High-end laptop for gaming",
        price: 1800,
        image: "https://example.com/laptop.jpg",
        category: "Computers",
        sellerId: admin.id,
      },
    ],
  });

  console.log("Seeded database with users and products.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

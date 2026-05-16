import "dotenv/config";
import { prisma } from "../src/server/db";

async function main() {
  const c = await prisma.customer.findFirst({
    select: { id: true, displayName: true },
    orderBy: { updatedAt: "desc" },
  });
  if (c) {
    console.log(c.id);
  } else {
    console.log("no-customer");
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

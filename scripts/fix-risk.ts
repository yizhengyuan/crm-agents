import "dotenv/config";
import { prisma } from "../src/server/db";

async function main() {
  const risky = await prisma.customer.findMany({
    where: { hasValueRisk: true },
    select: { id: true, displayName: true },
    orderBy: { updatedAt: "desc" },
  });

  console.log(`Current risky customers: ${risky.length}`);
  console.log(risky.map((c) => c.displayName).join(", "));

  const toKeep = 8;
  if (risky.length > toKeep) {
    const toClear = risky.slice(toKeep);
    console.log(`\nWill clear ${toClear.length} customers, keeping first ${toKeep}:`);
    console.log(toClear.map((c) => c.displayName).join(", "));

    const ids = toClear.map((c) => c.id);
    const result = await prisma.customer.updateMany({
      where: { id: { in: ids } },
      data: { hasValueRisk: false, valueRiskNotes: null },
    });
    console.log(`\nUpdated ${result.count} customers.`);
  } else {
    console.log("No change needed.");
  }

  const after = await prisma.customer.count({ where: { hasValueRisk: true } });
  console.log(`Risky customers after: ${after}`);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

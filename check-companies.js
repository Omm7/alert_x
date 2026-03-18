require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCompanies() {
  const companies = await prisma.company.findMany();
  console.log(JSON.stringify(companies, null, 2));
  await prisma.$disconnect();
}

checkCompanies();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkJobs() {
  try {
    const jobs = await prisma.job.findMany({
      include: { company: true },
      take: 5,
    });

    console.log('\n📊 Jobs in Database:\n');
    jobs.forEach((job, idx) => {
      console.log(`[${idx + 1}] ${job.title}`);
      console.log(`    Company: ${job.company.name}`);
      console.log(`    Logo URL: ${job.company.logoUrl}`);
      console.log(`    Website: ${job.company.website}`);
      console.log('');
    });

    if (jobs.length === 0) {
      console.log('❌ No jobs found in database');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkJobs();

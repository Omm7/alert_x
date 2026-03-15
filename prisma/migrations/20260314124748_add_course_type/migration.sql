-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('BTECH', 'MTECH', 'MCA', 'MBA', 'BE', 'BTech', 'BCA', 'BSC', 'OTHER');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "courseType" "CourseType" NOT NULL DEFAULT 'BTECH';

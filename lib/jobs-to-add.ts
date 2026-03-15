/**
 * Job Postings Configuration
 * 
 * Add your job postings here by copying code from ChatGPT template.
 * Use JOBS_FORMAT_FOR_CHATGPT.md for the template.
 * 
 * After adding jobs, run: npx ts-node scripts/add-jobs.ts
 */

export interface JobData {
  title: string;
  companyName: string;
  location: string;
  salary: string;
  jobType: "FULL_TIME" | "PART_TIME" | "INTERN" | "CONTRACT" | "OFF_CAMPUS";
  category: "SOFTWARE_ENGINEERING" | "DATA_SCIENCE" | "AI_ML" | "CYBERSECURITY" | "INTERNSHIP" | "OFF_CAMPUS_DRIVE";
  courseType: "BTECH" | "MTECH" | "MBA" | "DIPLOMA";
  experienceLevel: "ENTRY" | "MID" | "SENIOR";
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  applyLink: string;
}

export const NEW_JOBS: JobData[] = [
  // ✅ EXAMPLE JOB - DELETE THIS AND ADD YOUR OWN
  {
    title: "Technical Intern",
    companyName: "Agilitz Technologies",
    location: "Bangalore / Bhubaneswar",
    salary: "₹15,000 – ₹20,000 / month",
    jobType: "INTERN",
    category: "SOFTWARE_ENGINEERING",
    courseType: "BTECH",
    experienceLevel: "ENTRY",
    description:
      "Join Agilitz Technologies as a Technical Intern and gain hands-on experience with modern technologies. Work with Java, JavaScript, Python, .NET or C++ in a collaborative environment. You'll be mentored by experienced developers and contribute to real projects.",
    requirements:
      "Java / JavaScript / Python / .NET / C++ / C, Programming Fundamentals & OOP, Basic SQL / Database knowledge, Minimum 6.5 CGPA, No active backlogs",
    responsibilities:
      "Develop and maintain software features, participate in code reviews, write clean and efficient code, collaborate with team members, learn industry best practices",
    benefits:
      "Internship stipend, Performance-based full-time offer, Flexible work hours, Certificate upon completion",
    applyLink: "https://agilitz.com/careers/internship"
  },

  // 👇 ADD YOUR OWN JOBS BELOW (Paste from ChatGPT here)
];

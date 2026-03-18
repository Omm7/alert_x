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
  website?: string; // Optional: company website URL for better logo detection
}

export const NEW_JOBS: JobData[] = [
  {
    title: "Graduate Trainee",
    companyName: "Calix",
    location: "Bangalore (Hybrid)",
    salary: "Not Disclosed",
    jobType: "FULL_TIME",
    category: "CYBERSECURITY",
    courseType: "BTECH",
    experienceLevel: "ENTRY",
    description: "Join Calix as a Graduate Trainee to work on cybersecurity, threat detection, and network security analysis in a hybrid environment.",
    requirements: "Networking (TCP/IP, OSI), Cybersecurity Basics, Python (Basic), Linux, Windows, Packet Analysis (Wireshark), 2024/2025 Batch (CS/IT/Cyber Security/Networking)",
    responsibilities: "Threat detection, Network security analysis, IDS/NIDS monitoring, Cyber threat research",
    benefits: "Hands-on cybersecurity experience, Industry exposure, Learning opportunities, Career growth",
    applyLink: "https://calix.wd1.myworkdayjobs.com/en-US/ExternalInternational/job/Bangalore/Graduate-Trainee_R-11540"
  },

  // 👇 ADD MORE JOBS BELOW
];

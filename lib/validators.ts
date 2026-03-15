import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.email(),
  collegeName: z.string().min(2).max(160),
  graduationYear: z.string().regex(/^\d{4}$/, "Passing Year must be a valid year"),
  branch: z.string().min(2).max(80),
  password: z.string().min(8).max(128),
});

export const sendSignupOtpSchema = signupSchema;

export const verifySignupOtpSchema = z.object({
  email: z.email(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const registerWithVerificationSchema = signupSchema.extend({
  verificationToken: z.string().min(20),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.email(),
});

export const forgotPasswordResetSchema = z
  .object({
    email: z.email(),
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must match",
    path: ["confirmPassword"],
  });

export const companySchema = z.object({
  name: z.string().min(2).max(80),
  logoUrl: z.url(),
  website: z.url(),
});

export const jobSchema = z.object({
  title: z.string().min(1).max(120).optional().default("Job Posting"),
  companyName: z.string().min(1).max(80),
  companyLogoUrl: z.string().url(),
  companyWebsite: z.string().url().optional().default("https://example.com"),
  location: z.string().min(1).max(80),
  salary: z.string().min(1).max(60),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "INTERN", "CONTRACT", "OFF_CAMPUS"]),
  category: z.enum([
    "SOFTWARE_ENGINEERING",
    "DATA_SCIENCE",
    "AI_ML",
    "CYBERSECURITY",
    "INTERNSHIP",
    "OFF_CAMPUS_DRIVE",
  ]),
  courseType: z.enum(["BTECH", "MTECH", "MCA", "MBA", "BE", "BTech", "BCA", "BSC", "OTHER"]),
  experienceLevel: z.enum(["ENTRY", "MID", "SENIOR"]),
  description: z.string().min(1),
  requirements: z.string().min(1).optional().default("See announcement for details"),
  responsibilities: z.string().optional().default(""),
  benefits: z.string().optional().default(""),
  applyLink: z.string().url(),
});

export const subscriptionSchema = z.object({
  jobCategory: z.enum([
    "SOFTWARE_ENGINEERING",
    "DATA_SCIENCE",
    "AI_ML",
    "CYBERSECURITY",
    "INTERNSHIP",
    "OFF_CAMPUS_DRIVE",
  ]),
  location: z.string().min(2).max(80),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "INTERN", "CONTRACT", "OFF_CAMPUS"]),
});

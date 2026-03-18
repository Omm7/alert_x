# 🎯 Automatic Company Logo Detection

> Logo URLs are automatically fetched from **Clearbit** when you add a new job posting

## How It Works

When you add a job to [lib/jobs-to-add.ts](lib/jobs-to-add.ts), the system:

1. **Detects the company name** from the job posting
2. **Generates company domain** (e.g., "Calix" → "calix.com")
3. **Fetches logo URL** from Clearbit API: `https://logo.clearbit.com/{domain}`
4. **Stores in database** for use across the website

## Usage Examples

### Basic (Auto-detect from company name)
```typescript
{
  title: "Software Engineer",
  companyName: "Google",  // Auto-detects: google.com
  location: "New York",
  salary: "₹80,000/month",
  jobType: "FULL_TIME",
  category: "SOFTWARE_ENGINEERING",
  courseType: "BTECH",
  experienceLevel: "MID",
  description: "Join our team...",
  requirements: "Skills required...",
  responsibilities: "You will...",
  benefits: "We offer...",
  applyLink: "https://google.com/careers/apply"
  // Logo auto-fetched from: https://logo.clearbit.com/google.com?size=256
}
```

### With Custom Website (Better logo detection)
```typescript
{
  title: "Backend Developer",
  companyName: "TCS",
  website: "https://www.tcs.com",  // Helps find correct logo
  location: "Bangalore",
  salary: "₹60,000/month",
  jobType: "FULL_TIME",
  category: "SOFTWARE_ENGINEERING",
  courseType: "BTECH",
  experienceLevel: "ENTRY",
  description: "Join Tata Consultancy Services...",
  requirements: "Java, Spring Boot...",
  responsibilities: "Develop and maintain...",
  benefits: "Training, health insurance...",
  applyLink: "https://tcs.com/careers"
  // Logo auto-fetched from: https://logo.clearbit.com/tcs.com?size=256
}
```

## Supported Formats

- **With www**: `https://www.microsoft.com` → Works ✅
- **With https**: `https://amazon.com` → Works ✅
- **Without protocol**: `github.com` → Works ✅
- **Plain domain**: `facebook.com` → Works ✅

All formats are automatically cleaned and converted correctly.

## Fallback Behavior

If Clearbit doesn't have a logo for a company:
- Shows a **placeholder image** with the company name
- Example: `https://via.placeholder.com/150?text=Company`

## Running the Job Posting Script

```bash
# Add jobs with auto-detected logos
node scripts/add-jobs.js

# Or clear all jobs first
node scripts/clear-jobs.js && node scripts/add-jobs.js
```

## What Happens Locally vs Production

### Local Machine
- Logo URLs are **generated** but may not load (network restrictions)
- Data is **stored correctly** in database
- Ready for deployment

### Production (Vercel/Deployed)
- Logo URLs are **fully functional** and display correctly
- Clearbit delivers logos from their CDN
- Real company logos appear on your website

## Tips for Better Logo Detection

1. **Use official company website** when available:
   ```typescript
   website: "https://www.company.com"  // ✅ Better detection
   ```

2. **For startup/small companies** that may not be indexed:
   - Provide the website field
   - Or manually override the logo later

3. **Multi-word companies** are auto-formatted correctly:
   - "Tata Consultancy Services" → "tata.com" (auto-detected)
   - Use website field for better results: `website: "https://www.tcs.com"`

## Logo Database

Each company is stored in the database after first job posting:
- Logo is fetched once
- Reused for all future jobs from that company
- No additional API calls per company

## Clearbit Logo API

**Service**: [Clearbit Logo API](https://clearbit.com/logo)
- **Cost**: Free (no key required)
- **Performance**: CDN-delivered, fast globally
- **Format**: PNG with transparency
- **Size Parameter**: `?size=256` (128, 256, 512 available)

## Example Database Entry

When you run `node scripts/add-jobs.js`:

```
Company created: Calix
  - Name: Calix
  - Website: https://qyvex.com
  - Logo URL: https://logo.clearbit.com/calix.com?size=256
  
Job created: Graduate Trainee
  - Company: Calix (uses logo above)
  - ID: cmmw2sqnj0002u2jw0l4f9v2y
```

---

## Quick Start

1. **Add a job** in [lib/jobs-to-add.ts](lib/jobs-to-add.ts):
   ```typescript
   {
     title: "Your Job",
     companyName: "Your Company",
     // ... other fields
   }
   ```

2. **Run the script**:
   ```bash
   node scripts/add-jobs.js
   ```

3. **Logo is auto-fetched** and stored! ✅

That's it! No manual logo uploads needed. 🎉

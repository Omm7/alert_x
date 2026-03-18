/**
 * Clearbit API Integration
 * Automatically fetches company logos using Clearbit
 * Works globally - no API key required
 */

export async function getCompanyLogoFromBrandfetch(
  companyName: string,
  website?: string
): Promise<string> {
  try {
    // Use provided website if available, otherwise guess from company name
    let domain = website;

    if (!domain) {
      // Convert company name to domain format
      // Example: "Google" -> "google.com"
      const domainGuess = companyName
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');

      domain = `${domainGuess}.com`;
    }

    // Clean up domain (remove https://, www, trailing slash)
    domain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    console.log(`   🔍 Fetching logo for ${companyName} (domain: ${domain})...`);

    // Construct Clearbit logo URL
    // Clearbit will return the actual logo URL or 404
    const logoUrl = `https://logo.clearbit.com/${domain}?size=256`;

    console.log(`   ✅ Logo URL: ${logoUrl}`);

    return logoUrl;
  } catch (error) {
    console.log(
      `   ⚠️  Error generating logo URL: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    // Return placeholder on error
    return `https://via.placeholder.com/150?text=${companyName.split(' ')[0]}`;
  }
}

/**
 * Brandfetch API Integration (Node.js)
 * Fetches company logos using Brandfetch API
 */

require('dotenv').config();

async function getCompanyLogoFromBrandfetch(companyName, website) {
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

    const apiKey = process.env.BRANDFETCH_API_KEY;
    if (!apiKey) {
      throw new Error('BRANDFETCH_API_KEY not set in environment variables');
    }

    console.log(`   🔑 Using Brandfetch API...`);

    // Call Brandfetch API v2 endpoint
    const response = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(`   ⚠️  Brandfetch API returned status ${response.status}`);
      const errorText = await response.text();
      console.log(`   Error response: ${errorText}`);
      // Return placeholder on API error
      return `https://via.placeholder.com/150?text=${companyName.split(' ')[0]}`;
    }

    const data = await response.json();
    
    // Extract logo URL from response
    // Brandfetch returns logos array with different types (icon, logo, etc.)
    let logoUrl = null;
    
    if (data.logos && Array.isArray(data.logos) && data.logos.length > 0) {
      // Prefer icon type, then logo type, then first available
      let selectedLogo = data.logos.find(logo => logo.type === 'icon') || 
                        data.logos.find(logo => logo.type === 'logo') ||
                        data.logos[0];
      
      if (selectedLogo && selectedLogo.formats && Array.isArray(selectedLogo.formats) && selectedLogo.formats.length > 0) {
        // Get the first format's src (usually png or jpeg)
        logoUrl = selectedLogo.formats[0].src;
      }
    }

    if (!logoUrl) {
      console.log(`   ⚠️  No logo found in Brandfetch response`);
      return `https://via.placeholder.com/150?text=${companyName.split(' ')[0]}`;
    }

    console.log(`   📍 Logo URL: ${logoUrl.substring(0, 80)}...`);
    console.log(`   ✅ Logo fetched from Brandfetch!`);
    return logoUrl;

  } catch (error) {
    console.log(
      `   ⚠️  Error fetching logo: ${error instanceof Error ? error.message : error.toString()}`
    );
    console.log(`   Debug info:`, error);
    // Return placeholder on error
    return `https://via.placeholder.com/150?text=${companyName.split(' ')[0]}`;
  }
}

module.exports = { getCompanyLogoFromBrandfetch };

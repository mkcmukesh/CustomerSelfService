"use client";
import PageShell from "@/components/layouts/PageShell";

export default function Legal() {
  return (
    <PageShell layout="content">
      <article className="prose max-w-7xl mx-auto p-0 bg-slate-50 p-4 rounded-md shadow-lg">
        <h1>Terms & Conditions</h1>
        
        <p>Here’s a practical, defense-in-depth plan to deter, detect, and take down clones of your company website.

1) Make cloning less useful

Keep secrets server-side: Never expose API keys, business logic, or pricing logic in client JS. Gate sensitive data behind authenticated APIs.

Lock down assets: Use signed/expiring URLs for files (e.g., S3 presigned URLs), and disable public bucket listing.

Minify & remove source maps: Ship minified JS/CSS and don’t publish *.map files in production.

Subresource Integrity (SRI) for 3rd-party scripts to stop clone sites from swapping them.

2) Make mirroring harder

CSP & framing controls: Set strict Content-Security-Policy and X-Frame-Options/frame-ancestors to block click-jacking and iframe mirrors.

CORS: Only allow your own origins. Don’t use * on credentials endpoints.


3) Protect your brand and domain (crucial for phishing clones)


HSTS (with preload) and TLS everywhere to stop SSL-stripping look-alikes.

CAA DNS records: Restrict which CAs can issue certs for your domains.

Defensive registrations: Buy common typos/variations (jindalsteel, jindal-steel, different TLDs) and redirect.

Clear copyright & trademarks in the footer; this strengthens takedowns.

4) Detect clones quickly

CT log monitoring (e.g., crt.sh) for new TLS certs resembling your domain.

Search alerts: Google Alerts on your brand + unique text snippets from your homepage.

Image watermarks (visible or invisible) on high-value media to spot reuse.

Honeypots/canaries: Hidden links or unique email aliases on public pages—if they get traffic or mail, someone scraped/cloned.

Server-side content hashing: Periodically search the web for exact hashes/phrases from your site copy.

5) SEO shielding

Canonical tags and sitemaps help search engines prefer your original.

Robots.txt won’t stop bad actors, but still guide good crawlers.

Fast publication & structured data (schema.org) to establish originality.

6) Disrupt and remove clones (playbook)

Snapshot evidence: Save pages, WHOIS, hosting/IP, and timestamps.

Cut infrastructure:

File DMCA/copyright complaints with the host and CDN.

Report phishing to Google Safe Browsing, Microsoft SmartScreen, and major browsers.

Revoke stolen assets (rotate API keys, invalidate tokens).

Notify search engines: Use webmasters’ “Report spam/phishing” and URL removal tools.

Escalate locally (India): report to the host’s abuse desk and, if phishing/financial harm, to CERT-In and your payment partners.

7) Concrete headers & settings (quick checklist)

Content-Security-Policy: default-src 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests

X-Frame-Options: DENY (or use frame-ancestors in CSP)

Referrer-Policy: strict-origin-when-cross-origin

Permissions-Policy: restrict camera/mic/geolocation as needed

CORS: allowlist exact origins; no wildcard with credentials

HSTS: max-age=31536000; includeSubDomains; preload

WAF/CDN rules: rate limits, geo rules (if applicable), hotlink blocking

Remove: source maps, verbose error pages, default /admin routes

8) Code & build hygiene

Don’t bundle secrets in .env files that end up in the client.

Separate public vs. private APIs; require auth + RBAC; throttle per API key/IP.

Use hash-based cache busting so stolen assets quickly become stale.

9) Legal templates (use when you find a clone)

DMCA Notice: Identify copyrighted works (your site), provide URLs of the original and infringing copies, include a good-faith statement and your contact, and request removal/disablement.

Trademark Notice: If they use your logo/marks, include trademark registration details and likelihood of confusion.</p>
        <p>…</p>

        <p>Here’s a practical, defense-in-depth plan to deter, detect, and take down clones of your company website.

1) Make cloning less useful

Keep secrets server-side: Never expose API keys, business logic, or pricing logic in client JS. Gate sensitive data behind authenticated APIs.

Lock down assets: Use signed/expiring URLs for files (e.g., S3 presigned URLs), and disable public bucket listing.

Minify & remove source maps: Ship minified JS/CSS and don’t publish *.map files in production.

Subresource Integrity (SRI) for 3rd-party scripts to stop clone sites from swapping them.

2) Make mirroring harder

CSP & framing controls: Set strict Content-Security-Policy and X-Frame-Options/frame-ancestors to block click-jacking and iframe mirrors.

CORS: Only allow your own origins. Don’t use * on credentials endpoints.


3) Protect your brand and domain (crucial for phishing clones)


HSTS (with preload) and TLS everywhere to stop SSL-stripping look-alikes.

CAA DNS records: Restrict which CAs can issue certs for your domains.

Defensive registrations: Buy common typos/variations (jindalsteel, jindal-steel, different TLDs) and redirect.

Clear copyright & trademarks in the footer; this strengthens takedowns.

4) Detect clones quickly

CT log monitoring (e.g., crt.sh) for new TLS certs resembling your domain.

Search alerts: Google Alerts on your brand + unique text snippets from your homepage.

Image watermarks (visible or invisible) on high-value media to spot reuse.

Honeypots/canaries: Hidden links or unique email aliases on public pages—if they get traffic or mail, someone scraped/cloned.

Server-side content hashing: Periodically search the web for exact hashes/phrases from your site copy.

5) SEO shielding

Canonical tags and sitemaps help search engines prefer your original.

Robots.txt won’t stop bad actors, but still guide good crawlers.

Fast publication & structured data (schema.org) to establish originality.

6) Disrupt and remove clones (playbook)

Snapshot evidence: Save pages, WHOIS, hosting/IP, and timestamps.

Cut infrastructure:

File DMCA/copyright complaints with the host and CDN.

Report phishing to Google Safe Browsing, Microsoft SmartScreen, and major browsers.

Revoke stolen assets (rotate API keys, invalidate tokens).

Notify search engines: Use webmasters’ “Report spam/phishing” and URL removal tools.

Escalate locally (India): report to the host’s abuse desk and, if phishing/financial harm, to CERT-In and your payment partners.

7) Concrete headers & settings (quick checklist)

Content-Security-Policy: default-src 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests

X-Frame-Options: DENY (or use frame-ancestors in CSP)

Referrer-Policy: strict-origin-when-cross-origin

Permissions-Policy: restrict camera/mic/geolocation as needed

CORS: allowlist exact origins; no wildcard with credentials

HSTS: max-age=31536000; includeSubDomains; preload

WAF/CDN rules: rate limits, geo rules (if applicable), hotlink blocking

Remove: source maps, verbose error pages, default /admin routes

8) Code & build hygiene

Don’t bundle secrets in .env files that end up in the client.

Separate public vs. private APIs; require auth + RBAC; throttle per API key/IP.

Use hash-based cache busting so stolen assets quickly become stale.

9) Legal templates (use when you find a clone)

DMCA Notice: Identify copyrighted works (your site), provide URLs of the original and infringing copies, include a good-faith statement and your contact, and request removal/disablement.

Trademark Notice: If they use your logo/marks, include trademark registration details and likelihood of confusion.</p>

      </article>
    </PageShell>
  );
}

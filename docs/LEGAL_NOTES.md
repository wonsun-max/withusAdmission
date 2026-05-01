# Legal Notes

This is product planning context, not legal advice. Confirm with Korean privacy counsel before launch.

## Minors

Korea's Personal Information Protection Act requires legal representative consent when a controller needs consent to process the personal information of a child under 14.

Product implication:

- Ask for date of birth or age range during signup.
- If the user is under 14, require legal representative consent before document upload or AI processing.
- For users 14 and older, still write privacy notices in clear language because most users are minors.

Source:

- Korean Law Translation Center, Personal Information Protection Act, Article 22-2.

## Data Region

The preferred product direction is Korea-hosted data storage. If any provider stores or processes data outside Korea, the product needs cross-border processing disclosures and consent handling.

## Retention

The product direction is to retain uploaded documents until account deletion or user deletion request. The production policy must define:

- What is deleted immediately
- What is retained for audit, dispute, tax, security, or legal obligations
- How long retained audit logs remain
- Whether AI logs include personal information

## Sensitive Documents

Passports, family records, residence proof, and identity documents should not be collected unless required for eligibility verification or official application preparation. Minimize collection in Phase 1.

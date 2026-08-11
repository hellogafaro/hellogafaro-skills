# workers

Notion worker code lives here when an agent needs executable logic.

Keep reusable API operations in their owning skill. Accounts provider work uses the live API through the self-contained `accounts-operations` skill.

Do not use a Notion worker as a generic SaaS API wrapper when an authenticated CLI or owning service already provides the required operations.

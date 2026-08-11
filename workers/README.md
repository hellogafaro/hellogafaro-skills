# workers

Notion worker code lives here when an agent needs executable logic.

Keep reusable API operations in their owning repo. Accounts Ops provider work belongs in the canonical `hellogafaro/hellogafaro-accounts` repository, whose local checkout is resolved by `accounts-operations`.

Do not use a Notion worker as a generic SaaS API wrapper when an authenticated CLI or owning service already provides the required operations.

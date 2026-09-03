# Shopify

Studio exposes the Shopify Admin API verbatim. The Worker handles auth, `{api_version}` substitution, and rate limiting. The agent calls Shopify's native paths.

## Agent Tool

Pass `connection_id`, `method`, `path`, `params`, and `body` to Studio `connections_execute` or `POST /connections/{connection_id}`. Use `/admin/api/{api_version}/graphql.json` for Admin GraphQL and `/admin/api/{api_version}/<resource>.json` for Admin REST. Put the current stable Admin API version in the path. Do not include the shop domain, auth headers, or tokens.

Upstream: https://shopify.dev/docs/api/admin (Admin REST + Admin GraphQL) and https://shopify.dev/docs/api/usage/versioning. Confirm the latest stable version before a new call.

> Status: REST Admin API is legacy as of 2024-10. New apps after 2025-04 must use GraphQL. Prefer GraphQL whenever possible.

## Endpoint

```text
ANY /accounts/{account_id}/connections/shopify/admin/<rest-or-graphql-path>
```

Every path must start with `/admin/`. Studio substitutes `{api_version}` when that placeholder is used, and prepends `https://<credential.domain>` only. The `X-Shopify-Access-Token` header is injected. You may also pass a concrete version such as `/admin/api/2026-07/graphql.json`.

Two surfaces share the same proxy:

- REST → `/admin/api/{api_version}/<resource>.json` (method, query, body forwarded as-is).
- GraphQL → `POST /admin/api/{api_version}/graphql.json` with `{"query":"...","variables":{...}}`.

## Token-saving conventions

- REST `?fields=id,name,total_price,line_items` — sparse top-level fields.
- REST cursor pagination: `?limit=250&page_info=<cursor>` (capture `page_info` from the `Link: rel="next"` header).
- GraphQL: project the smallest field set; use `first: 50` with `pageInfo { hasNextPage endCursor }`.
- Filter via GraphQL `query:` argument (e.g. `orders(first: 50, query: "status:open created_at:>=2026-04-01")`) — pushes selection upstream instead of scanning REST.
- Bulk reads for >10k records: `bulkOperationRunQuery` returns a JSONL URL; poll `currentBulkOperation`.

## Rate limit

- REST: leaky bucket, 2 calls/sec (Shopify Plus 4/sec). On a 429/5xx, the Worker retries up to 3 times with a 500 ms backoff base — there is no enforced spacing between successful calls.
- GraphQL: cost-based, 50 points/sec restore, 1000 point cap. Track `extensions.cost.throttleStatus`. Long queries should chunk via cursors.
- Bulk: one bulk query + one bulk mutation per shop concurrently.

## QueryRoot — top-level query fields

All GraphQL reads start at QueryRoot. Key root fields:

| Field | Description |
|---|---|
| `shop` | Store settings, currency, locales, domains, plan, features |
| `order(id)` / `orders(query, first, after, sortKey)` / `ordersCount` | Orders |
| `draftOrder(id)` / `draftOrders(first, query, sortKey)` | Draft orders |
| `product(id)` / `products(first, query, sortKey)` / `productByHandle(handle)` / `productVariant(id)` / `productVariants(first)` | Products and variants |
| `collection(id)` / `collections(first, query, sortKey)` / `collectionByHandle(handle)` | Collections |
| `customer(id)` / `customers(first, query, sortKey)` / `customersCount` | Customers |
| `segment(id)` / `segments(first, query, sortKey)` / `segmentMigrations` / `segmentValueSuggestions` / `customerSegmentMembers(segmentId, query, first)` / `customerSegmentMembersQuery(id)` | Customer segments |
| `inventoryItem(id)` / `inventoryItems(first, query)` / `inventoryLevel(id)` / `inventoryProperties` | Inventory |
| `location(id)` / `locations(first, query, includeLegacy, includeInactive)` / `locationByIdentifier` | Locations |
| `fulfillment(id)` / `fulfillmentOrder(id)` / `fulfillmentOrders(query, first, includeClosed)` / `assignedFulfillmentOrders(assignmentStatus, locationIds)` | Fulfillment |
| `return(id)` | Returns. List via `order.returns` or `fulfillmentOrder.returnableFulfillments`; no QueryRoot `returns(first, query)` connection. |
| `metafield(id)` / `metafields(first, query)` / `metafieldDefinition(id)` / `metafieldDefinitions(ownerType, first)` | Metafields |
| `metaobject(id)` / `metaobjects(type, first, query)` / `metaobjectDefinition(id)` / `metaobjectDefinitions(first)` | Metaobjects |
| `files(first, query)` | File library |
| `webhookSubscription(id)` / `webhookSubscriptions(topics, format, callbackUrl, first)` | Webhooks |
| `discountNode(id)` / `discountNodes(first, query)` / `codeDiscountNode(id)` / `codeDiscountNodes(first, query)` / `automaticDiscountNode(id)` / `automaticDiscountNodes(first, query)` | Discounts |
| `giftCard(id)` / `giftCards(query)` | Gift cards |
| `priceRule(id)` / `priceRules(first, query)` | Legacy price rules |
| `company(id)` / `companies(first, query)` / `companyContact(id)` / `companyLocation(id)` / `companyLocations(first, query)` / `catalog(id)` / `catalogs(type, first)` / `priceList(id)` / `priceLists(first, query)` | B2B |
| `sellingPlanGroup(id)` / `sellingPlanGroups(first, query)` | Selling plan groups (subscriptions) |
| `subscriptionContract(id)` / `subscriptionContracts(first, query)` / `subscriptionDraft(id)` | Subscription contracts |
| `market(id)` / `markets(first, query)` | Markets |
| `publication(id)` / `publications(first)` | Publications / channels |
| `theme(id)` / `themes(first)` / `themeFiles(themeId, filenames, first)` | Themes |
| `article(id)` / `articles(first, query)` / `blog(id)` / `blogs(first, query)` / `page(id)` / `pages(first, query)` | Online store content |
| `urlRedirect(id)` / `urlRedirects(first, query)` | Redirects |
| `scriptTag(id)` / `scriptTags(first, query)` | Script tags (deprecated) |
| `shopifyPaymentsAccount` | Shopify Payments — payouts, disputes, balance, bank accounts |
| `shopLocales` / `availableLocales` / `localizationExtensions` | Locale settings |
| `marketingActivity(id)` / `marketingActivities(first, query)` / `marketingEvents(first, query)` | Marketing activities |
| `bulkOperation(id)` / `currentBulkOperation(type)` | Bulk operation status |
| `abandonedCheckouts(first, query)` / `abandonment(id)` / `abandonmentByAbandonedCheckoutId` | Abandoned checkouts |
| `currentAppInstallation` / `appInstallation(id)` / `appInstallations` | App installations |
| `staffMember(id)` / `staffMembers(first, query)` | Staff members |
| `savedSearch(id)` / `savedSearches(first, query)` / `customerSavedSearch(id)` / `customerSavedSearches(first, query, sortKey)` | Saved searches |
| `webPixel` | Web pixel (app-scoped) |
| `paymentCustomization(id)` / `paymentCustomizations(first)` | Payment customizations |
| `deliveryCustomization(id)` / `deliveryCustomizations(first)` | Delivery customizations |
| `validation(id)` / `validations(first)` | Checkout validations |
| `cartTransform(id)` / `cartTransforms(first)` | Cart transforms |
| `deliveryProfile(id)` / `deliveryProfiles(first)` | Delivery profiles |
| `checkoutProfile(id)` / `checkoutProfiles(first)` | Checkout profiles |
| `storeCreditAccount(id)` / `storeCreditAccounts(first, query)` | Store credit accounts |
| `disputes` | Shopify Payments disputes (alias on QueryRoot) |

## Per-domain catalog

### Orders

- REST: `GET/POST/PUT /admin/api/{api_version}/orders.json` and `/orders/{id}.json`. Subresources: `/orders/{id}/transactions.json`, `/refunds.json`, `/risks.json`, `/events.json`, `/fulfillments.json`. Actions: `/orders/{id}/close.json`, `/open.json`, `/cancel.json`.
- GraphQL queries: `order(id)`, `orders(query, sortKey, first, after)`, `ordersCount`.
- GraphQL mutations:
  - `orderCreate` — create an order programmatically
  - `orderUpdate(input)` — update attributes, tags, metafields, shipping address
  - `orderCancel(id, reason, refund, restock, notifyCustomer)` — cancel an order
  - `orderClose(input)` — close/archive an order
  - `orderOpen(input)` — reopen a closed order
  - `orderMarkAsPaid(input)` — record payment for a manually-paid order
  - `orderCapture(input)` — capture an authorized transaction
  - `orderInvoiceSend(id, email)` — send order invoice email
  - `orderCustomerSet` / `orderCustomerRemove` — change or remove the customer association
  - `refundCreate(input)` — issue a refund (supports idempotency key via `@idempotent` directive, optional in 2026-01, required in 2026-04)
  - `orderRiskAssessmentCreate` — create a fraud risk assessment
  - `orderCreateManualPayment` — record a manual payment
- Order edit flow: `orderEditBegin(id)` → `orderEditAddVariant`, `orderEditAddCustomItem`, `orderEditSetQuantity`, `orderEditAddLineItemDiscount`, `orderEditRemoveLineItemDiscount`, `orderEditAddShippingLine`, `orderEditUpdateShippingLine`, `orderEditRemoveShippingLine` → `orderEditCommit(id, notifyCustomer, staffNote)`.
- Search syntax (GraphQL `query:`): `status:open`, `financial_status:paid`, `fulfillment_status:unfulfilled`, `created_at:>=2026-04-01`, `tag:vip`, `customer_id:123`. Note `status:any` is rejected — omit the `status` clause to include all orders.
- GraphQL Order fields: use `displayFinancialStatus` and `displayFulfillmentStatus`. The legacy scalar `financialStatus` / `fulfillmentStatus` fields were removed; `display*` variants return enum values. Money uses `totalPriceSet { shopMoney { amount currencyCode } }`.

### Draft Orders

- REST: `GET/POST/PUT/DELETE /admin/api/{api_version}/draft_orders.json`, `/draft_orders/{id}/send_invoice.json`, `/draft_orders/{id}/complete.json`.
- GraphQL: `draftOrder(id)`, `draftOrders(first, query, sortKey)`. Mutations:
  - `draftOrderCreate(input)` — create a draft order
  - `draftOrderUpdate(id, input)` — update a draft order (unlinks any in-progress checkout)
  - `draftOrderDelete(input)` — delete a draft order
  - `draftOrderDuplicate(id)` — duplicate a draft order
  - `draftOrderComplete(id, paymentGatewayId, sourceName)` — complete a draft order into an order
  - `draftOrderInvoiceSend(id, email)` — send invoice email with checkout link
  - `draftOrderInvoicePreview(id, email)` — preview invoice email
  - `draftOrderCreateFromOrder(orderId)` — create a draft from an existing order
  - `draftOrderCalculate(input)` — calculate draft totals without persisting

### Products, Variants, Options, Media

- REST: `GET/POST/PUT/DELETE /admin/api/{api_version}/products.json`, `/products/{id}.json`, `/products/{id}/variants.json`, `/variants/{id}.json`. REST images are read-only — use GraphQL media for writes.
- GraphQL queries: `product(id)`, `products(first, query, sortKey)`, `productByHandle(handle)`, `productVariant(id)`, `productVariants(first)`.
- GraphQL mutations:
  - `productCreate(product, media)` — create product with initial variant and media
  - `productUpdate(input)` — update product attributes
  - `productSet(input, synchronous, identifier)` — idempotent upsert; async via `synchronous: false`
  - `productDelete(input)` — permanently delete product and all variants
  - `productDuplicate(productId, newTitle, newStatus, includeImages)` — duplicate product
  - `productJoinSellingPlanGroups(id, sellingPlanGroupIds)` / `productLeaveSellingPlanGroups` — link selling plan groups
  - `productOptionsCreate(productId, options, variantStrategy)` — add options with optional variant creation
  - `productOptionUpdate(productId, option, optionValuesToAdd, optionValuesToUpdate, optionValuesToDelete, variantStrategy)` — update existing options/values
  - `productOptionsReorder(productId, options)` — reorder option positions
  - `productOptionsDelete(productId, optionsToDelete, strategy)` — delete options
  - `productVariantsBulkCreate(productId, variants, media, strategy)` — bulk create variants
  - `productVariantsBulkUpdate(productId, variants)` — bulk update variants
  - `productVariantsBulkDelete(productId, variantsIds)` — bulk delete variants
  - `productVariantsBulkReorder(productId, positions)` — reorder variants
  - `productVariantAppendMedia(productId, variantMedia)` / `productVariantDetachMedia` — associate media with variant
  - `productReorderMedia(id, moves)` / `productUpdateMedia(productId, media)` / `productDeleteMedia(productId, mediaIds)` — media management
  - `publishablePublish(id, input)` / `publishableUnpublish(id, input)` — publish/unpublish to channels

### Collections

- REST: `/custom_collections.json`, `/smart_collections.json`, `/collects.json`, `/collections/{id}/products.json`.
- GraphQL queries: `collection(id)`, `collections(first, query, sortKey)`, `collectionByHandle(handle)`. Field `productsCount` returns `Count` type, requires sub-selection: `productsCount { count }`. Same applies to `customersCount`, `ordersCount`, `productVariantsCount`.
- GraphQL mutations:
  - `collectionCreate(input)` — create collection; `ruleSet` toggles smart vs custom
  - `collectionUpdate(input)` — update collection attributes, rules, sort order
  - `collectionDelete(input)` — delete collection (removes from all channels)
  - `collectionDuplicate(collectionId, newTitle, includeRules)` — duplicate collection
  - `collectionAddProducts(id, productIds)` — add products to manual collection
  - `collectionAddProductsV2(id, productIds)` — async variant returning a job
  - `collectionRemoveProducts(id, productIds)` — remove products from manual collection
  - `collectionReorderProducts(id, moves)` — reorder products within collection
  - `publishablePublish(id, input)` / `publishableUnpublish(id, input)` — publish/unpublish

### Inventory Items and Levels

- REST: `/inventory_items.json`, `/inventory_levels.json`, `/inventory_levels/set.json`, `/inventory_levels/adjust.json`, `/inventory_levels/connect.json`.
- GraphQL queries: `inventoryItem(id)`, `inventoryItems(first, query)`, `inventoryLevel(id)`, `inventoryProperties`.
- GraphQL mutations:
  - `inventoryActivate(inventoryItemId, locationId, available, onHand)` — activate item at location
  - `inventoryDeactivate(inventoryLevelId)` — deactivate item at location
  - `inventoryBulkToggleActivation(inventoryItemId, inventoryItemUpdates)` — activate/deactivate at multiple locations in one call
  - `inventoryItemUpdate(id, input)` — update item attributes (sku, tracked, requiresShipping, harmonizedSystemCode)
  - `inventoryAdjustQuantities(input)` — adjust inventory quantities by delta
  - `inventorySetQuantities(input)` — set absolute quantities (compare-and-set via `compareQuantity` / `ignoreCompareQuantity`)
  - `inventoryMoveQuantities(input)` — move quantities between locations
  - From 2026-04, inventory mutations require an `@idempotent(key:)` directive — on 2026-01 it is optional.

### Locations

- REST: `/locations.json`, `/locations/{id}.json`, `/locations/{id}/inventory_levels.json`.
- GraphQL: `location(id)`, `locationByIdentifier`, `locations(first, query, includeLegacy, includeInactive)`. Mutations:
  - `locationAdd(input)` — add a new location with address, fulfillment settings, metafields
  - `locationEdit(id, input)` — update location name, address, online order fulfillment
  - `locationActivate(locationId)` — activate an inactive location (optional `@idempotent` in 2026-01)
  - `locationDeactivate(locationId, destinationLocationId)` — deactivate and migrate inventory (optional `@idempotent` in 2026-01)
  - `locationDelete(locationId)` — permanently delete a location

### Customers

- REST: `/customers.json`, `/customers/search.json`, `/customers/{id}/addresses.json`, `/customers/{id}/account_activation_url.json`, `/customers/{id}/send_invite.json`.
- GraphQL queries: `customer(id)`, `customers(first, query, sortKey)`, `customersCount`.
- GraphQL mutations:
  - `customerCreate(input)` — create customer with contact info, marketing consent, tax exemptions, metafields, tags
  - `customerUpdate(input)` — update customer attributes
  - `customerSet(input, identifier)` — upsert by id/email/phone
  - `customerDelete(input)` — delete customer (only if no orders placed)
  - `customerMerge(customerOneId, customerTwoId, overrideFields)` — merge two customer records
  - `customerEmailMarketingConsentUpdate(input)` — update email marketing consent
  - `customerSmsMarketingConsentUpdate(input)` — update SMS marketing consent
  - `customerAddTaxExemptions` / `customerRemoveTaxExemptions` / `customerReplaceTaxExemptions`
  - `customerGenerateAccountActivationUrl(customerId)` — one-time activation URL (expires 30 days; legacy accounts only)
  - `customerSendAccountInviteEmail(customerId, email)` — send invite for new customer accounts
  - `customerRequestDataErasure(customerId)` / `customerCancelDataErasure(customerId)` — GDPR erasure request workflow
  - `customerUpdateDefaultAddress`
  - Payment method mutations: `customerPaymentMethodCreditCardCreate(customerId, billingAddress, sessionId)`, `customerPaymentMethodCreditCardUpdate`, `customerPaymentMethodRemoteCreate`, `customerPaymentMethodRevoke`, `customerPaymentMethodSendUpdateEmail`

### Customer Saved Searches

- GraphQL queries: `customerSavedSearch(id)`, `customerSavedSearches(first, query, sortKey: ID | NAME)`.
- Mutations:
  - `savedSearchCreate(input: SavedSearchCreateInput!)` — create a saved search (title + query)
  - `savedSearchUpdate(input: SavedSearchUpdateInput!)` — update a saved search
  - `savedSearchDelete(input: SavedSearchDeleteInput!)` — delete a saved search
- Note: the mutation names are `savedSearch*`, not `customerSavedSearch*`. Sort keys: `ID`, `NAME`.

### Customer Segments

- Queries: `segment(id)`, `segments(first, query, sortKey)`, `segmentMigrations`, `segmentValueSuggestions`, `customerSegmentMembers(segmentId, query, first, sortKey, timezone)`, `customerSegmentMembersQuery(id)`.
- Mutations:
  - `segmentCreate(name, query, parentId)` — create a segment (name must be unique)
  - `segmentUpdate(id, name, query)` — update segment name or ShopifyQL query
  - `segmentDelete(id)` — delete segment
  - `customerSegmentMembersQueryCreate(input: CustomerSegmentMembersQueryInput!)` — async query returning a handle; poll for results

### Fulfillment

REST is restricted; use GraphQL.

- Queries: `fulfillment(id)`, `fulfillmentOrder(id)`, `fulfillmentOrders(query, first, includeClosed)`, `assignedFulfillmentOrders(assignmentStatus, locationIds)`.
- Mutations:
  - `fulfillmentCreate(fulfillment, message)` — create fulfillment against fulfillment orders
  - `fulfillmentCreateV2` — deprecated; use `fulfillmentCreate`
  - `fulfillmentCancel(id)` — cancel a fulfillment
  - `fulfillmentTrackingInfoUpdate(fulfillmentId, trackingInfoInput, notifyCustomer)` — update tracking
  - `fulfillmentEventCreate(fulfillmentEvent)` — add a status event (LABEL_PRINTED, IN_TRANSIT, DELIVERED, etc.)
  - Fulfillment order request flow: `fulfillmentOrderAcceptFulfillmentRequest`, `fulfillmentOrderRejectFulfillmentRequest`, `fulfillmentOrderSubmitFulfillmentRequest`, `fulfillmentOrderAcceptCancellationRequest`, `fulfillmentOrderRejectCancellationRequest`, `fulfillmentOrderSubmitCancellationRequest`
  - `fulfillmentOrderClose(id, message)` — mark in-progress order incomplete; returns control to merchant
  - `fulfillmentOrderOpen(id)` — mark scheduled order as open (from 2026-01 also works for merchant-managed open)
  - `fulfillmentOrderHold(id, fulfillmentHold)` / `fulfillmentOrderReleaseHold(id)` — hold/release
  - `fulfillmentOrderMerge(input)` / `fulfillmentOrderSplit(id, fulfillmentOrderLineItems)` — restructure
  - `fulfillmentOrderMove(id, newLocationId)` — move to another location
  - `fulfillmentOrderLineItemsPreparedForPickup(input)` — mark items ready for pickup
  - `fulfillmentOrdersSetFulfillmentDeadline(fulfillmentOrderIds, fulfillmentDeadline)` — set deadline
  - `fulfillmentOrderReschedule(id, fulfillAt)` — reschedule a scheduled order
  - Scopes split into `*_assigned_fulfillment_orders`, `*_merchant_managed_fulfillment_orders`, `*_third_party_fulfillment_orders`.

### Returns and Reverse Logistics

- Queries: `return(id)` for a single return; there is no `returns(first, query)` connection on QueryRoot. Discover returns via `order.returns(first, query)` or `fulfillmentOrder.returnableFulfillments`.
- Return lifecycle mutations:
  - `returnRequest(input)` — create a return request in `REQUESTED` state (requires merchant approval)
  - `returnCreate(returnInput)` — create a return in `OPEN` state (assumes already approved); auto-creates reverse fulfillment order and sales agreements
  - `returnApproveRequest(input)` — approve a requested return (transitions to `OPEN`)
  - `returnDeclineRequest(input)` — decline a return request
  - `returnProcess(input)` — confirm returned quantities, handle dispositions, optionally issue refunds
  - `returnRefund(input)` — issue a financial refund against a return
  - `returnClose(id)` — mark return complete
  - `returnReopen(id)` — reopen a closed return
  - `returnCancel(id)` — cancel a return before any work begins
  - `removeFromReturn(returnId, returnLineItems, exchangeLineItems)` — remove specific return/exchange line items from a return
- Reverse delivery mutations:
  - `reverseDeliveryCreateWithShipping(reverseFulfillmentOrderId, reverseDeliveryLineItems, trackingInput, labelInput, notifyCustomer)` — create reverse delivery with external shipping info
  - `reverseDeliveryShippingUpdate(reverseDeliveryId, trackingInput, labelInput, notifyCustomer)` — update reverse delivery tracking
- Reverse fulfillment order mutations:
  - `reverseFulfillmentOrderDispose(dispositionInputs)` — dispose reverse fulfillment order line items (restock, trash, return to vendor, etc.)
- Return refund mutation: `returnRefund(input)` handles the financial transfer only (no restocking); use `refundCreate` when restocking is also needed.

### Subscriptions and Selling Plans

Selling plan groups define subscription and deferred purchase options.

- Queries: `sellingPlanGroup(id)`, `sellingPlanGroups(first, query)`, `subscriptionContract(id)`, `subscriptionContracts(first, query)`, `subscriptionDraft(id)`.
- Selling plan group mutations:
  - `sellingPlanGroupCreate(input, resources)` — create group with selling plans and associate products/variants
  - `sellingPlanGroupUpdate(id, input, resources)` — update group
  - `sellingPlanGroupDelete(id)` — delete group
  - `sellingPlanGroupAddProducts(id, productIds)` / `sellingPlanGroupRemoveProducts` — manage product membership
  - `sellingPlanGroupAddProductVariants(id, productVariantIds)` / `sellingPlanGroupRemoveProductVariants` — manage variant membership
- Subscription contract mutations:
  - `subscriptionContractCreate(input)` — create draft for a new subscription (requires customer, billing/delivery policy, payment method)
  - `subscriptionContractAtomicCreate(input)` — create subscription in one step (no draft)
  - `subscriptionContractUpdate(contractId)` — open a draft for editing an existing contract
  - `subscriptionContractProductChange(subscriptionContractId, lineId, input)` — change a product/price on a line
  - `subscriptionContractSetNextBillingDate(contractId, date)` — set next billing date
  - `subscriptionContractPause(subscriptionContractId)` / `subscriptionContractFail` / `subscriptionContractExpire` / `subscriptionContractActivate`
  - `subscriptionBillingAttemptCreate(subscriptionContractId, subscriptionBillingAttemptInput)` — create billing attempt (charge current or specific billing cycle)
  - `subscriptionBillingCycleCharge(subscriptionContractId, billingCycleSelector, inventoryPolicy, paymentProcessingPolicy)` — alternative to `subscriptionBillingAttemptCreate` targeting specific cycle
  - `subscriptionBillingCycleContractEdit(billingCycleInput)` — edit contract for a specific billing cycle
  - `subscriptionBillingCycleContractDraftCommit(draftId)` — commit billing cycle draft
  - `subscriptionBillingCycleContractDraftConcatenate(draftId, concatenatedBillingCycleContracts)` — concatenate contracts
- Subscription draft mutations (incremental editing):
  - `subscriptionDraftUpdate(draftId, input)` — update draft attributes
  - `subscriptionDraftCommit(draftId)` — commit draft to live contract
  - `subscriptionDraftLineAdd(draftId, input)` / `subscriptionDraftLineUpdate` / `subscriptionDraftLineRemove` — manage draft line items
  - `subscriptionDraftDiscountAdd(draftId, input)` / `subscriptionDraftDiscountUpdate` / `subscriptionDraftDiscountRemove` — manage draft discounts
  - `subscriptionDraftDiscountCodeApply(draftId, redeemCode)` — apply a code discount to draft
  - `subscriptionDraftFreeShippingDiscountAdd` / `subscriptionDraftFreeShippingDiscountUpdate`
- Important enums: `SellingPlanCategory` — `SUBSCRIPTION`, `TRY_BEFORE_YOU_BUY`, `PRE_ORDER`, `OTHER`. Billing triggers: `BILLING_POLICY_TYPE` — `FIXED`, `RECURRING`. `SubscriptionBillingAttemptInventoryPolicy`, `SubscriptionBillingAttemptPaymentProcessingPolicy`.

### Markets

- Queries: `market(id)`, `markets(first, query)`.
- Mutations:
  - `marketCreate(input: MarketCreateInput!)` — create a market (pricing, regions, currency, web presence, catalogs)
  - `marketUpdate(id, input: MarketUpdateInput!)` — update market properties
  - `marketDelete(id)` — delete market definition
  - `backupRegionUpdate(region)` — update the fallback region for buyer geolocation
  - `webPresenceCreate(input: WebPresenceCreateInput!)` — create a web presence (domain/subfolder for market)
  - `webPresenceUpdate(id, input: WebPresenceUpdateInput!)` — update web presence
  - `webPresenceDelete(id)` — delete web presence
  - `marketLocalizationsRegister(resourceId, marketLocalizations)` — create/update market-specific localized content
  - `marketLocalizationsRemove(resourceId, marketLocalizationKeys, marketId)` — remove market localizations
  - Deprecated mutations (use `webPresence*` replacements): `marketWebPresenceCreate`, `marketWebPresenceUpdate`, `marketWebPresenceDelete`, `marketRegionsCreate`, `marketRegionDelete`, `marketRegionsDelete`.

### Translations and Localization

- Queries: `shopLocales`, `availableLocales`, `localizationExtensions`, `translatableResource(resourceId)`, `translatableResources(resourceType, first)`, `translatableResourcesByIds(resourceIds)`.
- Mutations:
  - `translationsRegister(resourceId, translations: [TranslationInput!]!)` — register translations for a resource; `TranslationInput` requires `locale`, `key`, `value`, `translatableContentDigest` (and optionally `marketId` for market-specific translations)
  - `translationsRemove(resourceId, translationKeys, locales)` — remove translations
  - `shopLocaleEnable(locale: String!)` — enable a locale for the shop
  - `shopLocaleDisable(locale: String!)` — disable a locale
  - `shopLocaleUpdate(locale, shopLocale)` — update locale settings (primary, published)
  - `localizationExtensionsAdd` / `localizationExtensionsRemove` — manage localization extensions on checkout
- `TranslatableResourceType` enum includes: `PRODUCT`, `PRODUCT_VARIANT`, `PRODUCT_OPTION`, `COLLECTION`, `EMAIL_TEMPLATE`, `ONLINE_STORE_ARTICLE`, `ONLINE_STORE_BLOG`, `ONLINE_STORE_PAGE`, `ONLINE_STORE_MENU`, `ONLINE_STORE_THEME`, `PACKING_SLIP_TEMPLATE`, `PAYMENT_GATEWAY`, `SHOP`, `SHOP_POLICY`, `SMS_TEMPLATE`, `METAOBJECT`, and more.

### Delivery Profiles

- Queries: `deliveryProfile(id)`, `deliveryProfiles(first)`.
- Mutations:
  - `deliveryProfileCreate(profile: DeliveryProfileInput!)` — create a delivery profile with location groups, zones, rates, and product associations
  - `deliveryProfileUpdate(id, profile: DeliveryProfileInput!)` — update profile; supports partial updates via dedicated sub-inputs (`locationGroupsToCreate`, `locationGroupsToUpdate`, `locationGroupsToDelete`, `zonesToCreate`, etc.). Recommended max 5 groups per request.
  - `deliveryProfileRemove(id)` — delete a delivery profile
- `DeliveryProfileInput` covers: `name`, `locationGroupsToCreate/Update/Delete`, `sellingPlanGroupsToAssociate/Dissociate`, `variantsToAssociate/Dissociate`.
- Also: `deliverySettingUpdate(setting)` — update shop-wide shipping origin; `carrierServiceCreate/Update/Delete` — manage carrier service callbacks (for custom shipping rate calculation).

### Web Pixels

- Queries: `webPixel` — returns the app's web pixel (app-scoped; no ID needed).
- Mutations:
  - `webPixelCreate(webPixel: WebPixelInput!)` — activate web pixel extension; `WebPixelInput` must match `settings` schema defined in `shopify.extension.toml`
  - `webPixelUpdate(id, webPixel: WebPixelInput!)` — update pixel settings
  - `webPixelDelete(id)` — delete web pixel
- Required scopes: `write_pixels`. Also requires `read_customer_events` and app-level user permission. Pixel settings are validated against the extension's schema on every write.

### Functions-backed Customizations

#### Cart Transforms (Bundles)

- Mutations:
  - `cartTransformCreate(functionHandle, blockOnFailure, metafields)` — deploy custom bundling logic; `functionHandle` references a deployed Shopify Function
  - `cartTransformDelete(id)` — remove cart transform
- Query: `cartTransform(id)`, `cartTransforms(first)`.

#### Checkout Validations

- Mutations:
  - `validationCreate(functionHandle, enable, metafields, blockOnFailure)` — create checkout validation
  - `validationUpdate(id, enable, metafields, blockOnFailure, functionHandle)` — update validation
  - `validationDelete(id)` — delete validation
- Query: `validation(id)`, `validations(first)`.

#### Payment Customizations

- Mutations:
  - `paymentCustomizationCreate(paymentCustomization: PaymentCustomizationInput!)` — create payment customization backed by a Function
  - `paymentCustomizationUpdate(id, paymentCustomization: PaymentCustomizationInput!)` — update
  - `paymentCustomizationDelete(id)` — delete (returns `deletedId`)
- Query: `paymentCustomization(id)`, `paymentCustomizations(first)`.

#### Delivery Customizations

- Mutations:
  - `deliveryCustomizationCreate(deliveryCustomization: DeliveryCustomizationInput!)` — create delivery customization
  - `deliveryCustomizationUpdate(id, deliveryCustomization: DeliveryCustomizationInput!)` — update
  - `deliveryCustomizationDelete(id)` — delete
- Query: `deliveryCustomization(id)`, `deliveryCustomizations(first)`.

#### Carrier Services (Shipping Rate Callbacks)

- Mutations: `carrierServiceCreate(input)`, `carrierServiceUpdate(input)`, `carrierServiceDelete(id)` — manage external shipping rate providers connecting via callback URL.

### App Billing

- Mutations:
  - `appSubscriptionCreate(name, lineItems, returnUrl, replacementBehavior, trialDays, test)` — create recurring or usage-based subscription; returns `confirmationUrl` for merchant approval. `lineItems` accepts `appRecurringPricingDetails` (fixed interval) or `appUsagePricingDetails` (usage-capped).
  - `appSubscriptionCancel(id, prorate)` — cancel active subscription (prorate issues credit for unused period)
  - `appSubscriptionLineItemUpdate(id, cappedAmount)` — update the capped amount on a usage-based line item
  - `appPurchaseOneTimeCreate(name, price, returnUrl, test)` — one-time charge; returns `confirmationUrl`
  - `appUsageRecordCreate(subscriptionLineItemId, price, description, idempotencyKey)` — record usage against a capped usage line
  - `appCreditCreate(description, amount, test)` — issue a credit to a merchant's Shopify account
- Query: `appInstallation` → `activeSubscriptions`, `allSubscriptions`, `credits`, `oneTimePurchases`.
- Billing intervals: `EVERY_30_DAYS`, `ANNUAL`. Replacement behavior: `STANDARD`, `APPLY_ON_NEXT_BILLING_CYCLE`, `APPLY_IMMEDIATELY`.

### Generic Tags

- Mutations:
  - `tagsAdd(id, tags)` — add tags to any `HasTags` resource (Order, Product, Customer, Collection, DraftOrder, etc.)
  - `tagsRemove(id, tags)` — remove tags from any `HasTags` resource
- These are the universal tag operations; resource-specific tag fields can also be set via the resource's own update mutation (`productUpdate`, `customerUpdate`, etc.).

### Privacy and Customer Data

- Mutations:
  - `customerRequestDataErasure(customerId)` — initiate GDPR erasure request
  - `customerCancelDataErasure(customerId)` — cancel pending erasure request
  - `dataSaleOptOut(email)` — opt a customer out of data sale (CCPA/CPRA compliance); requires `write_privacy_settings` scope; returns `customerId`
- Queries:
  - `customerPrivacySettings` — query shop-level privacy settings (data sale opt-out configuration, consent mode)
- Related: `privacySettingsUpdate` mutation for updating shop privacy settings.

### Discounts

- REST (legacy): `/price_rules.json`, `/price_rules/{id}/discount_codes.json`, `/price_rules/{id}/discount_codes/lookup.json`, `/price_rules/{id}/batch.json`.
- GraphQL queries: `codeDiscountNode(id)`, `codeDiscountNodes(first, query)`, `automaticDiscountNode(id)`, `automaticDiscountNodes(first, query)`, `discountNode(id)`, `discountNodes(first, query)`, `priceRule(id)`, `priceRules(first, query)`.
- Code-discount mutations:
  - `discountCodeBasicCreate(basicCodeDiscount)` / `discountCodeBasicUpdate(id, basicCodeDiscount)` — percentage/fixed-amount code discount
  - `discountCodeBxgyCreate(bxgyCodeDiscount)` / `discountCodeBxgyUpdate` — buy X get Y code discount
  - `discountCodeFreeShippingCreate(freeShippingCodeDiscount)` / `discountCodeFreeShippingUpdate` — free shipping code
  - `discountCodeAppCreate(codeAppDiscount)` / `discountCodeAppUpdate` — Functions-backed code discount
  - `discountCodeActivate(id)` / `discountCodeDeactivate(id)` — toggle code discount
  - `discountCodeRedeemCodeBulkAdd(discountId, codes)` — bulk add redeem codes
  - `discountCodeRedeemCodeBulkDelete(discountId, ids | savedSearchId | search)` — bulk delete codes
  - `discountCodeDelete(id)` — delete code discount
- Automatic-discount mutations:
  - `discountAutomaticBasicCreate(automaticBasicDiscount)` / `discountAutomaticBasicUpdate` — percentage/fixed automatic
  - `discountAutomaticBxgyCreate(automaticBxgyDiscount)` / `discountAutomaticBxgyUpdate` — automatic BXGY
  - `discountAutomaticFreeShippingCreate(freeShippingAutomaticDiscount)` / `discountAutomaticFreeShippingUpdate` — automatic free shipping
  - `discountAutomaticAppCreate(automaticAppDiscount)` / `discountAutomaticAppUpdate` — Functions-backed automatic
  - `discountAutomaticActivate(id)` / `discountAutomaticDeactivate(id)` — toggle automatic discount
  - `discountAutomaticDelete(id)` — delete automatic discount
  - `discountAutomaticBulkDelete(ids | savedSearchId | search)` — bulk delete automatic discounts

### Gift Cards

- REST: `/gift_cards.json`, `/gift_cards/{id}.json`, `/gift_cards/{id}/disable.json`, `/gift_cards/search.json`.
- GraphQL: `giftCard(id)`, `giftCards(first, query)`. Mutations:
  - `giftCardCreate(input: GiftCardCreateInput!)` — create gift card (initialValue, customerId, code, expiresOn, note, recipientAttributes)
  - `giftCardUpdate(id, input: GiftCardUpdateInput!)` — update expiry or note
  - `giftCardDeactivate(id)` — deactivate (irreversible)
  - `giftCardSendNotificationToCustomer(id)` — send notification to owning customer
  - `giftCardSendNotificationToRecipient(id)` — send notification to gift recipient

### Metafields and Metaobjects

- REST metafields: `/metafields.json`, `/{owner}/{owner_id}/metafields.json` for products, customers, orders, etc.
- GraphQL queries: `metafield(id)`, `metafields(first, query)`, `metafieldDefinition(id)`, `metafieldDefinitions(ownerType, first)`, `metaobject(id)`, `metaobjects(type, first, query)`, `metaobjectDefinition(id)`, `metaobjectDefinitions(first)`.
- Metafield mutations:
  - `metafieldsSet(metafields: [MetafieldsSetInput!]!)` — set metafield values regardless of prior existence; max 25 per call, max 10 MB payload; supports `compareDigest` for compare-and-set (opt-in)
  - `metafieldsDelete(metafields: [MetafieldIdentifierInput!]!)` — bulk delete by owner+namespace+key
  - `metafieldDefinitionCreate(definition)` — create a definition with type, validations, access controls
  - `metafieldDefinitionUpdate(definition)` — update definition (name, description, access, validations; type cannot change)
  - `metafieldDefinitionDelete(id, deleteAllAssociatedMetafields)` — delete definition
  - `metafieldDefinitionPin(definitionId)` / `metafieldDefinitionUnpin` — pin/unpin for UI display
- Metaobject mutations:
  - `metaobjectCreate(metaobject: MetaobjectCreateInput!)` — create entry based on existing definition; auto-generates handle if omitted
  - `metaobjectUpdate(id, metaobject: MetaobjectUpdateInput!)` — update fields, handle, capabilities (publishable status); optionally create redirect from old handle
  - `metaobjectUpsert(handle: MetaobjectHandleInput!, metaobject: MetaobjectUpsertInput!)` — create or update by handle
  - `metaobjectDelete(id)` — delete entry and associated metafields
  - `metaobjectBulkDelete(where: MetaobjectBulkDeleteWhereCondition!)` — async bulk delete
  - `metaobjectDefinitionCreate(definition)` — requires `type` and `fieldDefinitions[]` (each with `key`, `type`, optional `name`, `validations`, `required`)
  - `metaobjectDefinitionUpdate(id, definition)` — update definition structure; `resetFieldOrder: true` re-alphabetizes omitted fields
  - `metaobjectDefinitionDelete(id)` — delete definition
  - `standardMetaobjectDefinitionEnable(type)` — enable a standard Shopify metaobject definition (e.g. `color_swatch`, `page`, `product_reference`)

### Files

Two-step upload:

1. `stagedUploadsCreate(input: [StagedUploadInput!]!)` returns `stagedTargets[].url + parameters + resourceUrl`.
2. PUT/POST the file to `url` with the returned form parameters.
3. `fileCreate(files: [{ originalSource: resourceUrl, contentType, alt, filename, duplicateResolutionMode }])`. `contentType`: `IMAGE`, `VIDEO`, `EXTERNAL_VIDEO`, `MODEL_3D`, `FILE`. `fileSize` required for `VIDEO` and `MODEL_3D`. Files process asynchronously — poll `fileStatus`. Max 250 files per call.

Other mutations: `fileUpdate(files)`, `fileDelete(fileIds)`, `fileAcknowledgeUpdateFailed(fileIds)`. Query: `files(first, query)`.

### Online Store (Themes, Blogs, Articles, Pages, Redirects, Script Tags)

- REST: `/themes.json`, `/themes/{id}/assets.json`, `/blogs.json`, `/blogs/{id}/articles.json`, `/articles.json`, `/pages.json`, `/redirects.json`, `/script_tags.json`.
- GraphQL queries: `themes(first)`, `theme(id)`, `themeFiles(themeId, filenames, first)`, `articles(first, query)`, `blogs(first, query)`, `pages(first, query)`, `urlRedirects(first, query)`, `scriptTags(first, query)`.
- Theme mutations:
  - `themeCreate(name, src, role)` — create theme from a ZIP URL
  - `themeUpdate(id, input)` — update theme name or role
  - `themePublish(id)` — publish theme (set as main/live theme). Requires Shopify exemption for write_themes.
  - `themeDelete(id)` — delete theme
  - `themeFilesUpsert(themeId, files)` — create/update theme files (max 50 per call; `body.type`: `TEXT`, `BASE64`, `URL`). **Requires Shopify-granted exemption.**
  - `themeFilesCopy(themeId, files)` — copy files between themes
  - `themeFilesDelete(themeId, files)` — delete theme files
- Content mutations:
  - `articleCreate(article)` / `articleUpdate(id, article)` / `articleDelete(id)` — blog articles
  - `blogCreate(blog)` / `blogUpdate(id, blog)` / `blogDelete(id)` — blogs
  - `pageCreate(page)` / `pageUpdate(id, page)` / `pageDelete(id)` — online store pages
  - `urlRedirectCreate(urlRedirect)` / `urlRedirectUpdate(id, urlRedirect)` / `urlRedirectDelete(id)` — URL redirects
  - `urlRedirectImportCreate(url)` — async import redirects from CSV
  - `urlRedirectBulkDeleteAll` / `urlRedirectBulkDeleteBySearch(search)` / `urlRedirectBulkDeleteByIds(ids)` / `urlRedirectBulkDeleteBySavedSearch(savedSearchId)` — bulk delete redirects
  - `scriptTagCreate(input)` / `scriptTagUpdate(id, input)` / `scriptTagDelete(id)` — script tags (deprecated; sunset for Order status page 2025-08-28; use theme app extensions instead)

### Marketing Activities and Engagements

- GraphQL queries: `marketingActivity(id)`, `marketingActivities(first, query)`, `marketingEvents(first, query)`.
- Mutations:
  - `marketingActivityCreateExternal(input)` — create external marketing activity (UTM-tracked)
  - `marketingActivityUpdateExternal(input, marketingActivityId | remoteId | utm)` — update by id, remoteId, or UTM
  - `marketingActivityUpsertExternal(input)` — create or update external activity
  - `marketingActivityDeleteExternal(marketingActivityId | remoteId)` — delete external activity
  - `marketingActivitiesDeleteAllExternal` — async delete all external activities
  - `marketingEngagementCreate(marketingActivityId | remoteId | channelHandle, marketingEngagement: MarketingEngagementInput!)` — record engagement metrics (impressions, clicks, spend, sessions, sales, orders, etc.)
  - `marketingEngagementsDelete(channelHandle, deleteEngagementsForAllChannels)` — delete engagement records
  - Legacy in-admin `marketingActivityCreate/Update` are deprecated; use the `*External` family.

### Shopify Payments

- GraphQL only (read): `shopifyPaymentsAccount` exposes:
  - `balance { currency, amount }`
  - `payouts(first, query)` — with filters: `payout_date`, `status`; status values: `PAID`, `FAILED`, `PENDING`, `IN_TRANSIT`, `SCHEDULED`
  - `balanceTransactions(first, query)` — types: `CHARGE`, `REFUND`, `DISPUTE`, `RESERVE`, `ADJUSTMENT`, `TRANSFER`, `TRANSFER_FAILURE`, `PAYOUT`, `PAYOUT_FAILURE`
  - `disputes(first, query)` — with filter `id`, `initiated_at`, `status`
  - `bankAccounts` — linked bank accounts for payouts
  - `payoutSchedule` — payout schedule configuration
- No Shopify Payments-specific write mutations.
- Legacy REST reads: `/shopify_payments/balance.json`, `/shopify_payments/payouts.json`, `/shopify_payments/disputes.json`.

### Webhooks

- REST: `/webhooks.json` (CRUD + count).
- GraphQL queries: `webhookSubscription(id)`, `webhookSubscriptions(first, topics, format, callbackUrl)`.
- Mutations:
  - `webhookSubscriptionCreate(topic, webhookSubscription: { callbackUrl, format, includeFields, metafieldNamespaces, filter, uri })` — create HTTPS webhook
  - `webhookSubscriptionUpdate(id, webhookSubscription)` — update webhook
  - `webhookSubscriptionDelete(id)` — delete webhook
  - `eventBridgeWebhookSubscriptionCreate(topic, webhookSubscription: EventBridgeWebhookSubscriptionInput!)` — deliver to AWS EventBridge ARN. Deprecated — use `webhookSubscriptionCreate`.
  - `eventBridgeWebhookSubscriptionUpdate(id, webhookSubscription)` — update EventBridge webhook
  - `pubSubWebhookSubscriptionCreate(topic, webhookSubscription: PubSubWebhookSubscriptionInput!)` — deliver to Google Cloud Pub/Sub (pubSubProject + pubSubTopic). Deprecated — use `webhookSubscriptionCreate`.
  - `pubSubWebhookSubscriptionUpdate(id, webhookSubscription)` — update Pub/Sub webhook
- `WebhookSubscriptionTopic` enum covers all resource events: `ORDERS_CREATE`, `ORDERS_PAID`, `ORDERS_UPDATED`, `ORDERS_FULFILLED`, `ORDERS_CANCELLED`, `PRODUCTS_CREATE`, `PRODUCTS_UPDATE`, `PRODUCTS_DELETE`, `INVENTORY_LEVELS_UPDATE`, `CUSTOMERS_CREATE`, `CUSTOMERS_UPDATE`, `CUSTOMERS_DELETE`, `APP_UNINSTALLED`, `THEMES_PUBLISH`, `COLLECTIONS_UPDATE`, `METAOBJECTS_CREATE`, `SUBSCRIPTION_CONTRACTS_CREATE`, and many more.
- Webhook format: `JSON` (default) or `XML`. The API version for webhook payloads is set at the app level, not per subscription.

### Bulk Operations

- Query exports: `bulkOperationRunQuery(query, groupObjects)` → poll `currentBulkOperation(type: QUERY)`. When `status: COMPLETED`, fetch JSONL from `url`. Requirements: at least one connection field; max 5 connections; max nesting depth 2.
- Mutation imports:
  1. Upload JSONL via `stagedUploadsCreate(input: [{ resource: BULK_MUTATION_VARIABLES, ... }])`.
  2. `bulkOperationRunMutation(mutation, stagedUploadPath, clientIdentifier?)`.
- One bulk query and one bulk mutation per shop concurrently. `bulkOperationCancel(id)` cancels a running operation. Result URLs (`url`, `partialDataUrl`) expire after 7 days. `partialDataUrl` returns partial JSONL on failure. `objectCount` tracks running total; `rootObjectCount` tracks root-level only.
- Polling: `currentBulkOperation` or `bulkOperations(first, query: "status:RUNNING")`.

### B2B (Companies, Contacts, Locations, Catalogs, Price Lists)

- GraphQL queries: `company(id)`, `companies(first, query)`, `companyContact(id)`, `companyLocation(id)`, `companyLocations(first, query)`, `catalog(id)`, `catalogs(type, first)`, `priceList(id)`, `priceLists(first, query)`.
- Company mutations:
  - `companyCreate(input)` — create Company; optionally creates initial CompanyContact and CompanyLocation in one call. Requires `name`.
  - `companyUpdate(companyId, input)` — update company attributes
  - `companyDelete(id)` — delete company
  - `companyAssignMainContact(companyId, companyContactId)` / `companyRevokeMainContact(companyId)` — assign/revoke main contact
- Company contact mutations:
  - `companyContactCreate(companyId, input: CompanyContactInput!)` — create contact and associated customer
  - `companyContactUpdate(companyContactId, input)` — update contact
  - `companyContactDelete(companyContactId)` — delete contact
  - `companyContactsDelete(companyContactIds)` — bulk delete contacts
  - `companyContactRemoveFromCompany(companyContactId)` — remove contact from company without deleting
  - `companyContactAssignRole(companyContactId, roles: [CompanyContactRoleAssign!]!)` / `companyContactRevoke Role` / `companyContactRevokeRoles` — manage contact roles
  - `companyContactSendWelcomeEmail(companyContactId)` — send welcome email
- Company location mutations:
  - `companyLocationCreate(companyId, input)` / `companyLocationUpdate(companyLocationId, input)` / `companyLocationDelete(companyLocationId)` — CRUD
  - `companyLocationAssignAddress(locationId, address, addressTypes)` — set billing/shipping address
  - `companyLocationTaxSettingsUpdate(companyLocationId, taxSettings)` — update tax settings
  - `companyLocationAssignTaxExemptions(companyLocationId, taxExemptions)` — assign tax exemptions
  - `companyLocationAssignRoles(companyLocationId, rolesToAssign)` / `companyLocationRevokeRoles` — manage staff roles on location
  - `companyLocationAssignStaffMembers` — assign staff
  - `companyLocationCatalogCreate(companyLocationId, catalogInput)` — create catalog for location
- Catalog mutations: `catalogCreate(input)`, `catalogUpdate(id, input)`, `catalogDelete(id)`, `catalogContextUpdate(id, context)`.
- Price list mutations:
  - `priceListCreate(input)` — create (`parent.adjustment.type/value`, `currency`, `contextRule`); `adjustment.type`: `PERCENTAGE_DECREASE`, `PERCENTAGE_INCREASE`
  - `priceListUpdate(id, input)` — update price list
  - `priceListDelete(id)` — delete price list
  - `priceListFixedPricesAdd(priceListId, prices: [PriceListPriceInput!]!)` — set fixed per-variant prices (replaces existing for those variants)
  - `priceListFixedPricesDelete(priceListId, variantIds)` — remove fixed prices (reverts to adjustment)
  - `priceListFixedPricesUpdate(priceListId, pricesToAdd, variantIdsToDelete)` — add and remove fixed prices in one call
  - `quantityRulesAdd(priceListId, quantityRules)` / `quantityRulesDelete(priceListId, variantIds)` — manage order quantity minimums/maximums/increments per variant

### Store Credit

- Queries: `storeCreditAccount(id)`, `storeCreditAccounts(first, query)`.
- Mutations:
  - `storeCreditAccountCredit(id, creditInput: StoreCreditAccountCreditInput!)` — credit a store credit account (amount, optional expiry date)
  - `storeCreditAccountDebit(id, debitInput)` — debit from store credit account

### Channels and Publications

- GraphQL queries: `publications(first)`, `publication(id)`, `channels(first)` (legacy alias), `currentAppInstallation { channels }`.
- Mutations:
  - `publicationCreate(input)` — create publication for a channel
  - `publicationUpdate(id, input)` — update publication settings
  - `publicationDelete(id)` — delete publication
  - `publishablePublish(id, input: { publicationId, publishDate })` — publish resource to channel (supports future date for Online Store)
  - `publishableUnpublish(id, input)` — unpublish resource from channel
  - `publishablePublishToCurrentChannel(id)` — publish to the app's own channel

### Shop, Currency, Locales, Policies

- GraphQL: `shop` (root with `name`, `email`, `currencyCode`, `enabledPresentmentCurrencies`, `primaryDomain`, `myshopifyDomain`, `plan`, `paymentSettings`, `shipsToCountries`, `taxesIncluded`, `weightUnit`), `currentAppInstallation`, `staffMembers`, `shopLocales`, `availableLocales`, `localizationExtensions`, `markets`.
- Mutations: `shopLocaleEnable`, `shopLocaleDisable`, `shopLocaleUpdate`, `currencyFormatUpdate`, `shopPolicyUpdate`.
- REST: `/shop.json`, `/policies.json`, `/countries.json`, `/provinces.json`.

### Checkout and Payments

- Abandoned checkout queries: `abandonedCheckouts(first, query)`, `abandonment(id)`, `abandonmentByAbandonedCheckoutId`. Mutations: `abandonmentEmailStateUpdate`, `abandonmentUpdateActivitiesDeliveryStatuses`.
- Checkout profiles: `checkoutProfile(id)`, `checkoutProfiles(first)`. Mutations: `checkoutProfileUpdate(id, input)`, `checkoutAndAccountsConfigurationUpdate(configuration)`.
- Checkout branding: `checkoutBrandingUpsert(checkoutProfileId, checkoutBrandingInput)` — deprecated; use `checkoutAndAccountsConfigurationUpdate`.
- Storefront access tokens: `storefrontAccessToken(id)`, `storefrontAccessTokens`. Mutations: `storefrontAccessTokenCreate(input)`, `storefrontAccessTokenDelete(input)`.

### Abandoned Checkouts

- REST: `/checkouts.json` (read-only abandoned-cart list).
- GraphQL: `abandonedCheckouts(first, query)`, `abandonment(id)`, `abandonmentByAbandonedCheckoutId`. Mutations: `abandonmentEmailStateUpdate`, `abandonmentUpdateActivitiesDeliveryStatuses`.

## Canonical example

GraphQL — last 25 paid orders since 2026-04-01:

```bash
curl -X POST "$PUBLIC_URL/accounts/dunder-mifflin/connections/shopify/admin/api/{api_version}/graphql.json" \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { orders(first: 25, query: \"financial_status:paid created_at:>=2026-04-01\") { edges { node { id name totalPriceSet { shopMoney { amount currencyCode } } } } pageInfo { hasNextPage endCursor } } }"}'
```

## Pitfalls

- Pass the Admin API version in the path (`/admin/api/2026-07/graphql.json` or `/admin/api/{api_version}/graphql.json`). Look up the latest stable version from Shopify versioning docs. Studio prepends the shop domain and injects the access token; it should not hide the version.
- `DraftOrderInput` does not accept a `note` field directly; use `noteAttributes: [{name, value}]` for free-text annotations.
- `productCreate` always creates a default variant. Calling `productVariantsBulkCreate` immediately after with `optionValues: [{ optionName: "Title", name: "Default Title" }]` returns userError "The variant 'Default Title' already exists." Update the existing variant via `productVariantsBulkUpdate`, or pass option values that differ from `Default Title`.
- `customerEmailMarketingConsentUpdate` and `customerSmsMarketingConsentUpdate` may return `customer: null` with an empty `userErrors` array when the access scope or the customer's prior consent state blocks the change. Treat `null` customer as a permission-gated outcome, not a transport error.
- `discountCodeDelete(id)` accepts the generic `gid://shopify/DiscountCodeNode/...` id and works for basic, BXGY, free-shipping, and app code discounts. Use `discountAutomaticDelete` for automatic discounts.
- `bulkOperationRunQuery` succeeds with status `CREATED`. Poll `currentBulkOperation { id status objectCount url errorCode }`. When `status: COMPLETED`, fetch JSONL from the signed `url` (Google Cloud Storage URL valid for ~7 days).
- REST list endpoints default `status=open` for orders. Pass `status=any` for full backfills.
- REST cursor pagination uses the `Link` response header, not a query param. Capture `page_info` from the `rel="next"` URL.
- GraphQL is rate-limited by query cost, not call count. Heavy connections cost more — use sparse fields and filter via `query:`.
- `orderUpdate` cannot edit line items. For order edits use the `orderEditBegin → orderEditAdd... → orderEditCommit` flow.
- GraphQL never returns HTTP 4xx or 5xx for business-rule failures. Always inspect `errors[]` and the operation's `userErrors` array.
- Fulfillments must be created against fulfillment orders. The legacy `POST /orders/{id}/fulfillments.json` is removed.
- Discount codes alone are not enough — every code lives under a price rule (or `discountCodeNode`) that owns the conditions.
- B2B prices are not visible on Storefront API queries; they live behind catalog / price-list GraphQL only.
- Bulk operations are queued one-at-a-time per shop. A second `bulkOperationRunQuery` while one is running returns an error.
- Theme file writes (`themeFilesUpsert`) require a Shopify-granted exemption. Expect denial without it.
- Returns and reverse deliveries are separate concerns: `returnCreate` opens the return; `reverseDeliveryCreateWithShipping` tracks the physical shipment back; `reverseFulfillmentOrderDispose` handles what to do with received items.
- Subscription contract edits follow a draft workflow: `subscriptionContractUpdate` opens a draft, draft mutations modify it, `subscriptionDraftCommit` applies it live.
- `translationsRegister` requires the `translatableContentDigest` hash from fetching the translatable resource first — it cannot be guessed.
- `eventBridgeWebhookSubscriptionCreate` and `pubSubWebhookSubscriptionCreate` are deprecated — use `webhookSubscriptionCreate` with the appropriate endpoint type.
- `savedSearchCreate/Update/Delete` operates on generic saved searches (not the `customerSavedSearch*` name prefix) — the mutation root names are `savedSearch*`.
- `dataSaleOptOut` takes an email address, not a customer ID, and requires `write_privacy_settings` scope.
- Web pixel settings must match the schema in `shopify.extension.toml` exactly — mismatches cause `webPixelCreate`/`webPixelUpdate` to fail.
- Market localizations require fetching `translatableContentDigest` for the resource within the market context before registering translations.

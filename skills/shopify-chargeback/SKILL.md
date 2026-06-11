---
name: shopify-chargeback
description: Use when preparing a Shopify chargeback or dispute response, building dispute evidence, or fighting a payment dispute for an order. Guides gathering every possible proof and assembling one PDF per Shopify field.
---

# shopify-chargeback

Win the dispute by compiling the strongest possible evidence. Guide the user step by step, ask for every signal that helps, read every file, and assemble one self-contained PDF per Shopify upload field. Never submit without explicit approval.

## How Shopify accepts evidence

Shopify gives these inputs. Each file input accepts ONE PDF, max 4 MB.

1. Reason why the dispute is invalid (dropdown, no file)
2. Customer communication (one PDF)
3. Shipping documentation (one PDF)
4. Proof of service (one PDF)
5. Customer activity (text box, no file)
6. Any other evidence (one PDF)

## Output folder and file names

Create one folder for the case, then write exactly these files. Names must match the fields so the user can map them at a glance.

```
~/Downloads/chargeback-<order-number>/
    proof-of-service.pdf
    customer-communication.pdf
    shipping-documentation.pdf
    additional-evidence.pdf
    shopify-claim.pdf          # reference copy of the dispute, not uploaded
```

Each PDF must stand alone. Open every PDF with the same short case summary at the top, because the reviewer may only open one. A single file can appear in more than one PDF when it fits more than one field. For example a photo of the package with the shipping label belongs in both proof of service and shipping documentation.

## Step by step

Ask for each item one at a time. Read and inspect every file before moving on. Tell the user when something is missing and why it would help, so they can go find it.

1. **Dispute PDF.** The Shopify dispute file, often a number like `8807383280.pdf`. Read it. Note cardholder name, reason, disputed amount, date, and card network reason code. Copy it into the folder as `shopify-claim.pdf`.

2. **Dispute reason.** Recommend the correct dropdown option and say why in one sentence. Options: cardholder withdrew the dispute, cardholder was refunded, the purchase was made by the rightful cardholder, other. Most legitimate sales use "the purchase was made by the rightful cardholder."

3. **Order PDF.** The Shopify printable order summary. Note order number, customer, items, total, payment method, and fulfillment status.

4. **Fraud analysis.** The Shopify order risk screenshot. Capture the risk level, AVS result (billing street and ZIP match), CVV, number of payment attempts, IP location, and distance from the shipping address. A Low risk score with a matching billing address is strong proof.

5. **Shipping and delivery.** Shopify shipping summary, carrier tracking, proof of delivery, signature, and any delivery photo.

6. **Product and packaging.** Photos of the product, the packaging, and the shipping label with the customer name and tracking number.

7. **All customer communication.** Ask for every channel: email threads, website chat, WhatsApp, Instagram or Facebook DMs, SMS, phone notes. Any message where the customer acknowledges the order, the purchase, or receipt is the strongest evidence you can get. Translate non English messages and put the translation next to the screenshot.

8. **Customer relationship and activity.** Ask all of these, because they go in the Customer activity text box and prove a real, engaged customer:
   - Is this a repeat customer? How many prior orders, and were any paid with the same card and not disputed?
   - When was the account created, and did the customer log in before the purchase?
   - Is the customer on the newsletter or marketing list?
   - Do they open or click marketing emails?
   - Did they get and open the order confirmation and shipping emails?
   - Any loyalty, reviews, or referrals?

9. **Anything else.** Signed terms or refund policy shown at checkout, contracts, work orders, or any other document that supports the sale.

## Assemble the PDFs

Combine the gathered text and files into the field PDFs. Generate each PDF with whatever reliable method exists on the machine, for example a short inline script using a PDF library, or by building an HTML file and printing it to PDF. Do not depend on a bundled script.

- `proof-of-service.pdf`: case summary, order details, fraud analysis, product and label photo, any contract or accepted terms.
- `customer-communication.pdf`: case summary, then every message thread, each non English screenshot with its English translation and a one line note on what it proves.
- `shipping-documentation.pdf`: case summary, shipping summary, carrier delivery confirmation, package and label photo.
- `additional-evidence.pdf`: case summary, plus anything that did not fit above, such as account history, repeat purchase history, newsletter and email engagement screenshots.

Keep each file under 4 MB. If a file is too large, downscale images before embedding.

## Customer activity text

Write a short paragraph for the text box using the facts from step 8. Lead with the strongest one, such as a repeat customer who paid with the same card before without disputing, or a customer who opened the order emails and logged in before buying.

## Tone for everything the user submits

Write like a real person, not a lawyer.

- No em dashes or en dashes. Use a comma or a new sentence.
- No unnecessary parentheses.
- Short sentences. One idea each.
- Bullet points for lists of facts.
- First person from the merchant. "We shipped the order on..." "The customer told us..."
- Lead with the strongest fact. Make reversing the dispute feel like the obvious call.

## Rules

- Read and inspect every file. Never describe a file you have not opened.
- Compile every available proof. Ask for more when a channel might exist.
- One self contained PDF per field, named to match the field, under 4 MB.
- Translate non English evidence so the reviewer can read the key admissions.
- Never invent facts, quotes, or documents. Persuade only by clear presentation of real evidence.
- Never submit the response or move originals without explicit approval.

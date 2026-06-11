---
name: shopify-chargeback
description: Use when preparing a Shopify chargeback response, building a dispute evidence package, or responding to a Shopify payment dispute for any order.
---

# shopify-chargeback

Guide the user step by step through every Shopify chargeback evidence field. Read and inspect every file they provide. Generate all PDFs with `create-chargeback-pdf`. Never submit anything without explicit approval.

## Output folder

Create a dedicated folder for the case before anything else:

```
~/Downloads/chargeback-<order-number>/
```

All PDFs go there. Pass the full path to `--out` on every script call.

## Quick Start

```bash
# Check which PDF libraries are available
create-chargeback-pdf check

# Build a PDF from mixed text and files
create-chargeback-pdf make \
  --title "Customer Communication" \
  --add-text "WhatsApp conversation with Marioli Salas on June 11, 2026." \
  --add-file ~/Downloads/whatsapp-1.jpeg \
  --add-text "Customer confirms the order arrived and she has it in her hands." \
  --add-file ~/Downloads/whatsapp-2.jpeg \
  --out ~/Downloads/chargeback-12346/customer-communication.pdf
```

## Workflow

Ask for each item one at a time. Inspect every file before moving on.

1. **Shopify claim PDF** — The dispute PDF from Shopify, usually a number like `8807383280.pdf`. Read it. Extract: cardholder name, claim reason, disputed amount, date, card network reason code. Copy it to the output folder as `shopify-claim.pdf`.

2. **Dispute reason** — Based on the claim PDF, recommend the correct Shopify option and explain why in one sentence. Show all four options so the user can confirm:
   - The cardholder withdrew the dispute
   - The cardholder was refunded
   - The purchase was made by the rightful cardholder
   - Other

3. **Order PDF** — The Shopify printable order summary. Read it. Note order number, customer name, items, total, and fulfillment status.

4. **Order risk screenshot** — The Shopify fraud/risk score screenshot from the order page. Read it. Note the risk level. Goes into `order-details.pdf` together with the order PDF.

5. **Customer communication** — WhatsApp, email, or SMS screenshots and files. Read or view each one. Summarize what each file proves. All go into `customer-communication.pdf`.

6. **Shipping documentation** — Shopify shipping summary, carrier tracking PDF, or proof of delivery. Goes into `shipping-documentation.pdf`.

7. **Proof of service** — Signed contract, order confirmation, or work order. For physical goods, note that the shipping PDF usually covers this field and move on.

8. **Customer activity** — Ask about prior orders, logins, or payments from this customer that were not disputed. Write a short plain-language paragraph the user can paste into the Shopify textarea.

9. **Additional evidence** — Product photos, receipts, or any other supporting files. Goes into `additional-evidence.pdf`. Skip this PDF if nothing is provided.

After step 9: write the response narrative, generate `chargeback-summary.pdf`, show the user the full folder contents, and wait for approval.

## PDF outputs

| File | Shopify field |
|------|--------------|
| `shopify-claim.pdf` | Reference copy of the original dispute PDF |
| `order-details.pdf` | Proof of service |
| `customer-communication.pdf` | Customer communication |
| `shipping-documentation.pdf` | Shipping documentation |
| `additional-evidence.pdf` | Any other evidence |
| `chargeback-summary.pdf` | Response narrative and evidence index |

## Tone rules

All text written for submission must sound like a real person wrote it.

- No em dashes or en dashes. Use a comma or a new sentence instead.
- No unnecessary parentheses.
- Short sentences. One idea per sentence.
- Bullet points for lists of facts.
- First person from the merchant: "We shipped the order on...", "The customer told us..."
- Plain language. No legal or formal phrasing.

Bad: "The cardholder — who confirmed receipt via WhatsApp (June 11, 2026) — indicated the charge was canceled by her bank (not by her own will)."

Good:
- The customer confirmed in writing that the order arrived.
- She said her bank canceled the transaction automatically.
- She did not dispute the purchase herself.

## Rules

- Always read and inspect every file the user provides. Do not describe a file you have not opened.
- Create the output folder before generating any PDFs.
- Run `create-chargeback-pdf check` at the start to confirm the rendering mode.
- Never submit the Shopify response or move files without explicit approval.
- If a step is not applicable, note it briefly and move to the next one.

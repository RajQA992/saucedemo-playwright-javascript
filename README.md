# SauceDemo Playwright Automation

Playwright end-to-end automation for the SauceDemo purchase flow, implemented in JavaScript using the Page Object Model.

## Coverage

The test validates the following workflow:

1. Open `https://www.saucedemo.com`.
2. Log in with the valid demo credentials:
   - Username: `standard_user`
   - Password: `secret_sauce`
3. Verify the Inventory page.
4. Sort products by Price: Low to High.
5. Add the cheapest and most expensive products to the cart.
6. Verify the cart count is `2`.
7. Complete checkout.
8. Verify the order confirmation page.
9. Generate a PDF from the checkout order-summary page.
10. Verify the generated PDF contains both product names, both prices, subtotal, tax, and total.

## Prerequisites

- Node.js 18 or newer
- npm
- Internet access to reach SauceDemo and download the Playwright browser

Check the installed versions:

```bash
node --version
npm --version
```

## Installation

From the project root, install the npm dependencies:

```bash
npm install
```

Install the Playwright Chromium browser:

```bash
npx playwright install chromium
```

## Execute Tests

Run the test suite:

```bash
npm test
```

The current Playwright configuration runs headed by default. Run without opening the browser:

```bash
npx playwright test --headed=false
```

Run with the browser visible explicitly:

```bash
npm run test:headed
```

Run in debug mode:

```bash
npm run test:debug
```

## Retry and Failure Artifacts

The configuration retries failed tests once locally and twice when `CI` is set. Failed tests capture screenshots and retain video. A trace is collected on the first retry.

Artifacts are written under:

- `test-results/`: screenshots, videos, traces, and generated PDFs
- `playwright-report/`: HTML report

Open the HTML report with:

```bash
npm run report
```

## PDF Output

The test creates `order-summary.pdf` inside that test run's folder under `test-results/`. The PDF is generated while the checkout order-summary page is open, before the order is submitted. Its extracted text is verified with `pdf-parse`.

## Project Structure

```text
.
|-- pages/
|   |-- CartPage.js
|   |-- CheckoutPage.js
|   |-- InventoryPage.js
|   |-- LoginPage.js
|   `-- OrderConfirmationPage.js
|-- tests/
|   `-- saucedemo-order.spec.js
|-- package.json
|-- package-lock.json
|-- playwright.config.js
`-- README.md
```

## Submit the Complete Source

Submit these source and setup files:

- `pages/`
- `tests/`
- `package.json`
- `package-lock.json`
- `playwright.config.js`
- `README.md`

Do not submit generated or machine-specific folders:

- `node_modules/`
- `playwright-report/`
- `test-results/`

The recipient can recreate the environment by following the Installation and Execute Tests sections above.

On Windows PowerShell, create a clean source zip from the project root with:

```powershell
Compress-Archive -Path pages,tests,package.json,package-lock.json,playwright.config.js,README.md -DestinationPath saucedemo-playwright-source.zip -Force
```

After extracting the zip, the recipient should run:

```powershell
npm install
npx playwright install chromium
npm test
```

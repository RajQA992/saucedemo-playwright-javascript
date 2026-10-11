const { expect, test } = require('@playwright/test');
const fs = require('node:fs');
const pdf = require('pdf-parse');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { LoginPage } = require('../pages/LoginPage');
const { OrderConfirmationPage } = require('../pages/OrderConfirmationPage');

test.describe('SauceDemo order flow', () => {
  test('logs in, orders the price-range products, and validates the PDF summary', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new OrderConfirmationPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.expectDisplayed();
    await inventoryPage.sortByPriceLowToHigh();
    const products = await inventoryPage.getProductNamesAndPrices();
    expect(products).toHaveLength(6);
    expect(products.map((product) => product.price)).toEqual([...products.map((product) => product.price)].sort((a, b) => a - b));

    const cheapest = products[0];
    const mostExpensive = products[products.length - 1];
    expect(cheapest.price).toBeLessThanOrEqual(mostExpensive.price);

    await inventoryPage.addProductToCart(cheapest.name);
    await inventoryPage.addProductToCart(mostExpensive.name);
    await inventoryPage.expectCartCount(2);

    await inventoryPage.openCart();
    await cartPage.expectProducts([cheapest.name, mostExpensive.name]);
    await cartPage.checkout();

    await checkoutPage.completeCustomerInformation('Raj', 'Automation', '500001');
    await checkoutPage.expectSummary([cheapest.name, mostExpensive.name]);
    const summaryDetails = await checkoutPage.getSummaryDetails();

    const pdfPath = testInfo.outputPath('order-summary.pdf');
    await checkoutPage.createPdf(pdfPath);
    expect(fs.existsSync(pdfPath)).toBeTruthy();
    const pdfText = (await pdf(fs.readFileSync(pdfPath))).text;
    expect(pdfText).toContain(cheapest.name);
    expect(pdfText).toContain(mostExpensive.name);
    expect(pdfText).toContain(`$${cheapest.price.toFixed(2)}`);
    expect(pdfText).toContain(`$${mostExpensive.price.toFixed(2)}`);
    expect(pdfText).toContain(summaryDetails.subtotal);
    expect(pdfText).toContain(summaryDetails.tax);
    expect(pdfText).toContain(summaryDetails.total);

    await checkoutPage.finish();
    await confirmationPage.expectDisplayed();


    //uploaded on git


  });
});

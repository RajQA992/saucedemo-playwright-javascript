const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.summaryItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
  }

  async completeCustomerInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async expectSummary(expectedNames) {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.summaryItems).toHaveCount(expectedNames.length);
    for (const name of expectedNames) {
      await expect(this.summaryItems.filter({ hasText: name })).toBeVisible();
    }
  }

  async getSummaryDetails() {
    return {
      subtotal: await this.subtotalLabel.textContent(),
      tax: await this.taxLabel.textContent(),
      total: await this.totalLabel.textContent()
    };
  }

  async createPdf(path) {
    await this.page.pdf({ path, format: 'A4', printBackground: true });
  }

  async finish() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };

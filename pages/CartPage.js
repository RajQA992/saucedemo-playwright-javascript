const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectProducts(names) {
    await expect(this.cartItems).toHaveCount(names.length);
    for (const name of names) {
      await expect(this.cartItems.filter({ hasText: name })).toBeVisible();
    }
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };

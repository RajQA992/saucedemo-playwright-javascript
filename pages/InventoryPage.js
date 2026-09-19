const { expect } = require('@playwright/test');

class InventoryPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productCards = page.locator('[data-test="inventory-item"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async expectDisplayed() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.productCards).toHaveCount(6);
  }

  async sortByPriceLowToHigh() {
    await this.sortDropdown.selectOption('lohi');
  }

  async getProductNamesAndPrices() {
    return this.productCards.evaluateAll((cards) => cards.map((card) => ({
      name: (card.querySelector('[data-test="inventory-item-name"]')?.textContent ?? '').trim(),
      price: Number((card.querySelector('[data-test="inventory-item-price"]')?.textContent ?? '').replace('$', ''))
    })));
  }

  async addProductToCart(name) {
    const product = this.productCards.filter({ hasText: name });
    await product.locator('button').click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async expectCartCount(count) {
    await expect(this.page.locator('[data-test="shopping-cart-badge"]')).toHaveText(String(count));
  }
}

module.exports = { InventoryPage };

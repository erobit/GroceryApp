'use strict';

var GroceriesPage = (function() {

  function GroceriesPage() {
    this.h1 = element(by.tagName('h1'));
    this.item = element(by.id('item'));
    this.quantity = element(by.id('quantity'));
    this.groceryList = element.all(by.repeater('grocery in groceries'));
    this.addButton = element(by.id('add'));
    this.error = element(by.id('error'));
  }

  GroceriesPage.prototype.visit = function() {
    browser.get('/#!/groceries');
  };

  GroceriesPage.prototype.itemAt = function(index) {
    return this.groceryList.get(index).element(by.css('.item'));
  };

  GroceriesPage.prototype.quantityAt = function(index) {
    return this.groceryList.get(index).element(by.css('.quantity'));
  };

  GroceriesPage.prototype.addItem = function(item, quantity) {
    this.item.sendKeys(item);
    this.quantity.sendKeys(quantity);
    this.addButton.click();
  };

  return GroceriesPage;

})();

module.exports = GroceriesPage;


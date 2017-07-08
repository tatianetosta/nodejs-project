// This module that computes the price (along with tax) of the order
// based on the size and toppings chose

class PriceCalculator {
    constructor(size, crust, toppings, priceSizes) {
        this.size     = size;
        this.crust    = crust;
        this.toppings = toppings;

        this.priceSizes = priceSizes;

        this.gts = 0.05;
        this.pts = 0.07;
    }

    calcOrder() {

        var total = 0;
        var priceTopping = 0;

        // Search for the price of the pizza based on the chosen size
        for(var j=0; j < this.priceSizes.length; j++) {

          if(this.priceSizes[j].type == this.size) {
            total = parseFloat(this.priceSizes[j].price);
            priceTopping = parseFloat(this.priceSizes[j].extraTopping);
            break;
          }

        }

        // Add the price of the toppings
        if(this.toppings != undefined) {
          total += priceTopping * this.toppings.length;
        }

        // Add the tax
        total += total * (this.gts + this.pts);

        return parseFloat(total).toFixed(2);
    }
}

//exports.PriceCalculator = PriceCalculator;

module.exports = PriceCalculator;

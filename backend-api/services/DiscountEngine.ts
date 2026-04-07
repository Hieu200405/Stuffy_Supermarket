import jsonLogic from 'json-logic-js';
import DiscountRule, { IDiscountRule } from '../models/DiscountRule';

export interface CartData {
  total: number;
  items: any[];
  userRole?: string;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
}

export class DiscountEngine {
  /**
   * Applies all active discount rules for a given tenant to the cart.
   */
  static async calculateBestDiscount(tenantId: string, cart: CartData): Promise<{ 
    appliedRule: string | null, 
    discountAmount: number 
  }> {
    const rules = await DiscountRule.find({ tenantId, isActive: true }).sort('-priority');
    
    let bestDiscount = 0;
    let bestRule: string | null = null;

    // Enhance cart data with current context
    const context = {
      ...cart,
      dayOfWeek: new Date().getDay(),
      itemCount: cart.items.length,
      hasTech: cart.items.some(i => i.category === 'Tech')
    };

    for (const rule of rules) {
      // Evaluate Rule using JSON Logic
      const isMatch = jsonLogic.apply(rule.logic, context);
      
      if (isMatch) {
        let currentDiscount = 0;
        if (rule.discountType === 'percentage') {
          currentDiscount = (cart.total * rule.discountValue) / 100;
        } else if (rule.discountType === 'fixed') {
          currentDiscount = rule.discountValue;
        }

        if (currentDiscount > bestDiscount) {
          bestDiscount = currentDiscount;
          bestRule = rule.name;
        }
      }
    }

    return { appliedRule: bestRule, discountAmount: bestDiscount };
  }
}

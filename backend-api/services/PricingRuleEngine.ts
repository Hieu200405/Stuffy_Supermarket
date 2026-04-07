import { Web3LoyaltyService } from './Web3LoyaltyService';

/**
 * ⚖️ DYNAMIC PRICE RULE ENGINE
 * Objective: Centralize all pricing logic (Discounts, NFT Benefits, Flash Sales).
 */
export class PricingRuleEngine {
  
  static async calculateFinalPrice(basePrice: number, userWallet?: string): Promise<{ finalPrice: number, appliedDiscounts: string[] }> {
    let finalPrice = basePrice;
    const appliedDiscounts: string[] = [];

    // 1. Check for On-chain Loyalty NFTs (💎 Diamond VIP)
    if (userWallet) {
        const isVip = await Web3LoyaltyService.checkVipNftOwnership(userWallet);
        if (isVip) {
            const nftDiscount = basePrice * 0.20; // 20% off exclusively for NFT holders
            finalPrice -= nftDiscount;
            appliedDiscounts.push("Stuffy Diamond NFT VIP - 20% OFF");
        }
    }

    // 2. Future: Add other rules (Flash Sales, Bulk Discounts) here...

    return { 
        finalPrice: Math.max(0, finalPrice), 
        appliedDiscounts 
    };
  }
}

import { OpenAI } from 'openai';
import { clearCache, getCachedData, cacheData } from '../redis';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'AI_KEY_DEMO' });

/**
 * DYNAMIC VISUAL GENERATION SERVICE
 * Uses Generative AI to create context-aware marketing assets.
 */
export class ImageGenService {
  /**
   * Generates a themed marketing banner for a product.
   * Logic: "Product name" + "User Style Preference" => AI Prompt
   */
  static async generateThemedVisual(productName: string, theme: 'dark' | 'bright' | 'nature' | 'cyberpunk') {
    const cacheKey = `dynamic_visual:${productName.replace(/\s+/g, '_')}:${theme}`;
    
    // 1. Check Cache first (Don't waste $$ on regenerating same visuals)
    const cachedUrl = await getCachedData<string>(cacheKey);
    if (cachedUrl) {
        console.log(`[ImageAI] 📦 Cache hit for ${productName} (${theme})`);
        return cachedUrl;
    }

    console.log(`[ImageAI] 🎨 Generating new ${theme} visual for ${productName}...`);

    try {
      // 2. Construct Elite Prompt
      const stylePrompts = {
        dark: "in a mysterious, moody dark room with elegant rim lighting, luxury lifestyle photography",
        bright: "in a clean, bright minimalist studio with soft natural sunlight, professional catalog shot",
        nature: "surrounded by lush green plants and organic wooden textures, earthy and fresh atmosphere",
        cyberpunk: "with vibrant neon blue and pink lights, futuristic tech lab environment, high-end CGI"
      };

      const prompt = `A professional advertising shot of ${productName} ${stylePrompts[theme]}. 8k resolution, cinematic lighting, photorealistic, premium feel.`;

      // 3. Call OpenAI DALL-E 3
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      });

      const imageUrl = response.data?.[0]?.url;
      if (!imageUrl) throw new Error("Image generation failed");

      // 4. Cache the result for 24 hours
      await cacheData(cacheKey, imageUrl, 86400);
      
      return imageUrl;
    } catch (err: any) {
      console.error("[ImageAI] Error:", err.message);
      // Fallback to a placeholder if AI fails
      return `https://placehold.co/1024x1024/000000/FFFFFF?text=${encodeURIComponent(productName)}+${theme}`;
    }
  }
}

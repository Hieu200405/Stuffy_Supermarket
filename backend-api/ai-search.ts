import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import Product from './models/Product';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'AI_KEY_DEMO' });

// We simulate a Vector Store here for the demo, but provide the Pinecone integration structure
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || 'PN_KEY_DEMO' });

/**
 * AI Contextual Search: Analyzes natural language quest like "Hotpot for 6" 
 * and returns matching product sets using Embeddings + Vector Search.
 */
export const aiContextSearch = async (query: string) => {
    console.log(`[AI Search] Processing query: "${query}"`);

    // 1. In a real world production scenario:
    // const embedding = await openai.embeddings.create({ model: 'text-embedding-3-small', input: query });
    // const vectorResults = await pinecone.index('stuffy-products').query({ vector: embedding.data[0].embedding, topK: 5 });

    // 2. DEMO: Rule-based Semantic fallback (Simulation of AI understanding context)
    // We Map high-level needs to specific inventory categories or product names
    const rules = [
        { 
            keywords: ['lẩu', 'hotpot', 'ăn tối', 'party'], 
            matches: ['Rau', 'Thịt', 'Gia vị lẩu', 'Bún', 'Coca-Cola', 'Nấm']
        },
        { 
            keywords: ['setup', 'work', 'làm việc', 'văn phòng'], 
            matches: ['MacBook', 'Sony WH-1000XM5', 'Chuột', 'Bàn phím']
        }
    ];

    const lowerQuery = query.toLowerCase();
    const foundRule = rules.find(r => r.keywords.some(k => lowerQuery.includes(k)));

    if (foundRule) {
        // Return actual products from DB based on AI mapping
        const products = await Product.find({
            $or: foundRule.matches.map(m => ({ name: { $regex: m, $options: 'i' } }))
        }).limit(8);

        return {
            intent: "Bundle Suggestion",
            reasoning: `Vì bạn muốn ${query}, tôi đề xuất giỏ hàng trọn gói này.`,
            matches: products
        };
    }

    // Default Fallback
    return {
        intent: "General Search",
        reasoning: "Tôi không tìm thấy gói combo phù hợp, đây là các sản phẩm tương tự.",
        matches: await Product.find({}).limit(4)
    };
};

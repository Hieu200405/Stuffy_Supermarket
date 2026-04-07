import express, { Request, Response } from 'express';
import sharp from 'sharp';
import axios from 'axios';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const app = express();
const CACHE_DIR = path.join(__dirname, 'cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

app.use(cors());

app.get('/health', (req, res) => res.send('OK'));

app.get('/optimize', async (req: Request, res: Response) => {
  const imageUrl = req.query.url as string;
  const width = parseInt(req.query.w as string) || 800;
  const quality = parseInt(req.query.q as string) || 80;

  if (!imageUrl) {
    return res.status(400).send('Image URL is required');
  }

  // Create hash for caching
  const hash = crypto.createHash('md5').update(`${imageUrl}-${width}-${quality}`).digest('hex');
  const cachePath = path.join(CACHE_DIR, `${hash}.webp`);

  if (fs.existsSync(cachePath)) {
    console.log(`[Cache Hit] Serving optimized image: ${hash}`);
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return fs.createReadStream(cachePath).pipe(res);
  }

  try {
    console.log(`[Optimize] Fetching and processing: ${imageUrl}`);
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Optimize using Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    // Cache the result
    fs.writeFileSync(cachePath, optimizedBuffer);

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(optimizedBuffer);
  } catch (err: any) {
    console.error('[Error] Image optimization failed:', err.message);
    res.status(500).send('Failed to process image');
  }
});

const PORT = 3009;
app.listen(PORT, () => {
  console.log(`[Image Optimization Service] Running at http://localhost:${PORT}`);
  console.log(`[Cache] Directory: ${CACHE_DIR}`);
});

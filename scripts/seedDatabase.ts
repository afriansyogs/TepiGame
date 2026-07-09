import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!base64Key) {
  console.error("ERROR: FIREBASE_SERVICE_ACCOUNT_KEY not found in .env!");
  process.exit(1);
}

const serviceAccount = JSON.parse(Buffer.from(base64Key, "base64").toString("utf-8"));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const gamesDataPath = path.join(__dirname, '../data/games.json');
const gamesData = JSON.parse(fs.readFileSync(gamesDataPath, 'utf8'));

const mlbbPackages = [
  { amount: 5, bonus: 1, price: 1423, originalPrice: 1575, tag: "PROMO", itemName: "Diamonds", pointsReward: 1 },
  { amount: 12, bonus: 2, price: 3500, tag: "", itemName: "Diamonds", pointsReward: 3 },
  { amount: 50, bonus: 5, price: 14200, tag: "", itemName: "Diamonds", pointsReward: 14 },
  { amount: 85, bonus: 8, price: 21850, tag: "BEST SELLER", itemName: "Diamonds", pointsReward: 21 },
  { amount: 170, bonus: 16, price: 43700, originalPrice: 65800, tag: "PROMO", itemName: "Diamonds", pointsReward: 43 },
  { amount: 296, bonus: 40, price: 76000, originalPrice: 114300, tag: "BEST SELLER", itemName: "Diamonds", pointsReward: 76 },
  { amount: 367, bonus: 34, price: 95000, tag: "", itemName: "Diamonds", pointsReward: 95 },
  { amount: 503, bonus: 53, price: 125000, tag: "", itemName: "Diamonds", pointsReward: 125 },
  { amount: 774, bonus: 74, price: 190000, tag: "", itemName: "Diamonds", pointsReward: 190 },
  { amount: 926, bonus: 86, price: 235000, tag: "", itemName: "Diamonds", pointsReward: 235 },
  { amount: 1159, bonus: 109, price: 285000, tag: "", itemName: "Diamonds", pointsReward: 285 },
  { amount: 1446, bonus: 146, price: 357000, originalPrice: 472000, tag: "PROMO", itemName: "Diamonds", pointsReward: 357 },
  { amount: 1708, bonus: 158, price: 425000, tag: "", itemName: "Diamonds", pointsReward: 425 },
  { amount: 2010, bonus: 210, price: 495000, tag: "", itemName: "Diamonds", pointsReward: 495 },
  { amount: 3000, bonus: 300, price: 730000, tag: "PROMO", itemName: "Diamonds", pointsReward: 730 },
  { amount: 4000, bonus: 450, price: 980000, tag: "BEST SELLER", itemName: "Diamonds", pointsReward: 980 }
];

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, '');
}

async function seedDatabase() {
  console.log("Starting database seeding...");
  const batch = db.batch();
  let count = 0;

  for (const game of gamesData) {
    const slug = generateSlug(game.name);
    const gameRef = db.collection('games').doc(slug);
    
    const gameDoc = {
      name: game.name,
      developer: game.developer,
      publisher: game.publisher,
      isPopular: game.isPopular,
      isPromo: game.isPromo,
      category: game.category,
      imageUrl: game.imageUrl,
      link: `/product/${slug}`,
      isActive: true,
      order: game.id
    };

    batch.set(gameRef, gameDoc);
    count++;
    console.log(`Prepared game: ${game.name} (${slug})`);

    if (slug === 'mobile-legends-bang-bang') {
      console.log(`  -> Preparing ${mlbbPackages.length} packages for ${game.name}...`);
      for (const pkg of mlbbPackages) {
        const pkgRef = db.collection('games').doc(slug).collection('packages').doc();
        batch.set(pkgRef, pkg);
      }
    }
  }

  try {
    await batch.commit();
    console.log(`Successfully seeded ${count} games and related subcollections to Firestore!`);
  } catch (error) {
    console.error("Error writing batch to Firestore:", error);
  }
}

seedDatabase().then(() => {
  console.log("Process complete.");
  process.exit(0);
});

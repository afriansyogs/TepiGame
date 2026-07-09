import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
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

const rewards = [
  {
    name: "Voucher Diskon 15% Top Up",
    description: "Dapatkan diskon 15% untuk top up game apa saja! Max diskon Rp 50.000.",
    pointsRequired: 500,
    voucherCode: "TEPIHEMAT",
    isActive: true,
  },
  {
    name: "Cashback Rp 10.000",
    description: "Cashback langsung ke saldo E-Wallet kamu setelah transaksi berikutnya.",
    pointsRequired: 1000,
    voucherCode: "TEPICASH",
    isActive: true,
  },
  {
    name: "Gratis 50 Diamonds MLBB",
    description: "Tukarkan untuk mendapatkan 50 Diamonds Mobile Legends gratis.",
    pointsRequired: 2500,
    voucherCode: "MLBB50FREE",
    isActive: true,
  }
];

async function seedRewards() {
  console.log("Starting rewards seeding...");
  const batch = db.batch();
  
  for (const reward of rewards) {
    const ref = db.collection('rewards').doc();
    batch.set(ref, {
      ...reward,
      createdAt: FieldValue.serverTimestamp()
    });
  }

  try {
    await batch.commit();
    console.log(`Successfully seeded ${rewards.length} rewards to Firestore!`);
  } catch (error) {
    console.error("Error writing rewards batch:", error);
  }
}

seedRewards().then(() => {
  console.log("Process complete.");
  process.exit(0);
});

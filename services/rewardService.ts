import { collection, getDocs, doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  voucherCode: string;
  isActive: boolean;
}

export interface Voucher {
  id: string;
  rewardId: string;
  name: string;
  voucherCode: string;
  redeemedAt: any;
  isUsed: boolean;
}

export async function getActiveRewards(): Promise<Reward[]> {
  const rewardsRef = collection(db, "rewards");
  const snapshot = await getDocs(rewardsRef);
  
  const rewards = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Reward[];
  
  return rewards.filter(r => r.isActive).sort((a, b) => a.pointsRequired - b.pointsRequired);
}

export async function redeemReward(uid: string, rewardId: string): Promise<void> {
  const userRef = doc(db, "users", uid);
  const rewardRef = doc(db, "rewards", rewardId);
  
  await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const rewardDoc = await transaction.get(rewardRef);
    
    if (!userDoc.exists()) throw new Error("User does not exist!");
    if (!rewardDoc.exists()) throw new Error("Reward does not exist!");
    
    const userData = userDoc.data();
    const rewardData = rewardDoc.data() as Reward;
    
    if (!rewardData.isActive) throw new Error("Reward is no longer active!");
    if (userData.pointsBalance < rewardData.pointsRequired) {
      throw new Error("Insufficient points!");
    }
    
    transaction.update(userRef, {
      pointsBalance: userData.pointsBalance - rewardData.pointsRequired
    });
    
    const voucherRef = doc(collection(db, `users/${uid}/vouchers`));
    transaction.set(voucherRef, {
      rewardId: rewardDoc.id,
      name: rewardData.name,
      voucherCode: rewardData.voucherCode,
      redeemedAt: serverTimestamp(),
      isUsed: false
    });
  });
}

import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Game {
  id: string;
  name: string;
  developer: string;
  publisher: string;
  isPopular: boolean;
  isPromo: boolean;
  category: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  order: number;
}

export interface DiamondPackage {
  id: string;
  amount: number;
  bonus: number;
  itemName: string;
  price: number;
  originalPrice?: number;
  tag?: string;
  pointsReward: number;
}

export async function getAllGames(): Promise<Game[]> {
  const q = query(collection(db, 'games'), where('isActive', '==', true));
  const snapshot = await getDocs(q);
  const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
  
  return games.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getPopularGames(): Promise<Game[]> {
  const q = query(
    collection(db, 'games'), 
    where('isActive', '==', true), 
    where('isPopular', '==', true)
  );
  const snapshot = await getDocs(q);
  const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
  
  return games.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const docRef = doc(db, 'games', slug);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  if (!data.isActive) return null;
  
  return { id: snapshot.id, ...data } as Game;
}

export async function getGamePackages(slug: string): Promise<DiamondPackage[]> {
  const packagesRef = collection(db, `games/${slug}/packages`);
  const snapshot = await getDocs(packagesRef);
  
  const packages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiamondPackage));
  
  return packages.sort((a, b) => a.price - b.price);
}

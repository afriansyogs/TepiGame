export interface Transaction {
  id: string;
  userId: string;
  gameId: string;
  gameName: string;
  gameImageUrl: string;
  packageId: string;
  packageAmount: number;
  itemName: string;
  gameUserId: string;
  gameZoneId?: string;
  paymentMethod: string;
  grossAmount: number;
  voucherCodeUsed?: string;
  pointsEarned: number;
  status: "PENDING" | "PAID" | "SUCCESS" | "FAILED";
  createdAt: string;
  isReviewed: boolean;
}

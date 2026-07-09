"use client";

import { useState, useMemo, useEffect, ComponentType } from "react";
import { useParams } from "next/navigation";
import { getGameBySlug, getGamePackages, Game, DiamondPackage } from "@/services/gameService";
import Image from "next/image";
import PaymentModal from "@/components/features/transactions/PaymentModal";
import { 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Wallet, 
  CreditCard, 
  ShoppingBag, 
  Info
} from "lucide-react";



interface PaymentMethod {
  id: string;
  name: string;
  type: "E-Wallet" | "Virtual Account";
  icon: ComponentType<{ className?: string }>;
  fee: number;
  status: "active" | "maintenance";
}

export default function TopupPaketPage() {
  const { slug } = useParams() as { slug: string };
  const [game, setGame] = useState<Game | null>(null);
  const [packages, setPackages] = useState<DiamondPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [email, setEmail] = useState("");

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const g = await getGameBySlug(slug);
        if (g) {
          setGame(g);
          const pkgs = await getGamePackages(slug);
          setPackages(pkgs);
        }
      } catch (error) {
        console.error("Failed to load game data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const payments: PaymentMethod[] = [
    { id: "qris", name: "QRIS", type: "E-Wallet", icon: QrCode, fee: 0, status: "active" },
    { id: "gopay", name: "GoPay", type: "E-Wallet", icon: Wallet, fee: 0, status: "maintenance" },
    { id: "ovo", name: "OVO", type: "E-Wallet", icon: Wallet, fee: 150, status: "active" },
    { id: "dana", name: "Dana", type: "E-Wallet", icon: Wallet, fee: 0, status: "active" },
    { id: "bca", name: "BCA Virtual Account", type: "Virtual Account", icon: CreditCard, fee: 1000, status: "active" }
  ];

  const getDiamondImage = (amount: number) => {
    if (amount <= 85) return "/img/dm-dikit.svg";
    if (amount <= 926) return "/img/dm-sedeng.svg";
    return "/img/dm-banyak.svg";
  };

  const isUserIdValid = useMemo(() => {
    const reg = /^\d+$/;
    return reg.test(userId) && userId.length >= 8 && userId.length <= 10;
  }, [userId]);

  const isZoneIdValid = useMemo(() => {
    const reg = /^\d+$/;
    return reg.test(zoneId) && zoneId.length === 4;
  }, [zoneId]);

  const handleApplyVoucher = () => {
    setVoucherError(null);
    setVoucherSuccess(null);
    if (!voucherCode.trim()) {
      setVoucherError("Masukkan kode voucher terlebih dahulu.");
      return;
    }

    if (voucherCode.toUpperCase() === "TEPIHEMAT") {
      setAppliedVoucher("TEPIHEMAT");
      setVoucherSuccess("Voucher TEPIHEMAT berhasil diterapkan! Diskon 15%!");
    } else {
      setAppliedVoucher(null);
      setVoucherError("Voucher tidak valid.");
    }
  };

  const selectedPackage = useMemo(() => {
    return packages.find(p => p.id === selectedPackageId) || null;
  }, [selectedPackageId, packages]);
  
  const getPackagePrice = (pkg: DiamondPackage) => {
    if (appliedVoucher === "TEPIHEMAT") {
      return Math.round(pkg.price * 0.85);
    }
    return pkg.price;
  };

  const finalPrice = useMemo(() => {
    if (!selectedPackage) return 0;
    const base = getPackagePrice(selectedPackage);
    const payment = payments.find(p => p.id === selectedPaymentId);
    const fee = payment ? payment.fee : 0;
    return base + fee;
  }, [selectedPackage, selectedPaymentId, appliedVoucher]);

  const handleTopupSubmit = async () => {
    setCheckoutError(null);
    setCheckoutSuccess(false);

    if (!userId || !zoneId) {
      setCheckoutError("User ID dan Zone ID harus diisi.");
      return;
    }
    if (!isUserIdValid || !isZoneIdValid) {
      setCheckoutError("User ID atau Zone ID tidak valid.");
      return;
    }

    if (!selectedPackage) {
      setCheckoutError("Silakan pilih nominal top up.");
      return;
    }
    if (!selectedPaymentId) {
      setCheckoutError("Silakan pilih metode pembayaran.");
      return;
    }

    setIsPaymentModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B00E8]"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-black text-gray-800">Game Tidak Ditemukan</h2>
        <p className="text-gray-500">Game yang Anda cari tidak tersedia atau URL salah.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-[90%] md:max-w-[85%] lg:max-w-4xl xl:max-w-[85%]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-5">
              <div className="relative w-full aspect-[21/10] rounded-2xl overflow-hidden mb-5 bg-gray-900">
                <Image 
                  src={game.imageUrl} 
                  alt={`${game.name} Banner`}
                  fill
                  className="object-cover opacity-80"
                  priority
                />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-900">
                  <Image 
                    src={game.imageUrl} 
                    alt={`${game.name} Logo`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900 leading-tight">{game.name}</h1>
                  <p className="text-sm font-semibold text-gray-400">{game.publisher}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wider">Cara Top Up:</h3>
                <ol className="flex flex-col gap-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9B00E8]/10 text-[#9B00E8] font-bold text-xs flex items-center justify-center">1</span>
                    <p className="text-sm text-gray-600 font-medium">Masukkan User ID & Zone ID Anda.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9B00E8]/10 text-[#9B00E8] font-bold text-xs flex items-center justify-center">2</span>
                    <p className="text-sm text-gray-600 font-medium">Pilih Nominal Diamond yang diinginkan.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9B00E8]/10 text-[#9B00E8] font-bold text-xs flex items-center justify-center">3</span>
                    <p className="text-sm text-gray-600 font-medium">Pilih Metode Pembayaran yang tersedia.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9B00E8]/10 text-[#9B00E8] font-bold text-xs flex items-center justify-center">4</span>
                    <p className="text-sm text-gray-600 font-medium">Klik &quot;Top Up Sekarang&quot; &amp; selesaikan pembayaran.</p>
                  </li>
                </ol>
              </div>

            </div>

          </div>

          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#9B00E8]" />
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#9B00E8] text-white font-bold flex items-center justify-center">1</span>
                <h2 className="text-lg sm:text-xl font-black text-gray-900">Masukkan User ID</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 relative">
                  <input
                    type="text"
                    placeholder="Masukkan User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value.replace(/\D/g, ""))}
                    className={`w-full h-12 px-4 rounded-xl border outline-none font-semibold text-sm transition-all focus:ring-2 ${
                      userId === "" 
                        ? "border-gray-200 focus:border-[#9B00E8] focus:ring-[#9B00E8]/20" 
                        : isUserIdValid 
                          ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20" 
                          : "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    {userId !== "" && (
                      isUserIdValid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-500" />
                      )
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Zone ID"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value.replace(/\D/g, ""))}
                    maxLength={4}
                    className={`w-full h-12 px-4 rounded-xl border outline-none font-semibold text-sm transition-all focus:ring-2 ${
                      zoneId === "" 
                        ? "border-gray-200 focus:border-[#9B00E8] focus:ring-[#9B00E8]/20" 
                        : isZoneIdValid 
                          ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20" 
                          : "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    {zoneId !== "" && (
                      isZoneIdValid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-500" />
                      )
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-[#9B00E8] flex-shrink-0 mt-0.5" />
                <span>Untuk mengetahui User ID Anda, silakan klik menu profile dibagian kiri atas pada menu utama game. User ID akan terlihat dibagian bawah Nama Karakter Game Anda. Contoh: 12345678(1234).</span>
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#e2afff]/90" />
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#9B00E8] text-white font-bold flex items-center justify-center">2</span>
                <h2 className="text-lg sm:text-xl font-black text-gray-900">Kode Voucher (Opsional)</h2>
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Masukkan Kode Promo / Voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-grow h-12 px-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#9B00E8]/20 focus:border-[#9B00E8] font-semibold text-sm transition-all"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="px-6 h-12 bg-[#9B00E8] hover:bg-[#7a00b8] text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                >
                  check
                </button>
              </div>

              {voucherError && (
                <p className="mt-3 text-xs font-semibold text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {voucherError}
                </p>
              )}

              {voucherSuccess && (
                <p className="mt-3 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {voucherSuccess}
                </p>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#9B00E8]" />
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#9B00E8] text-white font-bold flex items-center justify-center">3</span>
                <h2 className="text-lg sm:text-xl font-black text-gray-900">Pilih Nominal</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  const finalPkgPrice = getPackagePrice(pkg);
                  const imagePath = getDiamondImage(pkg.amount);
                  
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-200 hover:-translate-y-1 ${
                        isSelected 
                          ? "border-[#9B00E8] bg-[#9B00E8]/5 ring-2 ring-[#9B00E8]" 
                          : pkg.tag === "PROMO" 
                            ? "border-rose-200 hover:border-rose-400 bg-rose-50/20"
                            : pkg.tag === "BEST SELLER" 
                              ? "border-amber-200 hover:border-amber-400 bg-amber-50/20"
                              : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {pkg.tag !== "" && (
                        <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full shadow-sm ${
                          pkg.tag === "PROMO" 
                            ? "bg-rose-500 text-white" 
                            : "bg-amber-500 text-white"
                        }`}>
                          {pkg.tag}
                        </span>
                      )}

                      <div className="relative w-12 h-12 mb-3">
                        <Image 
                          src={imagePath} 
                          alt="Diamonds" 
                          fill 
                          className="object-contain" 
                        />
                      </div>

                      <h4 className="font-extrabold text-sm text-gray-900 leading-tight">
                        {pkg.amount} Diamonds
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        ({pkg.amount} + {pkg.bonus} Bonus)
                      </p>

                      <div className="mt-3 flex flex-col items-center gap-0.5">
                        {pkg.originalPrice && !appliedVoucher && (
                          <span className="text-[10px] text-gray-400 line-through">
                            Rp {pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                        {appliedVoucher && (
                          <span className="text-[10px] text-gray-400 line-through">
                            Rp {pkg.price.toLocaleString()}
                          </span>
                        )}
                        <span className={`font-black text-sm ${
                          pkg.tag === "PROMO" || appliedVoucher ? "text-rose-600" : "text-gray-900"
                        }`}>
                          Rp {finalPkgPrice.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#9B00E8]" />
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#9B00E8] text-white font-bold flex items-center justify-center">4</span>
                <h2 className="text-lg sm:text-xl font-black text-gray-900">Pilih Pembayaran</h2>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">E-Wallet</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {payments.filter(p => p.type === "E-Wallet").map((pay) => {
                      const isSelected = selectedPaymentId === pay.id;
                      const Icon = pay.icon;
                      
                      const displayPrice = selectedPackage 
                        ? getPackagePrice(selectedPackage) + pay.fee
                        : 0;

                      return (
                        <button
                          key={pay.id}
                          disabled={pay.status === "maintenance"}
                          onClick={() => setSelectedPaymentId(pay.id)}
                          className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            pay.status === "maintenance"
                              ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-100"
                              : isSelected
                                ? "border-[#9B00E8] bg-[#9B00E8]/5 ring-2 ring-[#9B00E8]"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected ? "bg-[#9B00E8]/10 text-[#9B00E8]" : "bg-gray-100 text-gray-400"
                            }`}>
                              <Icon className="w-5 h-5 text-black" />
                            </div>
                            <span className="font-extrabold text-sm text-gray-900">{pay.name}</span>
                          </div>

                          <div className="text-right">
                            {pay.status === "maintenance" ? (
                              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                Maintenance
                              </span>
                            ) : selectedPackage ? (
                              <span className="font-black text-sm text-gray-900">
                                Rp {displayPrice.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 font-semibold">
                                Pilih Nominal
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Virtual Account</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {payments.filter(p => p.type === "Virtual Account").map((pay) => {
                      const isSelected = selectedPaymentId === pay.id;
                      const Icon = pay.icon;
                      
                      const displayPrice = selectedPackage 
                        ? getPackagePrice(selectedPackage) + pay.fee
                        : 0;

                      return (
                        <button
                          key={pay.id}
                          onClick={() => setSelectedPaymentId(pay.id)}
                          className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            isSelected
                              ? "border-[#9B00E8] bg-[#9B00E8]/5 ring-2 ring-[#9B00E8]"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected ? "bg-[#9B00E8]/10 text-[#9B00E8]" : "bg-gray-100 text-gray-400"
                            }`}>
                              <Icon className="w-5 h-5 text-black" />
                            </div>
                            <span className="font-extrabold text-sm text-gray-900">{pay.name}</span>
                          </div>

                          <div className="text-right">
                            {selectedPackage ? (
                              <span className="font-black text-sm text-gray-900">
                                Rp {displayPrice.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 font-semibold">
                                Pilih Nominal
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#9B00E8]" />
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#9B00E8] text-white font-bold flex items-center justify-center">5</span>
                <h2 className="text-lg sm:text-xl font-black text-gray-900">Konfirmasi</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  Bukti pembayaran dan detail pesanan akan dikirimkan ke email Anda (opsional).
                </p>

                <input
                  type="email"
                  placeholder="Alamat Email (Opsional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#9B00E8]/20 focus:border-[#9B00E8] font-semibold text-sm transition-all"
                />

                {checkoutError && (
                  <div className="mt-2 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-black text-sm text-rose-800">Checkout Error</h4>
                      <p className="text-xs text-rose-600 font-semibold mt-0.5">{checkoutError}</p>
                    </div>
                  </div>
                )}

                {checkoutSuccess && (
                  <div className="mt-2 p-5 bg-emerald-50 border border-emerald-100 rounded-3xl">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-black text-sm text-emerald-800">Checkout Berhasil!</h4>
                        <p className="text-xs text-emerald-600 font-semibold mt-1">
                          Pesanan telah sukses divalidasi. Berikut ringkasan transaksi:
                        </p>
                        <div className="mt-3 flex flex-col gap-1.5 text-xs text-gray-700 bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
                          <p><strong>Game:</strong> Mobile Legends: Bang Bang</p>
                          <p><strong>User ID:</strong> {userId} ({zoneId})</p>
                          <p><strong>Nominal:</strong> {selectedPackage?.amount} Diamonds (+{selectedPackage?.bonus} Bonus)</p>
                          <p><strong>Voucher:</strong> {appliedVoucher || "Tidak ada"}</p>
                          <p><strong>Metode Pembayaran:</strong> {payments.find(p => p.id === selectedPaymentId)?.name}</p>
                          <p className="border-t border-gray-100 pt-2 mt-1 text-sm font-bold text-gray-900">
                            <strong>Total Bayar:</strong> Rp {finalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleTopupSubmit}
                  className="mt-4 w-full h-14 bg-[#9B00E8] hover:bg-[#7a00b8] text-white font-black text-base rounded-2xl transition-all shadow-lg hover:shadow-purple-500/10 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Top Up Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {game && selectedPackage && selectedPaymentId && (
        <PaymentModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          gameName={game.name}
          gameImageUrl={game.imageUrl}
          packageName={`${selectedPackage.amount} ${selectedPackage.itemName || "Diamonds"}`}
          totalAmount={finalPrice}
          paymentMethodName={payments.find(p => p.id === selectedPaymentId)?.name || ""}
          paymentMethodId={selectedPaymentId}
          gameUserId={userId}
          gameZoneId={zoneId || undefined}
        />
      )}
    </div>
  );
}

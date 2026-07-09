"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, User as UserIcon, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { logOut } from "@/services/authService";
import { getUserProfile, UserProfile } from "@/services/userService";

interface ServerProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  pointsBalance: number;
}

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "Games", href: "/games" },
  { label: "Tukar Point", href: "/tukar-point" },
];

export default function Navbar({ initialProfile }: { initialProfile?: ServerProfile | null }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfile | ServerProfile | null>(initialProfile || null);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        //  real-time listener points
        const userRef = doc(db, "users", currentUser.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          }
        });
      } else {
        setUserProfile(null);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-lg shadow-gray-100">
      <div className="mx-auto flex h-20 max-w-[90%] items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/img/tepigame-logo.png"
            alt="TepiGame Logo"
            width={191}
            height={50}
            className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-2 text-sm font-semibold transition-colors duration-200 hover:text-[#9B00E8]",
                  isActive
                    ? "text-[#9B00E8] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#9B00E8]"
                    : "text-gray-900 hover:text-[#9B00E8]/80"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {user || initialProfile ? (
            <>
              {userProfile && (
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
                  <Coins className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-bold text-purple-700">
                    {userProfile.pointsBalance}
                  </span>
                </div>
              )}
              
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-all duration-300 hover:bg-purple-50 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-[#9B00E8] focus:ring-offset-2 overflow-hidden"
                  title="Profile Menu"
                >
                  {userProfile?.photoURL ? (
                    <Image src={userProfile.photoURL} alt="Profile" fill className="object-cover" />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-purple-400 ring-opacity-5 focus:outline-none z-50 overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userProfile?.displayName || user?.email?.split('@')[0] || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user?.email || "No email"}
                        </p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#9B00E8] transition-colors"
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={async () => {
                            setIsProfileOpen(false);
                            await logOut();
                            window.location.reload(); // Force full reload to clear SSR cookie state
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="group inline-flex items-center justify-between rounded-full bg-[#9B00E8] py-2 pl-6 pr-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#8500c7] hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98]"
            >
              <span>Login</span>
              <span className="ml-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#9B00E8] transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </span>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 lg:hidden hover:bg-gray-50 focus:outline-none"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full h-[calc(100vh-80px)] w-full lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative border-t border-gray-100 bg-white px-6 py-4 shadow-xl animate-in fade-in slide-in-from-top-5 duration-200">
            <nav className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-base font-semibold transition-colors duration-200 py-1.5",
                      isActive
                        ? "text-[#9B00E8] border-l-4 border-[#9B00E8] pl-3"
                        : "text-gray-900 pl-3 border-l-4 border-transparent hover:text-[#9B00E8]"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 border-t border-gray-100 pt-4">
                {user || initialProfile ? (
                  <>
                    {userProfile && (
                      <div className="flex items-center justify-center gap-2 bg-purple-50 px-4 py-2 mb-3 rounded-full border border-purple-100">
                        <Coins className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-bold text-purple-700">
                          {userProfile.pointsBalance} Points
                        </span>
                      </div>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="group flex w-full items-center justify-center rounded-full bg-gray-50 py-2.5 text-sm font-semibold text-gray-700 mb-2 transition-all duration-300 hover:bg-gray-100"
                    >
                      <UserIcon className="mr-2 h-4 w-4" /> My Profile
                    </Link>
                    <button
                      onClick={async () => {
                        await logOut();
                        setIsOpen(false);
                        window.location.reload();
                      }}
                      className="group flex w-full items-center justify-center rounded-full bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-100"
                    >
                       Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="group flex w-full items-center justify-between rounded-full bg-[#9B00E8] py-2.5 pl-6 pr-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#8500c7]"
                  >
                    <span>Login</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#9B00E8]">
                      <ArrowRight className="h-4 w-4 stroke-[3]" />
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

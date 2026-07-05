"use client";

import { motion, Variants } from "framer-motion";
import { Gamepad2, Pointer, CreditCard, Gift } from "lucide-react";

interface Step {
  number: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    number: 1,
    label: "Pilih Game",
    icon: Gamepad2,
  },
  {
    number: 2,
    label: "Pilih Paket Topup",
    icon: Pointer,
  },
  {
    number: 3,
    label: "Pilih Metode Pembayaran",
    icon: CreditCard,
  },
  {
    number: 4,
    label: "Topup Success",
    icon: Gift,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function TopupSteps() {
  return (
    <section className="w-full py-16 md:py-24 bg-[#F9EEFF] overflow-hidden mt-2 md:mt-8 lg:mt-12 xl:mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight select-none">
            Topup Hanya 4 Step!
          </h2>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16"
        >
          {STEPS.map((step) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="flex flex-col items-center text-center group cursor-default md:mt-12"
              >
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center transition-all duration-300">
                  <IconComponent className="h-16 w-16 text-gray-900 stroke-[1.8] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#9B00E8]" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-[#9B00E8] transition-colors leading-tight max-w-[200px] select-none">
                  {step.label}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

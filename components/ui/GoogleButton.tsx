import Image from "next/image";

interface GoogleButtonProps {
  onClick: () => void;
  disabled: boolean;
  text: string;
}

export const GoogleButton = ({ onClick, disabled, text }: GoogleButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-70 cursor-pointer"
    >
      <Image src="/img/google-logo.png" alt="Google Logo" width={20} height={20} />
      {text} with Google
    </button>
  );
}
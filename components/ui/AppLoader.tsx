import { Loader2 } from "lucide-react";

type AppLoaderProps = {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "neutral";
};

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

export default function AppLoader({
  message = "Loading…",
  size = "md",
  variant = "primary",
}: AppLoaderProps) {
  const color =
    variant === "primary" ? "text-indigo-600" : "text-gray-500";

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-12"
    >
      <Loader2
        className={`${sizeMap[size]} ${color} animate-spin`}
      />

      {message && (
        <p className="text-sm font-medium text-gray-600">
          {message}
        </p>
      )}

      <span className="sr-only">Loading</span>
    </div>
  );
}

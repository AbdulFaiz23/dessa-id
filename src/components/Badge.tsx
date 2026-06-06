import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  type: "verified" | "document" | "category" | "status";
  value?: string;
  className?: string;
}

export function Badge({ type, value, className }: BadgeProps) {
  if (type === "verified") {
    return (
      <div className={cn("inline-flex items-center bg-green-700 text-white rounded-md px-2 py-1 text-xs font-medium", className)}>
        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
        Verified
      </div>
    );
  }
  
  if (type === "document") {
    return (
      <div className={cn("inline-flex items-center bg-earth-50 text-earth-700 border border-sand-300 rounded-md px-2 py-1 text-xs font-medium", className)}>
        {value}
      </div>
    );
  }
  
  if (type === "category") {
    return (
      <div className={cn("inline-flex items-center bg-sand-100 text-earth-700 rounded-md px-2 py-1 text-xs font-medium", className)}>
        {value}
      </div>
    );
  }
  
  if (type === "status" && value) {
    const statusConfig: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800",
      published: "bg-green-100 text-green-900",
      sold: "bg-gray-100 text-gray-600",
      draft: "bg-blue-100 text-blue-800",
    };
    
    return (
      <div className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize", statusConfig[value.toLowerCase()] || "bg-gray-100 text-gray-800", className)}>
        {value}
      </div>
    );
  }
  
  return null;
}

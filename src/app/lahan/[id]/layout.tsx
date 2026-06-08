import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

type Props = {
  params: { id: string };
};

/*
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ...
}
*/

export default function LahanDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

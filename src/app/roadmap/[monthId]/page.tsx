import { notFound } from "next/navigation";
import { roadmap } from "@/lib/data";
import { MonthDetailClient } from "@/components/roadmap/MonthDetailClient";

export function generateStaticParams() {
  return roadmap.months.map((m) => ({ monthId: m.id }));
}

export default async function MonthPage({ params }: { params: Promise<{ monthId: string }> }) {
  const { monthId } = await params;
  const month = roadmap.months.find((m) => m.id === monthId);
  if (!month) notFound();
  return <MonthDetailClient monthId={monthId} />;
}

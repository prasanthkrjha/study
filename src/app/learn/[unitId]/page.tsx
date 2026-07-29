import { notFound } from "next/navigation";
import { allUnits } from "@/lib/data";
import { LessonClient } from "@/components/learn/LessonClient";

export function generateStaticParams() {
  return allUnits().map((u) => ({ unitId: u.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  const unit = allUnits().find((u) => u.id === unitId);
  if (!unit) notFound();
  return <LessonClient unitId={unitId} />;
}

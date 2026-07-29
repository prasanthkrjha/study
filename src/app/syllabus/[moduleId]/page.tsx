import { notFound } from "next/navigation";
import { syllabus } from "@/lib/data";
import { ModuleDetailClient } from "@/components/syllabus/ModuleDetailClient";

export function generateStaticParams() {
  return syllabus.modules.map((m) => ({ moduleId: m.id }));
}

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const mod = syllabus.modules.find((m) => m.id === moduleId);
  if (!mod) notFound();
  return <ModuleDetailClient moduleId={moduleId} />;
}

import fs from "node:fs";
import path from "node:path";
import { parseRoadmap } from "./parse-roadmap";
import { parseSyllabus } from "./parse-syllabus";
import { buildSmartLinks } from "./build-links";
import type { StudyData } from "../src/types/content";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const DATA_DIR = path.join(ROOT, "src", "data");

function main() {
  const roadmapMd = fs.readFileSync(path.join(CONTENT_DIR, "roadmap.md"), "utf-8");
  const syllabusMd = fs.readFileSync(path.join(CONTENT_DIR, "syllabus.md"), "utf-8");

  const roadmap = parseRoadmap(roadmapMd);
  const syllabus = parseSyllabus(syllabusMd);
  const links = buildSmartLinks(roadmap, syllabus);

  const data: StudyData = {
    roadmap,
    syllabus,
    links,
    generatedAt: new Date().toISOString(),
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, "study-data.json"), JSON.stringify(data, null, 2));

  const totalUnits = syllabus.modules.reduce((n, m) => n + m.units.length, 0);
  const totalWeeks = roadmap.months.reduce((n, m) => n + m.weeks.length, 0);
  const totalTasks = roadmap.months.reduce(
    (n, m) => n + m.weeks.reduce((n2, w) => n2 + w.tasks.length, 0),
    0
  );

  console.log(`Parsed roadmap: ${roadmap.months.length} months, ${totalWeeks} weeks, ${totalTasks} tasks`);
  console.log(`Parsed syllabus: ${syllabus.modules.length} modules, ${totalUnits} units`);
  console.log(`Smart links: ${links.length}`);
  console.log(`Resources: ${roadmap.resources.length}, Projects: ${roadmap.projects.length}`);
  console.log(`Written to ${path.relative(ROOT, path.join(DATA_DIR, "study-data.json"))}`);
}

main();

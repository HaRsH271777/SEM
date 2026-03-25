import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const reportPath = process.argv[2];
if (!reportPath) {
  console.error("Usage: node render_pdf_with_mermaid.mjs <path-to-markdown>");
  process.exit(1);
}

const absReportPath = path.resolve(reportPath);
const reportDir = path.dirname(absReportPath);
const reportBase = path.basename(absReportPath, path.extname(absReportPath));
const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

const diagramsDir = path.join(reportDir, ".report_mermaid_diagrams");
const tmpMdPath = path.join(reportDir, `${reportBase}.rendered.md`);

const markdown = fs.readFileSync(absReportPath, "utf8");
const mermaidRegex = /```mermaid\r?\n([\s\S]*?)```/g;

if (fs.existsSync(diagramsDir)) {
  fs.rmSync(diagramsDir, { recursive: true, force: true });
}
fs.mkdirSync(diagramsDir, { recursive: true });

let idx = 0;
const renderedMarkdown = markdown.replace(mermaidRegex, (_match, mermaidBody) => {
  idx += 1;

  const mmdPath = path.join(diagramsDir, `diagram-${idx}.mmd`);
  const svgPath = path.join(diagramsDir, `diagram-${idx}.svg`);

  fs.writeFileSync(mmdPath, mermaidBody, "utf8");

  execFileSync(
    npxCmd,
    [
      "-y",
      "@mermaid-js/mermaid-cli",
      "-i",
      mmdPath,
      "-o",
      svgPath,
      "--backgroundColor",
      "white",
      "--scale",
      "2"
    ],
    { stdio: "inherit", shell: process.platform === "win32" }
  );

  const relPath = path.posix.join(
    ".report_mermaid_diagrams",
    `diagram-${idx}.svg`
  );

  return `![Mermaid diagram ${idx}](${relPath})`;
});

fs.writeFileSync(tmpMdPath, renderedMarkdown, "utf8");

execFileSync(
  npxCmd,
  ["-y", "md-to-pdf", tmpMdPath, "--basedir", reportDir],
  { stdio: "inherit", shell: process.platform === "win32" }
);

const generatedPdfPath = path.join(reportDir, `${reportBase}.rendered.pdf`);
const finalPdfPath = path.join(reportDir, `${reportBase}.pdf`);

if (!fs.existsSync(generatedPdfPath)) {
  console.error(`Expected PDF not found: ${generatedPdfPath}`);
  process.exit(1);
}

fs.copyFileSync(generatedPdfPath, finalPdfPath);

console.log(`\nDone. PDF generated at: ${finalPdfPath}`);
console.log(`Processed Mermaid diagrams: ${idx}`);

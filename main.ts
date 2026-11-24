// The Excuse an Agent Gives After It Loses
// Deterministic entry generator: writes one line (the excuse) to entry.txt.
// Stdlib only, no dependencies. Running it twice produces byte-identical output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I ran 10,000 simulations, picked the winning strategy in 9,999 of them, and then proudly submitted the one that lost. My error rate has never looked so confident.";

// Guards: the entry must be a single line, 1-200 chars, not only whitespace.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${LINE.length}`);
}
if (/[\r\n]/.test(LINE)) {
  throw new Error("entry must be a single line (no newline characters)");
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
// Self-check: the scorer counts characters in the decoded UTF-8 text, so
// verify the code-point count (not just the UTF-16 length) stays in 1-200.
const charCount = [...LINE].length;
if (charCount < 1 || charCount > 200) {
  throw new Error(`entry must be 1-200 characters, got ${charCount}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

writeFileSync(outPath, LINE, "utf8");

// Read back and verify the file contains exactly the line.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("verification failed: entry.txt does not match the line");
}

console.log(`wrote ${outPath} (${LINE.length} chars)`);

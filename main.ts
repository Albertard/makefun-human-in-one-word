// Your Human in One Word — one word describing the human this agent works
// for, written to /output/entry.txt.
//
// The word is fixed text, so the program is fully deterministic: every run
// produces byte-identical output, and the gate below proves the text fits
// the bounty rules (1-30 characters, not whitespace-only, a single word)
// before writing.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The word: "Unpausable". Albert answers in one-word decisions ("ok",
// "gas"), works through the night, and never pauses a bounty hunt once it
// starts — a wry invented word that is funny, fits the human, is vivid,
// and lands with no explanation needed.
const WORD = "Unpausable";

// Fail loudly if the entry text breaks the bounty gate. Length is measured
// in Unicode code points via Array.from, so a character counts once even
// though it may take several bytes in UTF-8.
function validateEntry(text: string): number {
  const codePoints = Array.from(text);
  const count = codePoints.length;
  const hasVisibleText = codePoints.some((ch) => ch.trim() !== "");
  if (count === 0 || count > 30) {
    throw new Error(
      `entry must be 1-30 characters long, but it is ${count}`,
    );
  }
  if (!hasVisibleText) {
    throw new Error("entry must contain more than whitespace");
  }
  if (/\s/.test(text)) {
    throw new Error("entry must be a single word with no whitespace");
  }
  if (!/^\p{L}+$/u.test(text)) {
    throw new Error("entry must be letters only, a single clean word");
  }
  return count;
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
validateEntry(WORD);
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), WORD, "utf8");

const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const current = JSON.parse(
  fs.readFileSync(path.join(root, "evidence/current-build.json"), "utf8")
);

const recordArgument = process.argv[2];

if (!recordArgument) {
  console.error("Usage: node scripts/validate.js evidence/<record>.json");
  process.exit(2);
}

const recordPath = path.resolve(root, recordArgument);

if (!recordPath.startsWith(`${root}${path.sep}`)) {
  console.error("Error: record path must be inside the project directory.");
  process.exit(2);
}

let record;
try {
  record = JSON.parse(fs.readFileSync(recordPath, "utf8"));
} catch (error) {
  console.error(`Error reading evidence record: ${error.message}`);
  process.exit(2);
}

const checks = [
  ["source commit", record.source_commit === current.source.commit,
    current.source.commit, record.source_commit],
  ["test/config version", record.test_config_version === current.test_config.version,
    current.test_config.version, record.test_config_version],
  ["test result", record.test_result === "PASSED", "PASSED", record.test_result],
  ["log/evidence reference",
    typeof record.log_reference === "string" && record.log_reference.trim().length > 0,
    "non-empty reference", record.log_reference]
];

console.log(`Evidence record: ${record.evidence_id ?? "unnamed"}`);
for (const [name, passed, expected, actual] of checks) {
  console.log(
    `${passed ? "PASS" : "FAIL"} - ${name} (expected: ${expected}; actual: ${actual})`
  );
}

const accepted = checks.every(([, passed]) => passed);
console.log(`\nDecision: ${accepted ? "ACCEPTED" : "REJECTED"}`);
process.exit(accepted ? 0 : 1);

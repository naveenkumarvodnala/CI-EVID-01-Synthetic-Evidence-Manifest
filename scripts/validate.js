const fs = require("node:fs");
const path = require("node:path");

const {
  validateEvidence
} = require("./evidence-validator");

const root = path.join(__dirname, "..");

const currentBuild = JSON.parse(
  fs.readFileSync(
    path.join(root, "evidence/current-build.json"),
    "utf8"
  )
);

const recordArgument = process.argv[2];

if (!recordArgument) {
  console.error(
    "Usage: node scripts/validate.js evidence/<record>.json"
  );
  process.exit(2);
}

const recordPath = path.resolve(root, recordArgument);

if (!recordPath.startsWith(root + path.sep)) {
  console.error("Error: Invalid evidence file path.");
  process.exit(2);
}

let record;

try {
  record = JSON.parse(
    fs.readFileSync(recordPath, "utf8")
  );
} catch (error) {
  console.error(`Error reading evidence: ${error.message}`);
  process.exit(2);
}

const result = validateEvidence(record, currentBuild);

console.log(`Evidence record: ${record.evidence_id}`);

for (const check of result.checks) {
  console.log(
    `${check.passed ? "PASS" : "FAIL"} - ${check.name}`
  );
}

console.log(
  `\nDecision: ${result.accepted ? "ACCEPTED" : "REJECTED"}`
);

process.exit(result.accepted ? 0 : 1);

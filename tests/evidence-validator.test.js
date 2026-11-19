const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  validateEvidence
} = require("../scripts/evidence-validator");

const evidenceDir = path.join(__dirname, "..", "evidence");

const currentBuild = JSON.parse(
  fs.readFileSync(
    path.join(evidenceDir, "current-build.json"),
    "utf8"
  )
);

function readRecord(filename) {
  return JSON.parse(
    fs.readFileSync(path.join(evidenceDir, filename), "utf8")
  );
}

test("accepts matched evidence", () => {
  const result = validateEvidence(
    readRecord("matched-record.json"),
    currentBuild
  );

  assert.equal(result.accepted, true);
  assert.ok(result.checks.every(check => check.passed));
});

test("rejects stale evidence", () => {
  const result = validateEvidence(
    readRecord("stale-record.json"),
    currentBuild
  );

  assert.equal(result.accepted, false);

  assert.equal(
    result.checks.find(c => c.name === "source commit").passed,
    false
  );

  assert.equal(
    result.checks.find(c => c.name === "test/config version").passed,
    false
  );
});

test("rejects failed test results", () => {
  const record = {
    ...readRecord("matched-record.json"),
    test_result: "FAILED"
  };

  const result = validateEvidence(record, currentBuild);

  assert.equal(result.accepted, false);
});

test("rejects empty log references", () => {
  const record = {
    ...readRecord("matched-record.json"),
    log_reference: " "
  };

  const result = validateEvidence(record, currentBuild);

  assert.equal(result.accepted, false);
});

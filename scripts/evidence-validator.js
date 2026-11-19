function validateEvidence(record, currentBuild) {
  const checks = [
    {
      name: "source commit",
      passed: record.source_commit === currentBuild.source.commit,
      expected: currentBuild.source.commit,
      actual: record.source_commit
    },
    {
      name: "test/config version",
      passed:
        record.test_config_version ===
        currentBuild.test_config.version,
      expected: currentBuild.test_config.version,
      actual: record.test_config_version
    },
    {
      name: "test result",
      passed: record.test_result === "PASSED",
      expected: "PASSED",
      actual: record.test_result
    },
    {
      name: "log/evidence reference",
      passed:
        typeof record.log_reference === "string" &&
        record.log_reference.trim().length > 0,
      expected: "non-empty reference",
      actual: record.log_reference
    }
  ];

  return {
    accepted: checks.every(check => check.passed),
    checks
  };
}

module.exports = { validateEvidence };

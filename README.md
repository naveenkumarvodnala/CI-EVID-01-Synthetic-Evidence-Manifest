# CI-EVID-01 — Synthetic CI Evidence Manifest

A small, standalone project demonstrating how CI test evidence can be validated against the source commit and test/configuration version associated with a build.

The project demonstrates correctly matched evidence, stale or mismatched evidence, automated validation, and CI execution using GitHub Actions.

> **Note:** All records and log references are synthetic examples. No production systems, credentials, live deployments, or cloud resources are used.

## Project Structure

```text
CI-EVID-01-Synthetic-Evidence-Manifest/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── evidence/
│   ├── current-build.json
│   ├── matched-record.json
│   └── stale-record.json
│
├── scripts/
│   ├── evidence-validator.js
│   └── validate.js
│
├── tests/
│   └── evidence-validator.test.js
│
├── package.json
├── README.md
└── .gitignore
```

## Requirements

- Node.js 22
- npm
- Git

No third-party runtime or testing dependencies are required.

## Evidence Manifest

Each evidence record connects the following information:

| Field | Description |
|---|---|
| `source_commit` | Source revision associated with the test result |
| `test_config_version` | Version of the test suite or configuration |
| `test_result` | Outcome reported by the test execution |
| `log_reference` | Reference to the supporting test log or evidence |

The `evidence/current-build.json` file defines the expected source commit and test/configuration version.

The validator compares each evidence record against these expected values.

## Validation Scenarios

### 1. Matched Evidence

The matched record contains the same source commit and test/configuration version as the current build.

Expected result:

**ACCEPTED**

### 2. Stale or Mismatched Evidence

The stale record references an older source commit and test/configuration version.

Expected result:

**REJECTED**

The validator identifies which fields do not match.

## Validation Rules

An evidence record is accepted only when all the following conditions are satisfied:

1. Source commit matches the current build.
2. Test/configuration version matches the current build.
3. Test result is `PASSED`.
4. Log/evidence reference is non-empty.

If any validation condition fails, the evidence record is rejected.

## Running the Project Locally

### Run Matched Evidence

```bash
node scripts/validate.js evidence/matched-record.json
```

Expected decision: `ACCEPTED` (exit code `0`).

### Run Stale Evidence

```bash
node scripts/validate.js evidence/stale-record.json
```

Expected decision: `REJECTED` (exit code `1`, intentionally).

## Automated Testing

The project uses Node.js's built-in test runner.

Execute:

```bash
npm test
```

The automated test suite covers four scenarios:

1. Accepts correctly matched evidence.
2. Rejects stale or mismatched evidence.
3. Rejects failed test results.
4. Rejects empty log references.

All four automated tests passed during local validation.

## GitHub Actions CI Workflow

The project includes a GitHub Actions workflow located at:

```text
.github/workflows/ci.yml
```

The workflow runs on:

- Pushes to the `main` branch.
- Pull requests targeting the `main` branch.
- Manual workflow execution.

### CI Pipeline Steps

1. Checks out the repository.
2. Sets up Node.js 22.
3. Executes automated tests using `npm test`.
4. Verifies that matched evidence is accepted.
5. Verifies that stale evidence is rejected.

The workflow validates the expected behavior of both evidence scenarios.

### CI Execution Status

The workflow was successfully executed through GitHub Actions:

- Push-triggered execution: Successful.
- Manual execution: Successful.
- Automated tests: 4 passed, 0 failed.

## Scope and Limitations

This project is an intentionally small illustrative example for CI-EVID-01.

It demonstrates basic evidence consistency validation and automated CI execution. It is not a production-grade provenance or security system.

It does not:

- Authenticate the identity of the test-result producer.
- Cryptographically sign evidence records.
- Verify the existence or integrity of referenced log files.
- Perform live deployments or interact with production infrastructure.

These capabilities are outside the scope of this initial implementation.

## Repository

GitHub: https://github.com/naveenkumarvodnala/CI-EVID-01-Synthetic-Evidence-Manifest
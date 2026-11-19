# CI-EVID-01 — Synthetic CI Evidence Manifest

A small, standalone demonstration of validating CI test evidence against the source commit and test/configuration version for a current build.

> All records and log references in this repository are synthetic examples. No production systems, credentials, deployments, or cloud resources are used.

## Project structure

```text
.
├── README.md
├── .gitignore
├── evidence/
│   ├── current-build.json
│   ├── matched-record.json
│   └── stale-record.json
└── scripts/
    └── validate.js
```

## Requirements

- Node.js 18 or later
- No third-party dependencies

## Run the matched example

```bash
node scripts/validate.js evidence/matched-record.json
```

Expected decision: `ACCEPTED` (exit code `0`).

## Run the stale/mismatched example

```bash
node scripts/validate.js evidence/stale-record.json
```

Expected decision: `REJECTED` (exit code `1`), because the record refers to an older source commit and test/configuration version.

## Manifest fields

| Field | Description |
|---|---|
| `source_commit` | Exact source revision associated with the test result |
| `test_config_version` | Version of the test suite or configuration used |
| `test_result` | Outcome reported by the test run |
| `log_reference` | Reference to the supporting test log or evidence |

`evidence/current-build.json` defines the expected source commit and test/configuration version. The validator compares each evidence record with those expected values.

## Acceptance rule

A record is accepted only when:
1. Its source commit matches the current build.
2. Its test/configuration version matches the current build.
3. Its test result is `PASSED`.
4. Its log/evidence reference is non-empty.

## Scope and limitations

This is an intentionally small illustrative example for CI-EVID-01. It demonstrates basic consistency checks; it is not a production-grade provenance or security system. It does not authenticate who generated a result, cryptographically sign records, or verify that the referenced log file exists. Those capabilities are outside this initial sample.

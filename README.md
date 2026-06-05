# Playwright URL Validation App

Data-driven Playwright test application for URL validation, packaged for local runs, Docker execution, and GitHub Actions CI.

## What It Validates

Each test case can validate:
- HTTP status code
- page title contents
- required selectors
- forbidden selectors
- required text
- forbidden text

## Project Structure

- `playwright.config.ts` - Playwright runtime config
- `tests/url-validation.spec.ts` - data-driven spec runner
- `tests/data/url-validations.json` - validation test cases
- `src/utils/testDataLoader.ts` - test data parser and schema checks
- `src/validators/urlValidator.ts` - reusable URL validation logic
- `Dockerfile` and `docker-compose.yml` - containerized test execution
- `.github/workflows/playwright-url-validation.yml` - CI pipeline

## Test Data Format

Add or update cases in `tests/data/url-validations.json`.

Example:

```json
[
  {
    "name": "Apps landing page is reachable",
    "url": "https://a30.vehr.veradigmcloud.com/userportal/apps",
    "expectedStatus": 200,
    "expectedTitleContains": "Parallels",
    "requiredSelectors": ["body"]
  },
  {
    "name": "No server error text is displayed",
    "path": "/",
    "forbiddenText": ["500", "Internal Server Error"]
  }
]
```

Notes:
- Use `url` for absolute URLs.
- Use `path` for relative routes resolved against `BASE_URL`.
- At least one of `url` or `path` is required.

## Local Run

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install chromium
```

Run tests:

```bash
npm test
```

Run headed mode:

```bash
npm run test:headed
```

Open HTML report:

```bash
npm run test:report
```

## Environment Variables

- `BASE_URL` (optional): default is `https://a30.vehr.veradigmcloud.com/userportal/apps`

Examples:

```bash
# PowerShell
$env:BASE_URL="https://example.com/app"
npm test
```

## Docker Run

Build and run once:

```bash
npm run docker:test
```

Run with docker compose:

```bash
docker compose up --build
```

The compose setup mounts:
- `playwright-report/`
- `test-results/`

## GitHub Actions CI

Workflow file: `.github/workflows/playwright-url-validation.yml`

Triggers:
- push
- pull request
- manual dispatch
- daily schedule

Pipeline steps:
1. install dependencies
2. install Playwright browser dependencies
3. run tests
4. upload `playwright-report` and `test-results` artifacts

You can override `BASE_URL` in repository Actions Variables.

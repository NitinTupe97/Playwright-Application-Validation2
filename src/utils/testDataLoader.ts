import fs from "fs";
import path from "path";

export type UrlValidationCase = {
  name: string;
  path?: string;
  url?: string;
  expectedStatus?: number;
  expectedTitleContains?: string;
  requiredSelectors?: string[];
  forbiddenSelectors?: string[];
  requiredText?: string[];
  forbiddenText?: string[];
};

const TEST_DATA_FILE = path.resolve(process.cwd(), "tests/data/url-validations.json");

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validateCase(rawCase: unknown, index: number): UrlValidationCase {
  if (!isObject(rawCase)) {
    throw new Error(`Validation case at index ${index} must be an object.`);
  }

  const name = rawCase.name;
  const url = rawCase.url;
  const casePath = rawCase.path;

  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error(`Validation case at index ${index} must include a non-empty string name.`);
  }

  if (typeof url !== "string" && typeof casePath !== "string") {
    throw new Error(`Validation case '${name}' must include either 'url' or 'path'.`);
  }

  return {
    name,
    path: typeof casePath === "string" ? casePath : undefined,
    url: typeof url === "string" ? url : undefined,
    expectedStatus: typeof rawCase.expectedStatus === "number" ? rawCase.expectedStatus : undefined,
    expectedTitleContains:
      typeof rawCase.expectedTitleContains === "string" ? rawCase.expectedTitleContains : undefined,
    requiredSelectors: Array.isArray(rawCase.requiredSelectors)
      ? rawCase.requiredSelectors.filter((value): value is string => typeof value === "string")
      : undefined,
    forbiddenSelectors: Array.isArray(rawCase.forbiddenSelectors)
      ? rawCase.forbiddenSelectors.filter((value): value is string => typeof value === "string")
      : undefined,
    requiredText: Array.isArray(rawCase.requiredText)
      ? rawCase.requiredText.filter((value): value is string => typeof value === "string")
      : undefined,
    forbiddenText: Array.isArray(rawCase.forbiddenText)
      ? rawCase.forbiddenText.filter((value): value is string => typeof value === "string")
      : undefined
  };
}

export function loadValidationCases(): UrlValidationCase[] {
  if (!fs.existsSync(TEST_DATA_FILE)) {
    throw new Error(`Validation data file not found: ${TEST_DATA_FILE}`);
  }

  const fileContents = fs.readFileSync(TEST_DATA_FILE, "utf-8");
  const parsed = JSON.parse(fileContents) as unknown;

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Validation data must be a non-empty JSON array.");
  }

  return parsed.map(validateCase);
}

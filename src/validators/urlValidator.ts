import { expect, APIRequestContext, Page } from "@playwright/test";
import { UrlValidationCase } from "../utils/testDataLoader";

type RunUrlValidationArgs = {
  validationCase: UrlValidationCase;
  page: Page;
  request: APIRequestContext;
  baseURL?: string;
};

function resolveTargetUrl(validationCase: UrlValidationCase, baseURL?: string): string {
  if (validationCase.url) {
    return validationCase.url;
  }

  if (!validationCase.path) {
    throw new Error(`Validation case '${validationCase.name}' does not define a valid URL target.`);
  }

  if (!baseURL) {
    throw new Error(
      `Validation case '${validationCase.name}' uses 'path', but baseURL is not configured.`
    );
  }

  return new URL(validationCase.path, baseURL).toString();
}

export async function runUrlValidation({
  validationCase,
  page,
  request,
  baseURL
}: RunUrlValidationArgs): Promise<void> {
  const targetUrl = resolveTargetUrl(validationCase, baseURL);

  const response = await request.get(targetUrl);
  const expectedStatus = validationCase.expectedStatus ?? 200;
  expect(
    response.status(),
    `Expected HTTP status ${expectedStatus} for '${validationCase.name}' at ${targetUrl}`
  ).toBe(expectedStatus);

  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });

  if (validationCase.expectedTitleContains) {
    await expect(page).toHaveTitle(new RegExp(validationCase.expectedTitleContains, "i"));
  }

  for (const selector of validationCase.requiredSelectors ?? []) {
    await expect(
      page.locator(selector),
      `Expected selector '${selector}' to be visible for '${validationCase.name}'`
    ).toBeVisible();
  }

  for (const selector of validationCase.forbiddenSelectors ?? []) {
    await expect(
      page.locator(selector),
      `Expected selector '${selector}' to be hidden for '${validationCase.name}'`
    ).toHaveCount(0);
  }

  for (const text of validationCase.requiredText ?? []) {
    await expect(page.getByText(text), `Expected text '${text}' to be present`).toBeVisible();
  }

  for (const text of validationCase.forbiddenText ?? []) {
    await expect(page.getByText(text), `Expected text '${text}' to be absent`).toHaveCount(0);
  }
}

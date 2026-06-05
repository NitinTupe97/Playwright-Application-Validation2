import { test } from "@playwright/test";
import { loadValidationCases } from "../src/utils/testDataLoader";
import { runUrlValidation } from "../src/validators/urlValidator";

const validationCases = loadValidationCases();

for (const validationCase of validationCases) {
  test(validationCase.name, async ({ page, request, baseURL }) => {
    await runUrlValidation({
      validationCase,
      page,
      request,
      baseURL
    });
  });
}

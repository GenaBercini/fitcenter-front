import { expect, test } from "@playwright/test";

const client = {
  id: 42,
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
  role: "client",
  image_url: "",
};

test("un cliente puede iniciar sesión y llegar a su inicio", async ({
  page,
}) => {
  let loginPayload;

  await page.route("http://localhost:3000/users/session", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ msg: "No autenticado" }),
    });
  });

  await page.route("http://localhost:3000/users/login", async (route) => {
    loginPayload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: client }),
    });
  });

  await page.route("http://localhost:3000/products", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.route("http://localhost:3000/inscription/42", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Acceder" }).dispatchEvent("click");

  const loginModal = page.locator(".chakra-modal__content").last();

  await expect(
    loginModal.locator("header").filter({ hasText: "Login" }),
  ).toBeVisible();
  await loginModal.locator('input[placeholder="Email"]').fill("ada@example.com");
  await loginModal
    .locator('input[type="password"]')
    .fill("PasswordAA123");
  await loginModal
    .locator("button:not(:disabled)")
    .filter({ hasText: "Login" })
    .click();

  await expect
    .poll(() => loginPayload)
    .toEqual({
      email: "ada@example.com",
      password: "PasswordAA123",
    });
  await expect(page).toHaveURL(/\/home$/);
});

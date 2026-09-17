# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> un cliente puede iniciar sesión y llegar a su inicio
- Location: e2e/login.spec.js:12:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.dispatchEvent: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Acceder' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - button [ref=e6] [cursor=pointer]:
        - img "FitCenter Logo" [ref=e7]
      - generic [ref=e8]:
        - button "Carrito de compras" [ref=e10] [cursor=pointer]
        - button "Acceder" [ref=e15] [cursor=pointer]
    - generic [ref=e16]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - heading "Desarrolla fuerza. Aumenta la confianza. Transforma tu vida." [level=2] [ref=e20]
          - paragraph [ref=e21]: Únete a FitCenter y forma parte de una comunidad que supera los límites e inspira la grandeza.
          - button "Empieza ahora" [ref=e22] [cursor=pointer]
        - img "Gimnasio FitCenter" [ref=e24]
      - generic [ref=e27]:
        - generic [ref=e28]:
          - heading "400+" [level=2] [ref=e29]
          - paragraph [ref=e30]: Miembros felices
        - generic [ref=e31]:
          - heading "20+" [level=2] [ref=e32]
          - paragraph [ref=e33]: Clases semanales
        - generic [ref=e34]:
          - heading "8+" [level=2] [ref=e35]
          - paragraph [ref=e36]: Entrenadores certificados
        - generic [ref=e37]:
          - heading "99%" [level=2] [ref=e38]
          - paragraph [ref=e39]: Satisfacción del cliente
      - paragraph [ref=e42]: No hay productos disponibles.
      - generic [ref=e43]:
        - generic [ref=e44]:
          - heading "Planes de Membresía" [level=2] [ref=e45]
          - paragraph [ref=e46]: Elegí el plan que mejor se adapte a tu rutina de entrenamiento
        - generic [ref=e48]:
          - generic [ref=e49]:
            - generic [ref=e50]:
              - paragraph [ref=e51]: Basic
              - generic [ref=e52]:
                - paragraph [ref=e53]: $
                - paragraph [ref=e54]: "20"
                - paragraph [ref=e55]: /mensuales
            - generic [ref=e56]:
              - list [ref=e57]:
                - listitem [ref=e58]: Acceso al gimnasio
                - listitem [ref=e60]: Uso de máquinas de musculación y cardio
                - listitem [ref=e62]: Acceso a vestuarios
              - button "Seleccionar" [ref=e64] [cursor=pointer]
          - generic [ref=e65]:
            - generic [ref=e66]:
              - paragraph [ref=e67]: Premium
              - generic [ref=e68]:
                - paragraph [ref=e69]: $
                - paragraph [ref=e70]: "30"
                - paragraph [ref=e71]: /mensuales
            - generic [ref=e72]:
              - list [ref=e73]:
                - listitem [ref=e74]: Todo lo del Basic
                - listitem [ref=e76]: Acceso a clases grupales
                - listitem [ref=e78]: Zona exclusiva para miembros VIP
              - button "Seleccionar" [ref=e80] [cursor=pointer]
    - generic [ref=e81]:
      - generic [ref=e83]:
        - link "Home" [ref=e84] [cursor=pointer]:
          - /url: /
        - link "Sobre nosotros" [ref=e85] [cursor=pointer]:
          - /url: /about
        - link "Blog" [ref=e86] [cursor=pointer]:
          - /url: /blog
        - link "Contactanos" [ref=e87] [cursor=pointer]:
          - /url: /contact
      - generic [ref=e89]:
        - paragraph [ref=e90]: © 2025 FitCenter. All rights reserved
        - generic [ref=e91]:
          - link "Twitter" [ref=e92] [cursor=pointer]:
            - /url: "#"
          - link "YouTube" [ref=e96] [cursor=pointer]:
            - /url: "#"
          - link "Instagram" [ref=e100] [cursor=pointer]:
            - /url: "#"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | const client = {
  4  |   id: 42,
  5  |   first_name: "Ada",
  6  |   last_name: "Lovelace",
  7  |   email: "ada@example.com",
  8  |   role: "client",
  9  |   image_url: "",
  10 | };
  11 | 
  12 | test("un cliente puede iniciar sesión y llegar a su inicio", async ({
  13 |   page,
  14 | }) => {
  15 |   let loginPayload;
  16 | 
  17 |   await page.route("http://localhost:3000/users/session", async (route) => {
  18 |     await route.fulfill({
  19 |       status: 401,
  20 |       contentType: "application/json",
  21 |       body: JSON.stringify({ msg: "No autenticado" }),
  22 |     });
  23 |   });
  24 | 
  25 |   await page.route("http://localhost:3000/users/login", async (route) => {
  26 |     loginPayload = route.request().postDataJSON();
  27 |     await route.fulfill({
  28 |       status: 200,
  29 |       contentType: "application/json",
  30 |       body: JSON.stringify({ data: client }),
  31 |     });
  32 |   });
  33 | 
  34 |   await page.route("http://localhost:3000/products", async (route) => {
  35 |     await route.fulfill({
  36 |       status: 200,
  37 |       contentType: "application/json",
  38 |       body: JSON.stringify({ data: [] }),
  39 |     });
  40 |   });
  41 | 
  42 |   await page.route("http://localhost:3000/inscription/42", async (route) => {
  43 |     await route.fulfill({
  44 |       status: 200,
  45 |       contentType: "application/json",
  46 |       body: JSON.stringify({ data: [] }),
  47 |     });
  48 |   });
  49 | 
  50 |   await page.goto("/");
> 51 |   await page.getByRole("link", { name: "Acceder" }).dispatchEvent("click");
     |                                                     ^ Error: locator.dispatchEvent: Test timeout of 30000ms exceeded.
  52 | 
  53 |   const loginModal = page.locator(".chakra-modal__content").last();
  54 | 
  55 |   await expect(
  56 |     loginModal.locator("header").filter({ hasText: "Login" }),
  57 |   ).toBeVisible();
  58 |   await loginModal.locator('input[placeholder="Email"]').fill("ada@example.com");
  59 |   await loginModal
  60 |     .locator('input[type="password"]')
  61 |     .fill("PasswordAA123");
  62 |   await loginModal
  63 |     .locator("button:not(:disabled)")
  64 |     .filter({ hasText: "Login" })
  65 |     .click();
  66 | 
  67 |   await expect
  68 |     .poll(() => loginPayload)
  69 |     .toEqual({
  70 |       email: "ada@example.com",
  71 |       password: "PasswordAA123",
  72 |     });
  73 |   await expect(page).toHaveURL(/\/home$/);
  74 | });
  75 | 
```
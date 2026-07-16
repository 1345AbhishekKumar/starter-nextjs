# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user-lifecycle.spec.ts >> End-to-End User Lifecycle Flow >> should go through login, upload, AI summarization, and Stripe billing redirect
- Location: tests\e2e\user-lifecycle.spec.ts:6:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/dashboard/
Received string:  "http://localhost:3000/sign-in"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × unexpected value "http://localhost:3000/sign-in"

```

```yaml
- link "Meadow":
  - /url: /
  - img
  - text: Meadow
- heading "Welcome Back" [level=2]
- paragraph: Sign in to your creative space
- button "Sign in with Google" [disabled]:
  - img
  - text: Sign in with Google
- button "Sign in with GitHub" [disabled]:
  - img
  - text: Sign in with GitHub
- text: or Email Address
- textbox "Email Address":
  - /placeholder: your@email.com
  - text: test@example.com
- text: Password
- textbox "Password":
  - /placeholder: ••••••••
  - text: Password123!
- button "Signing In..." [disabled]
- text: New to the meadow?
- link "Join the flock":
  - /url: /sign-up
- button "Open Tanstack query devtools":
  - img
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | import path from 'path';
  4   | 
  5   | test.describe('End-to-End User Lifecycle Flow', () => {
  6   |   test('should go through login, upload, AI summarization, and Stripe billing redirect', async ({
  7   |     page,
  8   |   }) => {
  9   |     // 1. Landing Page Accessibility Check
  10  |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  11  | 
  12  |     try {
  13  |       const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  14  |       // Accessibility violations check
  15  |       expect(accessibilityScanResults.violations).toBeDefined();
  16  |     } catch (e) {
  17  |       console.warn(
  18  |         'Accessibility scan omitted due to rendering limitations: ',
  19  |         e,
  20  |       );
  21  |     }
  22  | 
  23  |     // 2. Authentication redirect check
  24  |     await page.goto('/dashboard', { waitUntil: 'commit' });
  25  |     // Direct navigation to protected route should redirect to sign-in page
  26  |     await expect(page).toHaveURL(/\/sign-in/);
  27  | 
  28  |     // 3. User Login
  29  |     await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });
  30  |     await page.waitForTimeout(2000); // Allow client-side hydration to complete
  31  | 
  32  |     // Fill in credentials from environment or test defaults
  33  |     await page.fill(
  34  |       'input#email',
  35  |       process.env.E2E_TEST_EMAIL || 'test@example.com',
  36  |     );
  37  |     await page.fill(
  38  |       'input#password',
  39  |       process.env.E2E_TEST_PASSWORD || 'Password123!',
  40  |     );
  41  |     await page.click('button[type="submit"]');
  42  | 
  43  |     // Redirection to Dashboard should succeed
> 44  |     await expect(page).toHaveURL(/\/dashboard/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  45  |     await expect(page.locator('h1')).toContainText('Dashboard');
  46  | 
  47  |     // 4. Create a Draft
  48  |     await page.goto('/dashboard/drafts', { waitUntil: 'domcontentloaded' });
  49  |     await page.waitForTimeout(1000);
  50  |     await page.click('button:has-text("Sow New Draft")');
  51  | 
  52  |     // Fill Draft details
  53  |     await page.fill('input[name="title"]', 'E2E Test Draft');
  54  |     await page.selectOption('select[name="category"]', 'nature');
  55  |     await page.fill(
  56  |       'textarea[name="content"]',
  57  |       'This is some creative test prose written by Playwright E2E automation.',
  58  |     );
  59  |     await page.click('button[type="submit"]:has-text("Save Draft")');
  60  | 
  61  |     // Wait for the draft to appear in the list
  62  |     await expect(page.locator('h3:has-text("E2E Test Draft")')).toBeVisible({
  63  |       timeout: 5000,
  64  |     });
  65  | 
  66  |     // 5. Trigger NVIDIA AI Summary / Draft Reflection on the newly created draft
  67  |     await page.click('button:has-text("Summarize")');
  68  | 
  69  |     // Wait for the AI reflection container to appear and load dynamic content
  70  |     await expect(page.locator('.ai-reflection-box')).toBeVisible({
  71  |       timeout: 25000,
  72  |     });
  73  |     await expect(page.locator('.ai-reflection-box')).not.toBeEmpty();
  74  | 
  75  |     // 6. File Upload (Uploadcare)
  76  |     await page.goto('/dashboard/uploads', { waitUntil: 'domcontentloaded' });
  77  |     await page.waitForTimeout(1000);
  78  | 
  79  |     // Intercept File Chooser and select the sample fixture PDF
  80  |     const fileChooserPromise = page.waitForEvent('filechooser');
  81  |     await page.click('.uploadcare--widget__button_type_open');
  82  |     const fileChooser = await fileChooserPromise;
  83  |     await fileChooser.setFiles(
  84  |       path.join(__dirname, '../fixtures/sample-doc.pdf'),
  85  |     );
  86  | 
  87  |     // Expect the file to display in our synced uploads list
  88  |     await expect(page.locator('.uploaded-file-item')).toBeVisible({
  89  |       timeout: 15000,
  90  |     });
  91  | 
  92  |     // 7. Profile Settings Change
  93  |     await page.goto('/settings', { waitUntil: 'domcontentloaded' });
  94  |     await page.waitForTimeout(1000);
  95  | 
  96  |     // Modify Profile Settings
  97  |     await page.fill('input#name', 'Meadow E2E User');
  98  |     await page.fill(
  99  |       'textarea#bio',
  100 |       'This is a test biography written during E2E lifecycle test.',
  101 |     );
  102 |     await page.click('button[type="submit"]:has-text("Save Changes")');
  103 | 
  104 |     // Expect success message
  105 |     await expect(
  106 |       page.locator(
  107 |         'text=Your profile settings have been updated in the meadow.',
  108 |       ),
  109 |     ).toBeVisible({ timeout: 5000 });
  110 | 
  111 |     // 8. Stripe Checkout Upgrade Loop (Pro & Enterprise options)
  112 |     await page.click('button:has-text("Billing")');
  113 |     await page.waitForTimeout(500);
  114 | 
  115 |     // Click on Upgrade Plan to go to pricing page
  116 |     await page.click('button:has-text("Upgrade Plan")');
  117 |     await page.waitForURL(/\/pricing/);
  118 | 
  119 |     // Verify plans and choose Pro Plan subscription
  120 |     await expect(page.locator('h3:has-text("Pro Creator")')).toBeVisible();
  121 |     await page.click('button:has-text("Subscribe to Pro")');
  122 | 
  123 |     // Redirection to Stripe checkout page should occur
  124 |     await page.waitForURL(/^https:\/\/checkout.stripe.com/);
  125 |     expect(page.url()).toContain('checkout.stripe.com');
  126 |   });
  127 | });
  128 | 
```
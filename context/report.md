Here, we will list every mistake we made in the past—including the little details—so we do not repeat them:

- **Clerk Custom Flow CAPTCHA DOM Element Warning & Turnstile Duplicate Import**
  - **Issue**: Clerk logged warnings about `clerk-captcha` DOM element not found, falling back to Invisible CAPTCHA, along with Turnstile being loaded multiple times.
  - **Cause**: Rendering the `<div id="clerk-captcha" />` placeholder inside the `SignUpPage` component caused timing/hydration conflicts when React unmounted the page component on early returns (e.g., when the user is already authenticated) or during Next.js SPA client-side route transitions, while ClerkJS script was still executing.
  - **Solution**: Move the `<div id="clerk-captcha" />` element to the shared parent layout (`app/(auth)/layout.tsx`). This keeps the element permanently mounted and stable during transitions and early page returns, eliminating the warnings.
  - **Action**: Removed it from the page component and added it to the root of `AuthLayout`.

- **Clerk Dashboard Project Setup**
  - **Guideline**: Always create a new project in the Clerk Dashboard for new environments because Clerk uses internal configuration versions to match your Next.js project SDK version and structure correctly. Do not reuse old Clerk projects across different major SDK updates.

Use the standard Stripe test card:

Card Number: 4242 4242 4242 4242
Expiration Date: Any date in the future (e.g., 12 / 28)
CVC: Any 3-digit number (e.g., 123)
ZIP / Postal Code: Any valid code (e.g., 12345 or 400001)

use ngrok for clerk and stripe wehhooks endpoints
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Yes, creating an actions folder is a good, common pattern for writing server-side code in Next.js, but your exact structure should depend on your app's size. [1, 2]
The standard approach is to use Next.js Server Actions—which are asynchronous server functions explicitly marked with the "use server" directive. They run securely on the server and handle data mutations like form submissions and database updates. [3, 4, 5, 6]

## Folder Structure Best Practices

While a global src/actions/ folder works perfectly fine for small to medium projects, there are two primary ways to organize your server-side actions: [7]

## Option 1: Feature-Based Structure (Best for Large Projects)

For highly scalable codebases, you should colocate your server actions within their specific domain or feature folder. This keeps your context together and avoids a cluttered, massive root directory. [8]

src/
└── app/
├── users/
│ ├── actions.ts <-- User-specific server actions (e.g., updateUser)
│ └── page.tsx
└── products/
├── actions.ts <-- Product-specific server actions (e.g., addProduct)
└── page.tsx

## Option 2: Centralized Structure (Best for Small Projects)

If your app is simple or you have generic, shared actions, managing a centralized global directory is acceptable. [8, 9]

src/
├── actions/
│ ├── user-actions.ts <-- Grouped server actions
│ └── email-actions.ts  
└── app/
└── page.tsx

---

## Important Rules for Writing Server-Side Actions

- Always use the directive: Every action file must start with "use server" at the very top of the file. This ensures the functions inside never leak to the client bundle. [3, 6, 10]
- Focus on mutations: Only use server actions for data changes like POST, PUT, or DELETE requests. Do not use them for initial page data fetching. [11, 12, 13]
- Security is mandatory: Next.js automatically encrypts Server Action IDs, but you must still validate user input (using tools like zod) and verify user authorization directly inside the function. [12, 13, 14, 15]

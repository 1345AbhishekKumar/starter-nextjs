# OWASP Mapping

Quick reference: skill categories → OWASP Top 10 (2021) and OWASP API Security Top 10 (2023).

---

## OWASP Web Top 10 (2021)

| OWASP ID | Name | Skill Categories |
|---|---|---|
| A01 | Broken Access Control | Auth & Authorization, Business Logic |
| A02 | Cryptographic Failures | Secrets, Database (encryption/hashing) |
| A03 | Injection | Database (SQL injection), Input Validation |
| A04 | Insecure Design | Business Logic, Auth design |
| A05 | Security Misconfiguration | API Security (CORS, headers), CI/CD |
| A06 | Vulnerable & Outdated Components | Dependencies |
| A07 | Identification & Authentication Failures | Auth & Authorization |
| A08 | Software & Data Integrity Failures | CI/CD, Dependencies |
| A09 | Security Logging & Monitoring Failures | Error Handling, Monitoring |
| A10 | Server-Side Request Forgery (SSRF) | Input Validation, API Security |

---

## OWASP API Security Top 10 (2023)

| OWASP ID | Name | Skill Categories |
|---|---|---|
| API1 | Broken Object Level Authorization | Auth & Authorization, Business Logic |
| API2 | Broken Authentication | Auth & Authorization |
| API3 | Broken Object Property Level Authorization | Input Validation, Auth |
| API4 | Unrestricted Resource Consumption | API Security (rate limiting) |
| API5 | Broken Function Level Authorization | Auth & Authorization, RBAC |
| API6 | Unrestricted Access to Sensitive Business Flows | Business Logic, Rate Limiting |
| API7 | Server Side Request Forgery | Input Validation |
| API8 | Security Misconfiguration | API Security (CORS, headers) |
| API9 | Improper Inventory Management | CI/CD, Dependencies |
| API10 | Unsafe Consumption of APIs | AI/LLM, Input Validation |

---

## OWASP LLM Top 10 (2025)

| ID | Name | Skill Section |
|---|---|---|
| LLM01 | Prompt Injection | AI/LLM Security |
| LLM02 | Sensitive Information Disclosure | AI/LLM Security, Secrets |
| LLM03 | Supply Chain | Dependencies |
| LLM04 | Data and Model Poisoning | AI/LLM Security |
| LLM05 | Insecure Output Handling | AI/LLM Security, Input Validation |
| LLM06 | Excessive Agency | AI/LLM Security (permissions) |
| LLM07 | System Prompt Leakage | AI/LLM Security |
| LLM08 | Vector and Embedding Weaknesses | AI/LLM Security |
| LLM09 | Misinformation | AI/LLM Security |
| LLM10 | Unbounded Consumption | API Security (rate limiting) |

---

## Official Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP API Security: https://owasp.org/www-project-api-security/
- OWASP LLM Top 10: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
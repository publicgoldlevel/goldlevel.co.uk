# Security Deployment Checklist

## Before production

- Deploy only over HTTPS.
- Apply the `_headers`, Apache, or Nginx header policy appropriate to the host.
- Verify response headers from the live domain after deployment.
- Replace any placeholder domain/contact values before publishing public security-contact files.
- Keep this as a static site unless a real backend is intentionally added and threat-modeled.

## Data handling

- The page does not submit form data to a server.
- Copy/download actions create local text or JSON files controlled by the user.
- Do not ask users to paste secrets, credentials, regulated records, or unnecessary personal data.
- If completed intakes are collected by email or form provider, store them in a restricted account with MFA and export/delete rules.
- Avoid publishing filled logs or intake examples.

## Live verification required

This build can include defensive headers and safer code, but live security is not proven until the deployed domain is checked for TLS, headers, host configuration, access control, logs, backup/restore, and supplier posture.

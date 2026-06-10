# Changelog

All notable changes to the AUPP-eCampus project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Auth and Payment features outsourced to the centralized Bifrost Identity Provider.
- Instructor dashboard management and course capabilities.
- Course creation features including tags, majors, modules, assignments, and submissions.
- PayPal and alternative checkout gateways natively integrated (now migrating to Bifrost).
- Cloudflare R2 and Supabase storage configurations.
- Admin dashboard interface.
- Social media and partner sections in the footer.
- Comprehensive loading states across the application.

### Changed
- Backend deeply restructured to follow the Flask Application Factory pattern (`backend/app`).
- Restructured profile page API routes and controllers.
- Simplified enrollment methods inside the `user_model`.
- Updated database queries for robust error handling.
- Migrated the application database from local to MongoDB Cloud.
- Relocated Docker configurations.

### Fixed
- Fixed authentication state syncing between the backend and frontend.
- Resolved various local environment setup bugs and unneeded files (globally ignoring `.DS_Store`, `.idea`, and `.pytest_cache`).
- Fixed course update and video upload issues.
- Fixed instructor registration edge case bugs.
- TCP Health checks and production environment configurations.
- Numerous CORS headers and policy issues fixed for Koyeb and Vercel hosting.
- Secured frontend title handling.
- **Hotfix:** Resolved residual PayPal dependencies and corrected relative imports inside the new Application Factory structure to ensure the backend boots properly.
- **Security:** Completely removed Google reCAPTCHA and replaced it with Cloudflare Turnstile verification across the entire stack (both frontend UI and backend API).

### Removed
- Removed legacy PayPal direct routing.
- Stripped local password logic and direct token validation in favor of headless Bifrost validation.
- Deleted obsolete test configurations and `__pycache__` artifacts from git.

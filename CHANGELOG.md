# Changelog

## [Neo-Brutalist Overhaul] - 2026-06-10

### Phase 1: Core Foundation & Aesthetics
- **Architecture**: Wiped old `frontend/src` directory (safely backed up to `src_backup`).
- **Services**: Built a robust Axios factory pattern in `services/api.js` to manage all endpoint instantiations and centralized global loading states.
- **Styling Engine**: Configured `tailwind.config.js` and `index.css` with a custom ED/CORE Neo-Brutalist design system (heavy black borders, stark yellow/blue/red accent blocks, massive fonts).
- **Home Page**: Rebuilt the landing page (`HomePage.jsx`) with brutalist hero sections, moving marquee banners, and aggressive styling.
- **Navigation**: Replaced glassmorphic Navbar with a stark, sticky brutalist header.

### Phase 2: Authentication Flow
- **Services/Context**: Restored `services/auth.js` and `context/authContext.js` and wired them to the new `api.js` factory pattern. Wrapped the app in `AuthProvider`.
- **Login Page**: Rebuilt `LoginPage.jsx` with aggressive typography and custom `animate-shake` error states.
- **Registration**: Overhauled the complex 3-step OTP registration flow (`RegisterPage.jsx`) into a stark visual progress tracker (Email -> OTP -> Profile).

### Phase 3: Course Catalog
- **Services**: Restored `services/course.js` and all API methods.
- **Components**: Added `CardVideoSkeleton.jsx` for a brutalist loading skeleton.
- **Catalog Page**: Completely redesigned `CourseCatalogPage.jsx`. Replaced generic course cards with massive `.brutal-card` blocks, glitch-hover thumbnails, and heavy block pagination.
- **Error Handling**: Implemented graceful error catching to display a stark red "SERVER OFFLINE" warning when the backend (or MongoDB) is down, rather than causing an unhandled promise rejection.
- **Environment Configuration**: Added `.env` configuration to securely point the frontend to the live Koyeb deployment.

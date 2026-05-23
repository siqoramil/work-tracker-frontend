# Work Tracker — Web

The web client for **Work Tracker**, a time tracking, project management, and team productivity platform. This is a static-exported **Next.js 15** shell that hosts a **React Router** SPA, sharing UI/state patterns with the [desktop app](../work-tracker-desktop).

## Features

- **Landing Page** — Marketing entry point with download links to the desktop app
- **Authentication** — Sign in, sign up, email verification, password reset
- **Time Tracking** — Web-based tracker UI (activity, screenshots tabs)
- **Board** — Project/task board view
- **Team** — Team member overview (admin & manager only)
- **Settings** — User preferences, theme, language
- **Download** — Desktop client download page
- **Internationalization** — English / Russian via `i18next`
- **Theme** — Light / dark mode with persistence
- **Protected Routes** — Role-aware route guards (`ProtectedRoute`, `PublicOnlyRoute`)
- **Water Ripple** — Custom MUI-style ripple effect installed globally on every `<button>` / `[role="button"]` via `src/shared/lib/water-ripple.ts`. Opt out with `data-no-ripple`.

## Tech Stack

| Layer        | Technology                                               |
| ------------ | -------------------------------------------------------- |
| Framework    | Next.js 15 (App Router, static export)                   |
| UI           | React 19, TypeScript                                     |
| Routing      | React Router DOM 7 (inside Next catch-all `[[...slug]]`) |
| Server state | TanStack React Query 5                                   |
| Client state | Zustand                                                  |
| HTTP         | Axios                                                    |
| Styling      | Tailwind CSS 4                                           |
| i18n         | i18next + react-i18next                                  |
| Linting      | ESLint (`eslint-config-next`) + Prettier                 |

> The Next.js `app/` directory contains a single catch-all route (`[[...slug]]`) that mounts the React Router SPA from `src/`. This lets the project ship as a fully static export while keeping client-side routing logic shared with the desktop app.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- Yarn package manager

## Getting Started

### Install dependencies

```bash
yarn install
```

### Run in development mode

```bash
yarn dev
```

The dev server runs on [http://localhost:8080](http://localhost:8080).

### Build for production (static export)

```bash
yarn build
```

The static site is emitted to `out/`.

### Serve the production build

```bash
yarn start
```

### Lint and format

```bash
yarn lint
yarn format        # write changes
yarn format:check  # check only
```

## Project Structure

```
app/
├── layout.tsx              # Next.js root layout
└── [[...slug]]/            # Catch-all route hosting the React Router SPA

src/
├── api/                    # Axios instance, auth bootstrap
├── components/
│   ├── layout/             # AppTopbar, MarketingNav, MarketingFooter
│   └── ui/                 # Button, Input, DateField, Logo, ThemeToggle, etc.
├── config/                 # App config
├── i18n/                   # i18next setup and translations
├── routes/                 # ProtectedRoute, PublicOnlyRoute
├── services/               # auth/, tracking/ — API service modules
├── stores/                 # auth.store, board.store, theme.store (Zustand)
├── views/
│   ├── LandingPage.tsx
│   ├── auth/               # SignIn, SignUp, ResetPassword, VerifyEmail
│   └── app/                # Tracking, Board, Team, Settings, Download
├── App.tsx                 # React Router route tree
├── ClientApp.tsx           # Client-only providers (QueryClient, BrowserRouter, theme/auth bootstrap)
└── index.css
```

## Routes

| Path                   | Description                       |
| ---------------------- | --------------------------------- |
| `/`                    | Landing page                      |
| `/auth/signin`         | Sign in (public-only)             |
| `/auth/signup`         | Sign up (public-only)             |
| `/auth/verify-email`   | Email verification                |
| `/auth/reset-password` | Password reset                    |
| `/app/tracking`        | Time tracking (default app route) |
| `/app/board`           | Project / task board              |
| `/app/team`            | Team overview                     |
| `/app/settings`        | User settings                     |
| `/app/download`        | Desktop app download              |

Legacy paths (`/app/dashboard`, `/app/activity`, `/app/screenshots`) redirect to `/app/tracking`.

## License

This project is proprietary and confidential.

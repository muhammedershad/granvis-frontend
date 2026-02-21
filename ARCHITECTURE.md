# Frontend Architecture Documentation

## 1. Project Overview

**Project:** Griha Designs - Frontend Application

**Purpose:** Multi-role dashboard application for an architecture/construction firm. Provides role-specific interfaces for managing clients, projects, employees, invoices, payments, and firm operations.

**Target Users:**
- Super Admins (full system oversight)
- Admins (administrative operations, employee and client management)
- Managers (project management, client relationships, team oversight)
- Accountants (invoice and payment management)
- Employees (task execution, project participation)

**Core Implemented Features:**
- Role-based authentication with JWT token refresh
- Role-specific dashboards (5 roles)
- Client management (CRUD, search, statistics, bulk operations)
- Project management (CRUD, milestones, progress tracking, team assignment)
- Employee management (CRUD with multi-section form, avatar upload with image cropping)
- Invoice generation from project milestones with PDF output
- Invoice-linked payment recording with automatic UI refresh (summary cards, progress bar, invoice table)
- Payment tracking with multiple payment methods
- Payment history per invoice
- Firm settings configuration (branding, bank details, invoice defaults)
- Notification system
- Light/dark theme toggle
- Responsive sidebar navigation

---

## 2. Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router) | 15.5.0 |
| Language | TypeScript | 5 |
| UI Library | React | 18.3.1 |
| Component Library | Radix UI + shadcn/ui | 25+ primitives |
| State Management | Redux Toolkit | 2.11.0 |
| API Layer | RTK Query (built into Redux Toolkit) | - |
| State Persistence | Redux Persist | 6.0.0 |
| Form Handling | React Hook Form | 7.68.0 |
| Form Validation | Zod | 4.1.13 |
| Form Resolvers | @hookform/resolvers | 5.2.2 |
| HTTP Client | Axios | 1.13.2 |
| Styling | Tailwind CSS | 4 |
| Class Utilities | tailwind-merge, class-variance-authority | - |
| Icons | Lucide React | - |
| Charts | Recharts | 2.15.2 |
| Date Handling | date-fns | 4.1.0 |
| Notifications | Sonner | 2.0.3 |
| Theming | next-themes | 0.4.6 |
| Image Cropping | react-image-crop | 11.0.10 |
| Carousel | embla-carousel-react | 8.6.0 |
| Concurrency | async-mutex | - |
| Linting | ESLint 9 + Prettier | - |
| Dev Bundler | Turbopack | - |

---

## 3. Folder Structure

```
griha-app/
├── src/
│   ├── app/                           # Next.js App Router pages
│   │   ├── layout.tsx                 # Root layout (providers, fonts, toaster)
│   │   ├── page.tsx                   # Home page (role-based redirect)
│   │   ├── globals.css                # Global styles and Tailwind imports
│   │   ├── error.tsx                  # Client-side error boundary
│   │   ├── global-error.tsx           # Root-level error boundary
│   │   ├── loading.tsx                # Global loading state
│   │   ├── not-found.tsx              # 404 page
│   │   ├── (auth)/                    # Auth route group
│   │   │   └── sign-in/              # Login page
│   │   ├── (dashboard)/              # Dashboard route group (role-based)
│   │   │   ├── layout.tsx            # Dashboard layout (MainLayout wrapper)
│   │   │   ├── manager/             # Manager routes
│   │   │   ├── accountant/          # Accountant routes
│   │   │   ├── admin/               # Admin routes
│   │   │   ├── employee/            # Employee routes
│   │   │   └── super-admin/         # Super admin routes
│   │   ├── (admin)/                  # Legacy admin route group
│   │   └── role-selection/           # Role selection page
│   │
│   ├── components/                    # React components
│   │   ├── ui/                       # Radix/shadcn UI primitives (35+ components)
│   │   ├── auth/                     # Auth components (RoleGuard)
│   │   ├── Sidebar/                  # Sidebar components (modular)
│   │   ├── clients/                  # Client feature components
│   │   │   ├── ClientsPage/
│   │   │   ├── AddClientForm/
│   │   │   └── ClientDetailsPage/
│   │   ├── CRMPage/                  # CRM feature
│   │   ├── EnquiryPage/              # Enquiry feature
│   │   ├── FirmSettings/             # Firm settings feature
│   │   ├── figma/                    # Figma-derived components
│   │   ├── MainLayout.tsx            # Main app layout
│   │   ├── DashboardHeader.tsx       # Page header with notifications
│   │   ├── ThemeProvider.tsx          # Theme context provider
│   │   ├── SidebarProvider.tsx        # Sidebar state context
│   │   ├── ThemeToggle.tsx            # Light/dark toggle
│   │   ├── LoginPage.tsx              # Login form
│   │   ├── LogoutButton.tsx           # Logout action
│   │   ├── AddEmployeeForm.tsx        # Employee creation (multi-section)
│   │   ├── AddEmployeePersonalSection.tsx
│   │   ├── AddEmployeePersonalSectionWithCrop.tsx
│   │   ├── AddEmployeeAddressSection.tsx
│   │   ├── AddEmployeeEmploymentSection.tsx
│   │   ├── AddEmployeeEmergencySection.tsx
│   │   ├── AddEmployeeProfessionalSection.tsx
│   │   ├── AddEmployeeFormHeader.tsx
│   │   ├── AddEmployeeFormSectionHeader.tsx
│   │   ├── AddEmployeeFormActions.tsx
│   │   ├── EmployeesPage.tsx          # Employee list
│   │   ├── EmployeeDetailsPage.tsx    # Employee details view
│   │   ├── EmployeeDashboard.tsx      # Employee role dashboard
│   │   ├── AdminDashboard.tsx         # Admin role dashboard
│   │   ├── AccountantDashboard.tsx    # Accountant role dashboard
│   │   ├── ManagerDashboard.tsx       # Manager role dashboard
│   │   ├── SuperAdminDashboard.tsx    # Super admin role dashboard
│   │   ├── SharedDashboard.tsx        # Shared dashboard components
│   │   ├── ProjectsPage.tsx           # Project list
│   │   ├── ProjectDetailsPage.tsx     # Project details view
│   │   ├── ProjectOverview.tsx        # Project overview card
│   │   ├── ProjectProgress.tsx        # Progress tracking component
│   │   ├── PaymentPage.tsx            # Payment management
│   │   ├── PaymentStatistics.tsx      # Payment metrics
│   │   ├── PaymentReports.tsx         # Payment reporting
│   │   ├── PaymentScheduleManager.tsx # Payment scheduling
│   │   ├── ProjectDetailsPage/        # Project details subcomponents
│   │   │   ├── PaymentsTab.tsx        # Invoice payment tracker (summary cards, progress bar, invoice table with status filters)
│   │   │   ├── RecordPaymentModal.tsx  # Record payment against invoice (amount, date, method, reference, notes)
│   │   │   ├── PaymentHistoryModal.tsx # View payment history per invoice
│   │   │   └── InvoiceStatusBadge.tsx  # Color-coded invoice status badge
│   │   ├── InvoiceGenerationModal.tsx # Invoice creation from milestones
│   │   ├── BudgetChart.tsx            # Recharts budget visualization
│   │   ├── CalendarWidget.tsx         # Calendar component
│   │   ├── TeamSection.tsx            # Team display section
│   │   ├── NotificationPage.tsx       # Full notification view
│   │   └── NotificationDropdown.tsx   # Header notification dropdown
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useDebounce.ts            # Value debouncing (500ms default)
│   │   └── useImageCrop.ts           # Image selection, validation, cropping
│   │
│   ├── lib/                           # Utilities and API layer
│   │   ├── api/                      # RTK Query API definitions
│   │   │   ├── apiSlice.ts           # Base API slice (auth endpoints)
│   │   │   ├── baseQuery.ts          # Base query with token refresh
│   │   │   ├── clientsApi.ts         # Client endpoints
│   │   │   ├── projectsApi.ts        # Project endpoints
│   │   │   ├── employeesApi.ts       # Employee endpoints
│   │   │   ├── milestonesApi.ts      # Milestone endpoints
│   │   │   ├── invoicesApi.ts        # Invoice endpoints
│   │   │   ├── paymentsApi.ts        # Payment endpoints
│   │   │   ├── firmSettingsApi.ts    # Firm settings endpoints
│   │   │   └── uploadApi.ts          # File upload endpoints
│   │   ├── validations/              # Zod validation schemas
│   │   │   ├── auth.ts               # Login form validation
│   │   │   ├── client.ts             # Client form validation
│   │   │   ├── employee.ts           # Employee form validation
│   │   │   └── firm-settings.ts      # Firm settings validation
│   │   ├── utils/                    # Helper functions
│   │   │   ├── date.ts              # UTC date conversion
│   │   │   ├── currency.ts          # Indian currency formatting
│   │   │   ├── uploadToS3.ts        # S3 presigned URL upload
│   │   │   └── cloudfront.ts        # CloudFront URL helpers
│   │   ├── constants/
│   │   │   └── uploadPaths.ts       # S3 folder path constants
│   │   ├── rbac.ts                   # Role-based access control utilities
│   │   ├── cookies.ts                # Cookie get/set/delete helpers
│   │   └── imageValidation.ts        # Image file validation and compression
│   │
│   ├── store/                         # Redux store
│   │   ├── store.ts                  # Store configuration with RTK Query
│   │   ├── StoreProvider.tsx          # Redux Provider + PersistGate
│   │   ├── hooks.ts                  # Typed useAppDispatch, useAppSelector
│   │   └── slices/
│   │       └── authSlice.ts          # Auth state (user, isAuthenticated)
│   │
│   ├── types/                         # TypeScript interfaces
│   │   ├── client.ts                 # Client types and filters
│   │   ├── employee.ts               # Employee types and filters
│   │   ├── project.ts                # Project types, milestone, document
│   │   ├── payment.ts                # Payment types, enums, DTOs
│   │   ├── milestone.ts              # Milestone types
│   │   ├── firm-settings.ts          # Firm settings types
│   │   ├── notification.ts           # Notification types
│   │   ├── leave.ts                  # Leave types
│   │   ├── attendance.ts             # Attendance types
│   │   └── enquiry.ts                # Enquiry types
│   │
│   └── styles/                        # Additional CSS files
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 4. Application Architecture

### Layout Structure

**Root Layout** (`src/app/layout.tsx`):
```
<html>
  <body>
    StoreProvider (Redux + PersistGate)
      ThemeProvider (light/dark mode context)
        SidebarProvider (sidebar collapse/mobile state)
          {children}
          Toaster (Sonner notifications, top-right)
```

**Dashboard Layout** (`src/app/(dashboard)/layout.tsx`):
```
MainLayout
  ├── Background (animated gradient blobs, grid overlay)
  ├── Sidebar (fixed, role-based navigation)
  │   ├── SidebarHeader (logo, close button)
  │   ├── NavigationLinks (role-specific menu items)
  │   └── UserProfile (current user info, logout)
  ├── DashboardHeader (page title, notifications, theme toggle)
  └── Main content area ({children})
```

**Responsive Behavior:**
- Desktop: Sidebar fixed left, collapsible (64px collapsed, 256px expanded), main content adjusts margin
- Mobile: Sidebar as drawer overlay, hamburger toggle in header

### Component Organization

- **UI primitives** (`components/ui/`): Radix-based shadcn components (button, input, card, dialog, form, select, table, tabs, etc.). Generic, reusable.
- **Feature components**: Colocated with their feature or at the top level of `components/`. Some features have dedicated subdirectories (clients/, Sidebar/, FirmSettings/, CRMPage/).
- **Layout components**: MainLayout, DashboardHeader, ThemeProvider, SidebarProvider at the top level of `components/`.
- **Dashboard components**: Role-specific dashboards (AdminDashboard, ManagerDashboard, etc.) as standalone components.
- **Employee form**: Split into section components (Personal, Address, Employment, Emergency, Professional) with a shared header and actions component.

### Feature Grouping

Features are grouped by role in the routing layer (`app/(dashboard)/[role]/`) but share components across roles. For example, `ProjectsPage.tsx` is used by admin, manager, and super-admin routes. Page files in the route directories are thin wrappers that render the shared components.

---

## 5. State Management

### Global State

**Redux Toolkit** with a single store containing:

1. **Auth Slice** (`store/slices/authSlice.ts`):
   - State: `{ user: User | null, isAuthenticated: boolean }`
   - Actions: `setCredentials(user)`, `logout()`, `setUser(user)`
   - Persisted to localStorage via Redux Persist (whitelist: `user`, `isAuthenticated`)

2. **RTK Query API Slice** (auto-managed):
   - Handles all API request state (loading, data, error)
   - Manages normalized cache with tag-based invalidation

### API State Handling

**RTK Query** provides automatic:
- Request deduplication
- Loading/error/success states per endpoint
- Cache normalization
- Optimistic updates (where configured)
- Automatic refetching on focus, reconnect, and arg change

### Caching Strategy

```
Global defaults:
  keepUnusedDataFor: 60 seconds
  refetchOnMountOrArgChange: 30 seconds
  refetchOnFocus: true
  refetchOnReconnect: true

Cache tags used for invalidation:
  "User", "Client", "Project", "Employee", "Milestone",
  "Payment", "FirmSettings", "Invoice", "Profile",
  "Post", "Notification"

Per-endpoint overrides:
  Some endpoints set keepUnusedDataFor: 300 (5 minutes)
```

Tag-based invalidation: Mutations invalidate specific tags, causing related queries to refetch. For example, creating a client invalidates `"Client"` tags, which refetches any active client list queries.

Tag naming conventions per module:
  - List: `{ type, id: "LIST" }`
  - By project: `{ type, id: "PROJECT_{projectId}" }`
  - By milestone: `{ type, id: "MILESTONE_{milestoneId}" }`
  - By invoice: `{ type: "Payment", id: "INVOICE_{invoiceId}" }`
  - Invoice summary: `{ type: "Invoice", id: "SUMMARY_{projectId}" }`
  - Payment project summary: `{ type: "Payment", id: "PROJECT_{projectId}_SUMMARY" }`
  - Individual: `{ type, id: "{entityId}" }`

Cross-module invalidation: The `createInvoicePayment` mutation invalidates tags across Payment, Invoice, Milestone, and Project types to ensure all related UI (summary cards, progress bars, invoice tables, milestone views) refresh after a payment is recorded.

---

## 6. API Integration

### How API Calls Are Handled

All API calls go through **RTK Query** endpoint definitions. Each feature has its own API slice file (`lib/api/[feature]Api.ts`) that injects endpoints into the base API slice.

### Base Query Setup (`lib/api/baseQuery.ts`)

- **Base URL:** `process.env.NEXT_PUBLIC_API_URL` or `http://localhost:4000/api/v1`
- **Credentials:** `include` (sends cookies with requests)
- **Token Injection:** `prepareHeaders` reads `accessToken` from `document.cookie` and sets `Authorization: Bearer {token}`
- **Content-Type:** `application/json` (default)

### Token Refresh Interceptor (`baseQueryWithReauth`)

```
1. Execute original request
2. If 401 response AND endpoint is not an auth endpoint:
   a. Acquire mutex lock (async-mutex prevents concurrent refresh attempts)
   b. Read refreshToken and userId from cookies/localStorage
   c. POST /auth/refresh with { refreshToken, userId }
   d. On success: Store new tokens in cookies, retry original request
   e. On failure: Clear all auth state, redirect to /sign-in
3. Release mutex lock
4. Auth endpoints excluded from refresh: /auth/login, /auth/refresh, /auth/logout
```

### API Slice Files

| File | Endpoints |
|------|-----------|
| `apiSlice.ts` | login, logout, getCurrentUser, getUserProfile, updateUserProfile |
| `clientsApi.ts` | getClients, getClientById, checkEmailAvailability, checkPhoneAvailability, getClientStatistics, searchClients, createClient, updateClient, deleteClient, bulkDeleteClients |
| `projectsApi.ts` | getProjects, getAllProjects, getProjectById, getProjectsByClient, getProjectsByEmployee, getProjectStatistics, createProject, updateProject, deleteProject, hardDeleteProject, restoreProject |
| `employeesApi.ts` | getEmployees, getEmployeeStatistics, checkEmailAvailability, checkPhoneAvailability, getManagers, getEmployeeById, getEmployeesByManager, createEmployee, updateEmployee, deleteEmployee |
| `milestonesApi.ts` | getMilestonesByProject, getProjectProgressSummary, getMilestoneById, createMilestone, updateMilestone, updateMilestoneProgress, updateMilestoneStatus, deleteMilestone, reorderMilestones |
| `invoicesApi.ts` | getInvoices, getInvoicesByProject, getInvoiceById, getInvoiceSummary, generateInvoiceNumber, createInvoice, updateInvoice, markInvoiceAsSent, recordInvoicePayment, cancelInvoice, deleteInvoice, generateInvoicePdf |
| `paymentsApi.ts` | getPayments, getPaymentsByProject, getPaymentsByMilestone, getPaymentsByInvoice (payments for a specific invoice), getProjectPaymentSummary, getPaymentById, createPayment (milestone-based), createInvoicePayment (invoice-linked: creates Payment record, auto-invalidates Invoice/Payment/Milestone/Project caches), updatePayment, markPaymentPaid, deletePayment, generatePaymentPdf |
| `firmSettingsApi.ts` | getFirmSettings, getDefaultFirmSettings, getFirmSettingsById, createFirmSettings, updateFirmSettings, setFirmSettingsAsDefault, deleteFirmSettings |
| `uploadApi.ts` | uploadFile, uploadFiles, getPresignedUrl, deleteFile |

---

## 7. Authentication Flow

### Login

1. User enters email and password on `/sign-in`
2. Form validated via Zod schema (email format, password min 6 chars)
3. `POST /auth/login` with credentials
4. Response: `{ tokens: { accessToken, refreshToken }, user: { ... } }`
5. Tokens stored:
   - `accessToken` cookie (1-day expiry, Secure, SameSite=Strict)
   - `refreshToken` cookie (7-day expiry, Secure, SameSite=Strict)
6. Redux: `dispatch(setCredentials({ user }))`
7. Redirect based on role: `/{role}/dashboard`

### Token Storage

- **Cookies:** `accessToken` and `refreshToken` via `setCookie()` utility (Secure flag, SameSite=Strict, UTF-8 encoded)
- **localStorage:** Redux Persist saves `{ user, isAuthenticated }` under key `"auth"`

### Token Refresh

- Automatic via `baseQueryWithReauth` when any API call returns 401
- Mutex-locked to prevent concurrent refresh race conditions
- On success: new tokens stored, original request retried
- On failure: full logout (clear cookies, clear Redux state, redirect to `/sign-in`)

### Protected Routes

- Dashboard layout (`(dashboard)/layout.tsx`) wraps all protected pages in `MainLayout`
- `MainLayout` checks `isAuthenticated` and `accessToken` presence
- `RoleGuard` component (`components/auth/RoleGuard.tsx`) provides role-based component rendering
- Home page (`/`) redirects unauthenticated users to `/sign-in`

### Logout

1. `POST /auth/logout` (best effort)
2. `deleteCookie("accessToken")`, `deleteCookie("refreshToken")`
3. `dispatch(logout())` clears Redux auth state
4. Redirect to `/sign-in`

---

## 8. UI Patterns

### Form Handling

- **Library:** React Hook Form with Zod resolver
- **Pattern:** `useForm()` with `zodResolver(schema)`, field registration via `register()` or `Controller`, error display from `formState.errors`
- **Validation schemas** in `lib/validations/`:
  - `auth.ts` - email (required, valid format), password (required, min 6)
  - `client.ts` - name fields (max 50, no numbers/special chars), email, phone (regex), address, enums for status/priority/source/companyType
  - `employee.ts` - Unicode-aware name regex, cross-field date validation (hireDate must not be after joinDate), nested address schema, enum validations for department/employmentType/role
  - `firm-settings.ts` - firm details validation

### Table Patterns

- Used for clients, employees, projects, payments lists
- Features: column sorting, search filtering, pagination, row selection
- Built with Radix UI table primitives and Tailwind styling

### Modal/Dialog Patterns

- `ImageCropDialog` - Image selection and cropping with preview
- `InvoiceGenerationModal` - Milestone selection and invoice configuration
- Standard `Dialog` component from Radix for confirmations and forms

### Toast Notifications

- Library: Sonner
- Position: top-right
- Rich colors enabled
- Used for: operation success, API errors, validation feedback, background operation status

### Card Patterns

- Dashboard metrics displayed in cards with icons and values
- Project overview, payment statistics, budget charts wrapped in card containers
- Glass morphism effect: backdrop-blur with opacity on card backgrounds

---

## 9. Performance Strategy

### Code Splitting / Lazy Loading

- Next.js App Router automatically code-splits by route
- Each page is a separate chunk loaded on navigation
- Turbopack used in development for faster builds

### Caching

- RTK Query manages API response caching with configurable TTL
- Unused cache entries evicted after 60 seconds (default) or 300 seconds (specific endpoints)
- Tag-based invalidation ensures stale data is refetched after mutations
- Redux Persist caches auth state in localStorage across page reloads

### Debouncing

- `useDebounce` hook (500ms default) applied to search inputs across client, employee, and project lists
- Prevents excessive API calls during typing

### Image Optimization

- Image compression before upload (`compressImage` utility with recursive quality degradation)
- Presigned URL upload: files go directly from browser to S3, bypassing the backend
- CloudFront CDN serves all uploaded images

### Memoization

- Redux selectors for derived state
- React Hook Form minimizes re-renders via uncontrolled component pattern

---

## 10. Implemented Modules

### Authentication
- Login page with email/password form
- JWT token management with automatic refresh
- Role-based redirects after login
- Logout with token cleanup

### Manager Dashboard (`/manager/`)
- Dashboard overview with metrics
- Client management (list, create, view details)
- Project management (list, view details)
- Invoice creation and preview (from project milestones)
- Notifications

### Accountant Dashboard (`/accountant/`)
- Financial overview dashboard
- Payment tracking and management
- Project finance views
- Invoice creation and preview

### Admin Dashboard (`/admin/`)
- Administrative overview dashboard
- Client management (full CRUD)
- Employee management (full CRUD with multi-section form)
- Project management (full CRUD)
- Payment management
- Firm settings configuration (firm details, bank info, invoice defaults, logo)
- Notifications

### Employee Dashboard (`/employee/`)
- Personal overview dashboard
- View assigned projects
- View project invoices

### Super Admin Dashboard (`/super-admin/`)
- System overview dashboard
- Client management (full CRUD)
- Employee management (list)
- Project management (full CRUD)
- System-wide payment tracking
- Notifications

### Legacy Admin Section (`(admin)/`)
- Dashboard, clients, team, CRM, marketing, finance, payments, enquiries, notifications
- Parallel route group (exists alongside role-based routes)

### Shared Features
- Image upload with cropping (avatar management)
- S3 presigned URL file uploads
- Responsive sidebar navigation with role-based menus
- Light/dark theme toggle
- Toast notification system
- Budget charts (Recharts)
- Calendar widget
- Team section display

---

## 11. Suggestions

### Performance Improvements

- **Implement virtual scrolling:** For long lists (clients, payments), consider a virtualized list component to reduce DOM nodes.
- **Add image lazy loading:** Use Next.js `Image` component with lazy loading for avatar images in lists and cards.
- **Optimize bundle size:** Audit Radix UI imports to ensure tree-shaking is working. Some imports may pull in entire packages.
- **Add prefetching:** Use RTK Query's `prefetch` capabilities on hover/focus for detail pages to reduce perceived load time.

### Security Improvements

- **Move tokens to httpOnly cookies:** Currently, tokens are stored in document-accessible cookies (`setCookie` without httpOnly). Move token management to the backend with httpOnly, Secure cookies to prevent XSS-based token theft.
- **Add CSRF protection:** If switching to httpOnly cookies, implement CSRF tokens for state-changing requests.
- **Sanitize rendered content:** Ensure any user-generated content (notes, descriptions) is sanitized before rendering to prevent XSS.
- **Add Content Security Policy:** Configure CSP headers in Next.js middleware to restrict resource loading.

### Scalability Improvements

- **Implement server-side rendering for SEO pages:** Currently force-dynamic rendering is used. For public-facing pages (if any are added), use SSR or static generation.
- **Add error boundary per feature:** Currently only root-level error boundaries exist. Add feature-level error boundaries so a failure in one section does not crash the entire app.
- **Implement offline support:** Consider service workers and RTK Query's offline capabilities for critical read operations.

### Code Structure Improvements

- **Consolidate component organization:** Employee form sections, dashboard components, and page components are scattered at the top level of `components/`. Group them into feature directories (e.g., `components/employees/`, `components/dashboards/`, `components/projects/`).
- **Extract shared page patterns:** Client, project, and employee list pages share similar patterns (search, filters, table, pagination). Extract a shared list page template component.
- **Add unit tests:** No test files were found in the frontend codebase. Add tests for critical utilities (cookie management, RBAC, validation schemas) and key components (login flow, token refresh).
- **Type consistency:** Some types are defined inline in API slice files while others are in `types/`. Consolidate all types into the `types/` directory.
- **Remove legacy routes:** The `(admin)/` route group appears to be a legacy parallel to the role-based `(dashboard)/` routes. Evaluate if it can be removed to reduce confusion and maintenance burden.
- **Add loading skeletons:** Replace generic loading states with skeleton screens matching the page layout for better perceived performance.

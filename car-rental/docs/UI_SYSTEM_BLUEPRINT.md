# DriveX UI System Blueprint (Current State)

## 1. Purpose of This Document
This is a complete UI anatomy of the current DriveX web application so a design AI can create a refreshed look without losing functionality.

Use this as source-of-truth for:
- Information architecture
- All pages and sections
- Shared components and behaviors
- Interaction patterns, states, and role-based differences
- Visual language (theme, spacing, motion, typography)

## 2. Product Scope and Roles
DriveX is a multi-role car-rental platform with three primary roles:
- `user`: discovers cars and books trips
- `owner`: lists cars and manages fleet/bookings
- `admin`: manages platform operations, moderation, analytics, and configuration

## 3. Route Map and Access Model

### Public routes
- `/` -> Landing
- `/auth/login` -> Login
- `/auth/signup` -> Signup
- `/search` -> Vehicle search/discovery
- `/vehicle/:id` -> Vehicle details + booking

### Authenticated routes
- `/profile` -> User profile/settings
- `/notifications` -> Notifications center

### Role-protected routes
- `/user/dashboard` -> User dashboard (`user`, `admin`)
- `/owner/dashboard` -> Owner dashboard (`owner`, `admin`)
- `/admin` -> Admin dashboard (`admin` only)

### Access/guard behavior
- `ProtectedRoute` shows `PageSkeleton` during auth loading.
- If unauthenticated: redirects to `/auth/login`.
- If role mismatch: redirects to `/`.

## 4. Global App Shell

## 4.1 Layout
The global shell (`Layout`) wraps all pages and contains:
- sticky top navbar
- scroll progress bar at top edge
- animated background blobs with parallax on scroll
- optional cursor glow effect (desktop)
- page transition wrapper around route outlet
- footer
- mobile bottom navigation (outside route tree, hidden on auth pages)

## 4.2 Navigation
Desktop navbar contains:
- logo + branding
- primary links: `Browse Cars`, `Dashboard` (conditional)
- notifications icon (if logged in)
- user profile dropdown with role badge
- auth CTAs (`Sign in`, `Get started`) when logged out

Mobile navigation:
- fixed bottom tab bar (`Home`, `Search`, `Bookings`, `Alerts` if user logged in, `Profile/Login`)
- hidden on `/auth/*`

## 4.3 Global feedback
- `react-hot-toast` top-right toasts with custom skin (`CustomToast`)
- standardized loading skeletons (`Skeletons.tsx`)
- reusable empty and error states (`States.tsx`)

## 5. Visual Design System (Current)

## 5.1 Color direction
Overall style: dark, neon-accented, high-contrast glassmorphic UI.

Primary palette:
- Primary: red-orange (`#ff4433`)
- Accent: neon green (`#00ff87`)
- Neon blue (`#00d4ff`)
- Neon purple (`#a855f7`)
- Deep dark surfaces (`#0d0e14`, `#1a1b23`)

## 5.2 Typography
Configured families:
- `sans`: Inter
- `display`: Poppins
- `mono`: JetBrains Mono

Heading style:
- heavy weight, tight tracking, high contrast white text

## 5.3 Surface language
- rounded surfaces (`xl`, `2xl`, `3xl`) and rounded pill CTAs
- layered cards with low-opacity borders
- blur-backed glass layers (`card-glass` patterns)
- glow shadows for interactive emphasis

## 5.4 Motion language
Frequent animations:
- fade/slide/scale entrances
- scroll reveal via IntersectionObserver
- animated aurora blobs
- shimmer skeleton loaders
- button gradient motion and glow intensification on hover
- confetti for success moments

## 6. Page-by-Page UI Breakdown

## 6.1 Landing (`/`)
Purpose: brand storytelling + discovery entry.

### Major sections (top to bottom)
1. Hero:
- large split layout: text left, visual collage right
- dynamic typewriter text in headline
- search box with magnetic CTA button
- social proof (avatars + star rating)
- animated decorative blobs and spotlight interaction

2. Marquee strip:
- horizontally scrolling car brand names

3. How-it-works:
- three sequential cards (search, book, pickup)

4. Value proposition bento grid:
- large feature image card
- supporting stat cards and mini feature tiles

5. Testimonials:
- user quote cards with star ratings

6. Featured vehicles carousel (`DragCarousel` + `VehicleCard`)

7. FAQ accordion (`FAQAccordion`)

8. Final CTA section

### Key interactions
- hero search submits to `/search?query=...`
- hover-rich visual interactions
- staggered reveal effects on scroll

### Mobile behavior
- stack-based vertical composition
- decorative and floating cards reduce complexity on smaller screens

## 6.2 Authentication (`/auth/login`, `/auth/signup`)
Purpose: account onboarding and access.

### Layout
Desktop split panel:
- left side: branded visual panel, trust copy, mini testimonial
- right side: auth form

Mobile:
- single column form with compact logo block

### Login page elements
- email input
- password input with show/hide toggle
- demo credentials section (`details/summary`)
- primary submit CTA
- switch link to signup

### Signup page elements
- name, email, password
- password strength indicator bars
- role selection cards (`Rent a car` vs `List my car`)
- submit CTA
- switch link to login

### Interaction outcomes
- success toast and role-based redirect:
  - admin -> `/admin`
  - owner -> `/owner/dashboard`
  - user -> `/user/dashboard`

## 6.3 Search Page (`/search`)
Purpose: high-control inventory discovery.

### Core regions
1. Top control bar:
- full-text query input
- filter drawer toggle with active-filter count
- grid/map mode toggle

2. Quick chips row:
- `Available Now`
- `Instant Booking`
- sort selector
- `Near Me` geolocation trigger
- `Save` search (logged-in only)
- saved-search dropdown (logged-in only)

3. Expanded filters panel:
- fuel
- transmission
- seats
- location
- min/max price
- date range

4. Results header:
- count text or loading text
- clear filters action

5. Results area:
- skeleton cards while loading
- empty state if no vehicles
- card grid (`VehicleCard`) when results exist

6. Pagination controls

7. Recently viewed (logged-in users)

### Data behavior
- debounced fetch (300ms)
- pagination aware
- optional user lat/lng for distance-based sorting

### Notable implemented-but-incomplete pattern
- view mode toggle supports `grid/map` state, but `MapView` is currently not rendered in page output.

## 6.4 Vehicle Details + Booking Flow (`/vehicle/:id`)
Purpose: full vehicle context and transaction conversion.

### Core sections
1. Back button
2. Image gallery hero:
- large image panel
- prev/next arrows
- dot indicators

3. Main content grid:
- left: vehicle info + reviews
- right: sticky booking sidebar

4. Vehicle info blocks:
- title and trust chips (`Instant Book`, owner/insurance verification)
- location, ratings, distance
- cancellation policy text
- specs grid (seats/transmission/fuel/year)
- description
- review list

5. Booking sidebar:
- daily price and optional weekend rate
- 4-step booking progress (`BookingStepper`)
- date selectors
- dynamic estimate with fee rows
- booking hold creation
- payment method selection
- hold countdown timer
- final confirmation panel with booking summary

### Price model currently shown in UI
- base: `days * baseRate`
- cleaning fee
- service fee: 5%
- tax: 18%
- refundable security deposit

### Success behavior
- payment success toast
- confetti (`fireworks`)
- CTA to user dashboard

## 6.5 User Dashboard (`/user/dashboard`)
Purpose: booking lifecycle management for renters.

### Structure
1. Header greeting
2. Stat gauges (`SpeedometerGauge`):
- total
- active
- upcoming
- completed

3. Animated tab group:
- all
- upcoming
- active
- completed
- cancelled

4. Booking list cards:
- vehicle thumb
- date range
- status badge
- total amount

5. Booking detail modal (on row click):
- status and basic details
- price breakdown
- status-dependent actions

### Status-dependent user actions
- Cancel booking (pending/held/confirmed)
- Raise dispute (active/completed)
- Leave review (completed)

## 6.6 Owner Dashboard (`/owner/dashboard`)
Purpose: fleet operations + owner revenue intelligence.

### Header area
- title + subtitle
- `Add Vehicle` CTA

### Stat gauges
- vehicles
- active bookings
- pending bookings
- revenue estimate

### Tabs
1. `My Vehicles`
- card list of owner vehicles
- status chip, price, location/spec snippets
- edit and delete actions

2. `Bookings`
- booking rows for owner inventory
- confirm action for pending/held bookings

3. `Analytics`
- range selector (weekly/monthly/yearly)
- KPI cards (earnings, occupancy, cancellation, projection)
- bar chart revenue trend
- occupancy donut chart

### Vehicle create/edit modal
Form includes:
- title, location, description
- seats, transmission, fuel, year
- base rate, weekend rate, cleaning fee, security deposit
- multi-file image upload
- create/update submit

## 6.7 Admin Dashboard (`/admin`)
Purpose: platform operations center.

### Layout paradigm
- left sidebar (collapsible) on desktop
- bottom mini-tab strip on mobile
- sticky top utility bar with refresh/export controls

### Admin tabs and UI responsibilities
1. `Overview` (analytics):
- KPI cards
- area chart for revenue trend
- pie chart for status distribution
- top vehicles bar chart
- breakdown/alerts/top-cities side cards

2. `Bookings`:
- search field
- paginated table
- CSV export

3. `Vehicles`:
- moderation table
- approve/reject pending vehicles

4. `Users`:
- searchable users table with role tags

5. `Disputes`:
- active dispute cards
- resolve actions (refund/dismiss)

6. `Audit Log`:
- action/entity timeline table

7. `Blacklist`:
- listed blocked users
- remove from blacklist
- add new blacklist entry form (userId + reason)

8. `Announcements`:
- create broadcast (title/message/type/targetRole)
- list and delete announcements

9. `Settings` (config):
- inline key/value editing with save/cancel

## 6.8 Profile Page (`/profile`)
Purpose: personal identity, security, and trust workflows.

### Blocks
1. Profile summary:
- avatar
- name/email/role
- verified chip if applicable

2. Editable profile form:
- full name
- phone
- address

3. Emergency contact sub-block:
- contact name
- phone
- relation

4. Referral program block:
- referral code display
- copy-to-clipboard CTA
- referral count/discount/active stats

5. Identity verification block:
- existing submissions list with status chips
- new submission controls:
  - doc type selector (identity/license/insurance)
  - multi-file upload (images/pdf)
  - submit CTA

6. Change password block:
- current/new/confirm fields
- show-password toggle

## 6.9 Notifications Page (`/notifications`)
Purpose: user communication inbox.

### Sections
- header with unread count
- `Mark all read` action
- notification list cards:
  - type icon (emoji mapping)
  - message
  - relative time
  - unread indicator dot
- pagination controls (20/page)

### Interaction
- click unread item to mark read
- mark all unread IDs in batch

## 7. Shared Component Inventory (All Frontend Components)

### Shell and navigation
- `Layout`: app shell + global effects
- `Navbar`: top nav with auth-aware controls
- `MobileBottomNav`: mobile tab navigation
- `Footer`: global footer with brand/link/contact blocks
- `ProtectedRoute`: auth and role gate
- `PageTransition`: route transition wrapper

### Content and interaction blocks
- `VehicleCard`: discovery card for single vehicle
- `StatusBadge`: status pill for bookings/vehicles/etc.
- `AnimatedTabs`: tab switcher with animated active indicator
- `BookingStepper`: booking funnel progress indicator
- `FAQAccordion`: expanding FAQ list
- `DragCarousel`: horizontal drag-scroll wrapper with arrows
- `MapView`: map-based vehicle plotting component (present in codebase)

### Motion and ambiance components
- `AnimatedCar`: decorative SVG hero object
- `GlowCursor`: desktop custom cursor glow
- `MouseSpotlight`: cursor-follow spotlight overlay
- `RoadDivider`: decorative separator
- `ScrollProgress`: top progress bar based on scroll depth
- `ScrollReveal`: animation-on-viewport wrapper

### Feedback and utility components
- `CustomToast`: typed toast API wrappers
- `Skeletons`: loading placeholders (`VehicleCardSkeleton`, `BookingRowSkeleton`, `StatCardSkeleton`, `PageSkeleton`)
- `States`: `EmptyState`, `ErrorState`
- `SpeedometerGauge`: dashboard metric gauge visual

## 8. Custom Hooks Inventory
- `useConfetti`: celebration/confetti effects (`fire`, `fireworks`, `stars`)
- `useMagnetic`: magnetic pointer pull effect for elements
- `useRippleEffect`: ripple click effect bootstrapped globally in App
- `useScrollReveal`: viewport visibility observer hook
- `useTilt`: 3D tilt/parallax hover transform hook
- `useTypewriter`: animated typing text hook

## 9. UI State and Feedback Patterns

### Loading
- favors skeleton cards/rows over spinners
- per-page loading booleans drive placeholder rendering

### Empty
- uses shared `EmptyState` for no-results/no-data contexts

### Errors
- inline `ErrorState` for page-level failures
- toasts for API/action failures

### Toast pattern categories
- generic: success/error/warning/info
- domain-specific: booking/payment/review/celebration

### Modal pattern
- full-screen dimmed backdrop
- rounded, blurred dark panel
- close via X and backdrop click

## 10. Responsive Behavior Summary
- mobile-first stacking for all major grids
- desktop introduces side-by-side panels and richer overlays
- dedicated mobile bottom nav for quick access
- sticky elements:
  - navbar
  - admin top bar
  - vehicle booking sidebar (desktop)

## 11. Data and API Touchpoints that Drive UI
Primary frontend API groups used by UI:
- `authAPI`
- `vehiclesAPI`
- `bookingsAPI`
- `paymentsAPI`
- `reviewsAPI`
- `notificationsAPI`
- `searchAPI`
- `ownerAPI`
- `adminAPI`
- `verificationsAPI`
- `announcementsAPI`
- `couponsAPI` (mostly dashboard/admin contexts)
- `tripReportsAPI` (workflow features not yet exposed heavily in visible pages)

## 12. Current UX Pain Points / Improvement Opportunities
These are useful targets for redesign AI while preserving functionality:
- Search page map mode exists in state but map rendering path is not integrated into the main search result switch.
- One quick action label appears as `?? Near Me` and should be normalized.
- Some admin flows still use direct low-level actions and can be unified into consistent modal/confirm patterns.
- Mixed component styling languages between public pages and admin console can be brought into a more cohesive design system.
- Dense admin information architecture can benefit from clearer hierarchy and progressive disclosure.

## 13. Redesign Constraints (Do Not Break)
When generating a new look, preserve:
- all routes and role-based access behavior
- all existing actions (book/cancel/dispute/review/approve/reject/export/config edit)
- all major state outputs (loading, empty, error, success)
- core booking funnel with 4-stage progression
- profile verification and referral workflows

## 14. Suggested Redesign Direction Inputs for AI
Pass these to design AI for enhancement:
- Keep premium + futuristic feel but improve readability density.
- Increase visual consistency between admin and consumer-facing pages.
- Formalize spacing scale and typography rhythm across dashboards and marketing pages.
- Rebuild component primitives (buttons/cards/forms/tables/modals) into one coherent design system layer.
- Preserve neon identity accents but reduce visual noise in data-heavy views.
- Upgrade map-based discovery into first-class mode if toggled.

---
This blueprint reflects the current implemented UI structure and behavior so a redesign can be comprehensive without losing capability coverage.

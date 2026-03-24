# ASSIGNMENT NO: 2

## Title: Requirement Engineering Process and IEEE SRS Preparation

---

## AIM

To apply Requirement Engineering (RE) stages for the **DriveX – Car Rental Web Application** and prepare an IEEE standard Software Requirement Specification (SRS).

---

## OBJECTIVES

- Understand Requirement Engineering lifecycle
- Identify and refine requirements
- Classify Functional and Non-Functional requirements
- Prepare structured IEEE SRS
- Generate stage-wise deliverables

---

## CASE STUDY

### DriveX – Car Rental Web Application

DriveX is a full-stack web-based peer-to-peer car rental platform that connects vehicle owners with renters. Built with **React + TypeScript** frontend and **Python/FastAPI** backend with **MongoDB**, it supports vehicle listing, searching, booking with hold-based reservation, simulated payments, reviews, notifications, and admin analytics. Three user roles interact through the system: **Renters**, **Vehicle Owners**, and **Administrators**.

---

## REQUIREMENT ENGINEERING STAGES

---

### 1. Feasibility Study

**Purpose:** Check technical, economic, and operational feasibility of DriveX.

| Feasibility Type | Assessment |
|---|---|
| **Technical** | React, FastAPI, MongoDB, Redis, Docker – all mature, open-source technologies with strong community support. Team has required expertise. |
| **Economic** | Open-source stack with no licensing cost. Hosting on a single Docker-based server keeps infrastructure cost minimal. |
| **Operational** | Web-based access requires only a modern browser. No special training needed for end-users. Admin panel provides easy platform management. |

**Deliverables:**
- Feasibility Report
- Problem Definition Document

---

### 2. Requirement Elicitation

**Purpose:** Collect requirements from stakeholders.

**Techniques Used:** Interview, Questionnaire, Observation, Competitor Analysis

**Stakeholders Identified:**

| Stakeholder | Role |
|---|---|
| Renters (Users) | Browse, book, and pay for vehicles |
| Vehicle Owners | List vehicles, manage fleet, track earnings |
| Administrators | Moderate platform, view analytics, manage users |
| Development Team | Build and maintain the system |

**Sample Raw Requirements:**
- Users should be able to search vehicles by fuel type, transmission, seats, price, and location
- Owners should be able to upload multiple images for a vehicle
- System should prevent double-booking of vehicles
- Admin should see revenue charts and booking statistics
- Booking should auto-expire if payment is not made within a time limit

**Deliverables:**
- Stakeholder List
- Raw Requirement List
- Requirement Gathering Report

---

### 3. Requirement Analysis

**Purpose:** Refine, categorize, and structure the collected requirements.

#### Functional Requirements (FR)

| FR ID | Requirement |
|---|---|
| FR-01 | User registration & JWT-based authentication with role-based access (User, Owner, Admin) |
| FR-02 | Vehicle CRUD operations with multi-image upload by owners |
| FR-03 | Vehicle search with filters (fuel, transmission, seats, price range, location) and sorting |
| FR-04 | Hold-based booking creation with 15-min TTL and idempotency key to prevent duplicates |
| FR-05 | Smart pricing engine (weekend rates, long-term discounts, cleaning fee, deposit, 18% GST) |
| FR-06 | Tiered cancellation policy: 48h+ full refund, 24–48h 50%, <24h no refund |
| FR-07 | Review and rating system (1–5 stars) for completed bookings |
| FR-08 | In-app notification system with mark-as-read and pagination |
| FR-09 | Admin dashboard with analytics: revenue trends, booking distribution, top vehicles, CSV export |
| FR-10 | Background tasks for hold expiry, booking activation, completion, and archival |

#### Non-Functional Requirements (NFR)

| NFR ID | Requirement |
|---|---|
| NFR-01 | **Performance** – API response time < 500ms for 95% of requests |
| NFR-02 | **Security** – Bcrypt password hashing, JWT tokens, CORS policy enforcement |
| NFR-03 | **Usability** – WCAG-compliant accessibility: semantic HTML, ARIA labels, keyboard navigation |
| NFR-04 | **Reliability** – Atomic availability checks with optimistic locking to prevent double-booking |
| NFR-05 | **Scalability** – Dockerized deployment with Docker Compose for easy horizontal scaling |
| NFR-06 | **Rate Limiting** – API throttling via SlowAPI based on client IP |

#### Assumptions & Constraints
- Payments are simulated (no real gateway integration)
- Single currency: INR
- Images stored on local filesystem (no cloud storage)
- In-app notifications only (no email/SMS)
- System operates in UTC timezone

**Deliverables:**
- Functional Requirements List
- Non-Functional Requirements List
- Assumptions & Constraints Document

---

### 4. Requirement Specification (IEEE SRS)

**Purpose:** Document all requirements in IEEE 830 standard format.

**Main Sections of the SRS:**

| Section | Content |
|---|---|
| 1. Introduction | Purpose, scope, definitions, references, overview of DriveX |
| 2. Overall Description | Product perspective (3-tier architecture), product functions, user characteristics, constraints, assumptions |
| 3. System Features (FR) | Detailed functional requirements – auth, vehicle management, search, booking lifecycle, payments, reviews, notifications, admin dashboard, background tasks, audit logging |
| 4. Non-Functional Requirements | Performance, security, usability, reliability, scalability, rate limiting |

**Deliverables:**
- Final IEEE SRS Document
- Requirement Traceability Matrix (RTM)

#### Requirement Traceability Matrix (Sample)

| Req ID | Requirement | Design Module | Test Case |
|---|---|---|---|
| FR-01 | User authentication | Auth module (JWT) | TC-01: Login/Register |
| FR-04 | Hold-based booking | Booking engine | TC-04: Create booking with hold |
| FR-05 | Smart pricing | Pricing module | TC-05: Verify price calculation |
| FR-09 | Admin analytics | Admin dashboard | TC-09: Verify charts & CSV export |
| NFR-02 | Security (bcrypt, JWT) | Auth middleware | TC-S01: Token validation |

---

### 5. Requirement Validation

**Purpose:** Ensure requirements are correct, complete, consistent, and testable.

**Activities:**
- Requirement review meeting with stakeholders
- Checklist-based validation (completeness, consistency, testability)
- Prototype walkthrough of booking flow and admin dashboard

**Validation Checklist (Sample):**

| # | Check | Status |
|---|---|---|
| 1 | All FRs are testable | ✅ |
| 2 | No conflicting requirements | ✅ |
| 3 | NFRs have measurable criteria | ✅ |
| 4 | All user roles covered | ✅ |
| 5 | Edge cases addressed (hold expiry, double-booking) | ✅ |

**Deliverables:**
- Requirement Review Report
- Approved SRS

---

### 6. Requirement Management

**Purpose:** Handle requirement changes throughout the project lifecycle.

**Sample Change Request Log:**

| Change ID | Description | Priority | Status |
|---|---|---|---|
| CR-01 | Add map-based vehicle discovery | Medium | Approved |
| CR-02 | Add coupon/discount code system | Low | Approved |
| CR-03 | Add trip reports feature | Low | Approved |

**Version History:**

| Version | Date | Changes |
|---|---|---|
| 1.0 | 20/Feb/2026 | Initial SRS with core features |
| 1.1 | 25/Feb/2026 | Added map integration, coupons, trip reports |

**Deliverables:**
- Change Request Log
- Version History Document

---

## Summary Table

| RE Stage | Main Output |
|---|---|
| Feasibility | Feasibility Report (Technical, Economic, Operational) |
| Elicitation | Raw Requirements from Renters, Owners, Admin |
| Analysis | Refined FR (10) & NFR (6) for DriveX |
| Specification | IEEE SRS Document |
| Validation | Requirement Review Report |
| Management | Change Request Log & Version History |

---

## OUTCOME

Students will be able to:

- Apply complete Requirement Engineering lifecycle on a real web application project
- Develop clear and testable functional & non-functional requirements
- Prepare professional IEEE SRS document following IEEE 830 standard
- Manage requirement changes effectively using change logs and versioning

---

## FAQ

**Q1. Why is Requirement Engineering important?**

Requirement Engineering ensures that the software being developed meets stakeholder needs accurately. It reduces ambiguity, prevents costly rework, and provides a clear roadmap for development. For DriveX, RE helped identify critical features like hold-based booking, double-booking prevention, and tiered cancellation policy early in the process.

**Q2. What is the difference between FR and NFR?**

- **Functional Requirements (FR)** define *what* the system should do — e.g., "Users can search vehicles by filters," "System calculates pricing with GST."
- **Non-Functional Requirements (NFR)** define *how well* the system performs — e.g., "API response < 500ms," "Passwords hashed with bcrypt," "WCAG accessibility compliance."

**Q3. What is RTM? Why is RTM needed?**

A **Requirement Traceability Matrix (RTM)** maps each requirement to its corresponding design component and test case. It ensures every requirement is implemented and tested — nothing is missed or left unverified. For DriveX, the RTM links requirements like booking creation (FR-04) to the booking engine module and its corresponding test case, ensuring full coverage.

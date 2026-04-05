AgroLink Rwanda — Full Codebase Audit & Production Roadmap

Author: Clever — DOCKS Corporation | April 2025 | Kigali 🇷🇼


1. Executive Summary
AgroLink is a B2B agricultural marketplace connecting farming cooperatives to institutional buyers (hotels, restaurants, schools) in Rwanda. Payments go through MTN MoMo with escrow logic.
Current status:
✅ SOLID⚠️ PARTIAL❌ MISSINGLanding page, NestJS scaffold, TypeORM, JWT wiring, MoMo integration, Produce CRUDAuth (hardcoded users), Dashboard (static data), Signup (fake POST), Payment (no order link)Orders, Buyer Portal, Coop Portal, Route guards, Real users, SMS, Ratings

2. Full Feature Audit
2.1 Frontend (React + Vite + TypeScript)
AreaFeatureStatusNotesRoutingApp.tsx — 4 routes✅ DONESub-routes declared but pages missingLandingLandingPage.tsx — full page✅ DONEProduction quality. Static data only.Auth UILogin.tsx — posts to /auth/login✅ DONEWorks with demo users onlyAuth UISignup.tsx — collects coop data❌ PARTIALPOST is commented out. Does nothing.DashboardDashboard.tsx — metrics + table⚠️ PARTIALFalls back to static data. Metrics hardcoded.LayoutDashboardLayout.tsx — sidebar⚠️ PARTIAL4 of 5 sidebar links go to pages that don't existAuth GuardRoute protection on /dashboard❌ MISSINGAnyone can access /dashboard without a tokenRole UXDifferent portals per role❌ MISSINGAll roles see the same generic dashboardPages/dashboard/cooperatives❌ MISSINGSidebar link exists. Page does not. Crashes.Pages/dashboard/produce❌ MISSINGSidebar link exists. Page does not.Pages/dashboard/payments❌ MISSINGSidebar link exists. Page does not.Pages/dashboard/settings❌ MISSINGSidebar link exists. Page does not.BuyerFull Buyer Portal (/buyer/*)❌ MISSINGNo buyer portal at allCoopCooperative Manager Portal (/coop/*)❌ MISSINGNo coop portal at allOrdersOrder placement + tracking UI❌ MISSINGNo order flow anywherePaymentsMoMo payment initiation UI❌ MISSINGNo UI to trigger paymentRealtimeWebSocket notifications❌ MISSINGNo Socket.io in frontendUXToast notifications, skeletons, error states❌ MISSINGOnly basic inline error texti18nKinyarwanda / French❌ MISSINGEnglish onlyMapsMapbox integration❌ MISSINGNot startedMobilePWA manifest + service worker❌ MISSINGStandard Vite only

2.2 Backend (NestJS + TypeORM + PostgreSQL)
ModuleFeatureStatusNotesAuthJWT signing + verification✅ DONEJwtAuthGuard + RolesGuard applied globallyAuthReal User entity in DB❌ MISSINGUsers are hardcoded array in memoryAuthPOST /auth/register❌ MISSINGNo registration endpoint existsAuthbcrypt password hashing❌ MISSINGPlain text passwords (admin123) in source codeAuthToken refresh / logout❌ MISSINGNo refresh token flowCooperativesfindAll, create, update, softDelete✅ DONEFull CRUD. ConflictException on duplicate email.CooperativesDistrict, coordinates, verification fields❌ MISSINGEntity only has: name, managerName, phone, email, isActiveFarmersFull CRUD✅ DONEEntity has name, phone, email, cooperative FK, isActiveFarmersAuth credentials for manager login❌ MISSINGNo password field. Managers cannot log in.ProducefindAll, create, update, softDelete✅ DONEFull CRUD with validationProducegetTotalsByCooperative analytics✅ DONERaw SQL query grouping by cooperativeProducecategory, imageUrl, unit, harvestDate, district❌ MISSINGEntity only has: name, description, quantity, price, farmer, isActivePaymentsMoMo initiate, confirm, track, callback✅ DONEHTTP to MoMo sandbox. External ID pattern.PaymentsPayment linked to an Order❌ MISSINGPayment has no orderId FK. Not connected to anything.PaymentsEscrow release on delivery❌ MISSINGNo escrow logicOrdersOrders module — entity, service, controller❌ MISSINGBIGGEST GAP. No Order entity anywhere.OrdersOrder status machine❌ MISSINGNot startedSMSAfrica's Talking notifications❌ MISSINGNot startedWebSocketsSocket.io gateway❌ MISSINGNot startedRatingsRating + review entity❌ MISSINGNot startedAnalyticsAdmin analytics endpoints⚠️ PARTIALgetTotalsByCooperative exists. Nothing else.ConfigCORS configuration❌ MISSINGNo CORS in main.ts. Will break in production.SecurityRate limiting, Helmet, input sanitization❌ MISSINGOpen to brute forceConfig.env.example file❌ MISSINGNo documentation of required env vars

3. What Needs To Be Built — Full Vision
3.1 Backend
3.1.1 Real Authentication System

User entity: id, email, passwordHash, role (ADMIN | COOP_MANAGER | BUYER), phone, cooperativeId (nullable FK), isActive, createdAt
bcrypt password hashing on registration. Never store plain text.
POST /auth/register — creates User + Cooperative in one transaction
POST /auth/login — returns access_token (15min) + refresh_token (7 days)
POST /auth/refresh — exchanges refresh token for new access token
POST /auth/logout — blacklists refresh token
JWT payload includes role → drives which portal user sees after login

3.1.2 Orders Module — THE Core Feature

Order entity: id, buyerUserId (FK), produceId (FK), cooperativeId (FK), quantityKg, unitPrice, totalAmount, platformFee (totalAmount * 0.03), status, deliveryAddress, expectedDeliveryDate, paymentId (nullable FK)
Status machine: PENDING_PAYMENT → PAYMENT_HELD → CONFIRMED → IN_TRANSIT → DELIVERED → COMPLETED → DISPUTED → CANCELLED
POST /orders — buyer places order. Checks stock. Reduces produce.quantity. Creates linked Payment.
PATCH /orders/:id/confirm — cooperative manager confirms fulfilment
PATCH /orders/:id/dispatch — cooperative marks as in transit
PATCH /orders/:id/received — buyer confirms delivery. Triggers escrow release.
GET /orders/my — buyer's orders
GET /orders/cooperative — coop manager's incoming orders
GET /orders (ADMIN) — all orders

3.1.3 Produce Entity — Add Missing Fields
typescriptcategory: enum (VEGETABLES, FRUITS, GRAINS, LEGUMES, DAIRY, COFFEE, OTHER)
unit: enum (KG, PIECE, BAG, LITRE)
imageUrl: string (nullable)
harvestDate: Date (nullable)
expiryDate: Date (nullable)
district: string
isOrganic: boolean (default: false)
minimumOrderKg: float (default: 1)
3.1.4 Cooperative Entity — Add Missing Fields
typescriptdistrict: string
sector: string (nullable)
latitude: float (nullable)
longitude: float (nullable)
verificationStatus: enum (UNVERIFIED, PENDING, VERIFIED)
memberCount: number (default: 0)
imageUrl: string (nullable)
momoNumber: string
3.1.5 SMS Notifications (Africa's Talking)

Install africastalking npm package
NotificationsModule with SmsService
SMS triggers: order placed (to coop), payment confirmed (to coop), delivery confirmed (to buyer), cancellation
SMS in Kinyarwanda for cooperative managers

3.1.6 WebSocket Gateway

Install @nestjs/websockets + socket.io
OrdersGateway emitting: order:new, order:status_changed, payment:confirmed

3.1.7 Security Hardening

@nestjs/throttler — rate limit /auth/login (5 req/min)
helmet middleware in main.ts
CORS config in main.ts (allow only localhost:5173 in dev)
.env.example with all required keys

3.1.8 Ratings

Rating entity: id, orderId (unique FK), ratedByUserId, ratedCooperativeId, score (1-5), comment, createdAt
POST /ratings — only after order COMPLETED
GET /cooperatives/:id/ratings

3.1.9 Admin Analytics

GET /analytics/overview — GMV, total orders, active coops, active buyers
GET /analytics/revenue-by-date — chart data last 30/90 days
GET /analytics/top-cooperatives — ranked by volume
GET /analytics/top-produce — most ordered types


3.2 Frontend
3.2.1 Route Protection & Role Routing (BUILD THIS FIRST)

src/hooks/useAuth.ts — reads JWT, decodes with jwt-decode, exposes { user, role, isAuthenticated, logout }
src/components/ProtectedRoute.tsx — redirects to /login if unauthenticated
After login: ADMIN → /admin | COOP_MANAGER → /coop | BUYER → /buyer
src/api/axios.ts — Axios instance that attaches Bearer token + intercepts 401 → redirect to /login

3.2.2 Buyer Portal (/buyer/*)

/buyer/marketplace — all produce, filter by category/district/price/organic, sort options
/buyer/listing/:id — produce detail, coop info + rating, order form
/buyer/orders — order history with status badges
/buyer/orders/:id — order timeline, "Confirm Delivery" button when IN_TRANSIT
/buyer/profile — account settings

3.2.3 Cooperative Manager Portal (/coop/*)

/coop/dashboard — pending orders count, stock alerts, earnings this month
/coop/produce — list produce listings + "Add New" form (name, category, quantity, unit, price, harvestDate, district, organic, photo)
/coop/orders — incoming orders, accept/decline/dispatch buttons
/coop/earnings — completed payment history, MoMo payout records
/coop/profile — update coop details, momoNumber

3.2.4 Admin Portal (/admin/* — fix existing dashboard)

/admin/dashboard — real charts from API (Recharts), live GMV, orders/week, top produce, revenue by district
/admin/cooperatives — paginated table, verify/deactivate cooperatives
/admin/produce — all listings across all coops
/admin/orders — all orders, dispute handling
/admin/payments — full payment ledger
/admin/users — manage accounts, reset passwords

3.2.5 Real Signup Flow

Fix Signup.tsx to actually POST to /auth/register
Fields: cooperativeName, managerName, email, password, phone, district
Separate path for buyers: businessName, email, password, phone
Role selector on signup: "I am a cooperative" vs "I am a buyer"

3.2.6 Order Placement + Payment Flow

Buyer clicks "Place Order" → quantity input + delivery address
Order summary screen (quantity, price, platform fee 3%, total)
POST /orders → order created with PENDING_PAYMENT
POST /payments/initiate → MoMo prompt sent to buyer's phone
Frontend polls GET /payments/:externalId every 3 seconds
On confirmed → redirect to order detail with success toast
Coop manager gets SMS + real-time notification

3.2.7 UX Foundations

Install react-hot-toast
Skeleton loader components for cards and tables
ErrorBoundary component
ConfirmDialog reusable modal for destructive actions

3.2.8 PWA Setup (for Coop Manager mobile)

Install vite-plugin-pwa
Web app manifest: name, icons, theme: #0b1a0e, display: standalone
"Install App" prompt on /coop dashboard


4. Production Roadmap (8 Phases)
PhaseWhat to BuildTimelinePriorityPhase 1 — Backend AuthUser entity, bcrypt, POST /auth/register, POST /auth/refresh, .env.example, CORS + HelmetWeek 1🔴 CRITICALPhase 2 — Orders ModuleOrder entity, full status machine, all order endpoints, link Payment to Order, stock deductionWeek 2🔴 CRITICALPhase 3 — Frontend AuthProtectedRoute, useAuth(), role-based redirect, Axios interceptor, fix Signup, react-hot-toastWeek 3🔴 CRITICALPhase 4 — Buyer Portal/buyer/* pages, marketplace filter/search, order placement, MoMo payment UI, pollingWeek 4–5🟠 HIGHPhase 5 — Coop Portal/coop/* pages, produce CRUD, image upload, order management, PWAWeek 5–6🟠 HIGHPhase 6 — Admin PortalReal charts, /admin/cooperatives, /admin/orders, /admin/payments, /admin/usersWeek 7🟠 HIGHPhase 7 — NotificationsAfrica's Talking SMS, Kinyarwanda templates, WebSocket gateway, frontend Socket.ioWeek 8🟠 HIGHPhase 8 — PolishMissing entity fields, ratings, Mapbox, i18n, E2E tests, Docker, deployWeek 9–10🟡 MEDIUM

5. Target Entity Schemas
User Entity
typescript@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) email: string;
  @Column() passwordHash: string; // bcrypt — NEVER plain text
  @Column({ type: 'enum', enum: ['ADMIN', 'COOP_MANAGER', 'BUYER'] }) role: string;
  @Column() phone: string;
  @ManyToOne(() => Cooperative, { nullable: true }) cooperative: Cooperative;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
}
Order Entity
typescript@Entity()
export class Order {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => User) buyer: User;
  @ManyToOne(() => Produce) produce: Produce;
  @ManyToOne(() => Cooperative) cooperative: Cooperative;
  @Column('float') quantityKg: number;
  @Column('float') unitPrice: number;    // snapshot at time of order
  @Column('float') totalAmount: number;  // quantityKg * unitPrice
  @Column('float') platformFee: number;  // totalAmount * 0.03
  @Column({ type: 'enum', enum: ['PENDING_PAYMENT','PAYMENT_HELD','CONFIRMED','IN_TRANSIT','DELIVERED','COMPLETED','DISPUTED','CANCELLED'] })
  status: string;
  @Column() deliveryAddress: string;
  @Column({ nullable: true }) expectedDeliveryDate: Date;
  @OneToOne(() => Payment, { nullable: true }) payment: Payment;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

6. Full API Endpoint Map
MethodEndpointAuthStatusPOST/auth/registerPublic❌ MISSINGPOST/auth/loginPublic⚠️ EXISTS (demo only)POST/auth/refreshRefreshToken❌ MISSINGPOST/auth/logoutJWT❌ MISSINGGET/cooperativesPublic✅ EXISTSPOST/cooperativesADMIN✅ EXISTSPATCH/cooperatives/:idADMIN✅ EXISTSPATCH/cooperatives/:id/verifyADMIN❌ MISSINGDELETE/cooperatives/:idADMIN✅ EXISTSGET/producePublic✅ EXISTSGET/produce?category=&district=&minPrice=&maxPrice=Public❌ MISSING (no filters)GET/produce/:idPublic❌ MISSINGPOST/produceCOOP_MANAGER✅ EXISTSPATCH/produce/:idCOOP_MANAGER✅ EXISTSDELETE/produce/:idCOOP_MANAGER✅ EXISTSPOST/ordersBUYER❌ MISSINGGET/orders/myBUYER❌ MISSINGGET/orders/cooperativeCOOP_MANAGER❌ MISSINGGET/ordersADMIN❌ MISSINGPATCH/orders/:id/confirmCOOP_MANAGER❌ MISSINGPATCH/orders/:id/dispatchCOOP_MANAGER❌ MISSINGPATCH/orders/:id/receivedBUYER❌ MISSINGPATCH/orders/:id/cancelBUYER or ADMIN❌ MISSINGPOST/payments/initiateBUYER✅ EXISTSGET/payments/:externalIdJWT✅ EXISTSPOST/payments/callbackPublic✅ EXISTSPOST/ratingsBUYER❌ MISSINGGET/cooperatives/:id/ratingsPublic❌ MISSINGGET/analytics/overviewADMIN❌ MISSINGGET/analytics/revenue-by-dateADMIN❌ MISSINGGET/analytics/top-cooperativesADMIN❌ MISSING

7. Files To Create
Backend
src/users/user.entity.ts
src/users/users.module.ts
src/users/users.service.ts
src/users/users.controller.ts
src/users/dto/create-user.dto.ts
src/orders/order.entity.ts
src/orders/orders.module.ts
src/orders/orders.service.ts
src/orders/orders.controller.ts
src/orders/dto/create-order.dto.ts
src/orders/dto/update-order.dto.ts
src/notifications/notifications.module.ts
src/notifications/sms.service.ts
src/notifications/events.gateway.ts
src/ratings/rating.entity.ts
src/ratings/ratings.module.ts
src/ratings/ratings.service.ts
src/ratings/ratings.controller.ts
src/analytics/analytics.module.ts
src/analytics/analytics.service.ts
src/analytics/analytics.controller.ts
.env.example
Frontend
src/hooks/useAuth.ts
src/api/axios.ts
src/components/ProtectedRoute.tsx
src/components/ConfirmDialog.tsx
src/components/SkeletonCard.tsx
src/layouts/BuyerLayout.tsx
src/layouts/CoopLayout.tsx
src/layouts/AdminLayout.tsx
src/pages/buyer/Marketplace.tsx
src/pages/buyer/ProduceDetail.tsx
src/pages/buyer/PlaceOrder.tsx
src/pages/buyer/MyOrders.tsx
src/pages/buyer/OrderDetail.tsx
src/pages/buyer/BuyerProfile.tsx
src/pages/coop/CoopDashboard.tsx
src/pages/coop/CoopProduce.tsx
src/pages/coop/AddProduce.tsx
src/pages/coop/CoopOrders.tsx
src/pages/coop/CoopEarnings.tsx
src/pages/admin/AdminDashboard.tsx
src/pages/admin/AdminCooperatives.tsx
src/pages/admin/AdminOrders.tsx
src/pages/admin/AdminPayments.tsx
src/pages/admin/AdminUsers.tsx
src/pages/admin/AdminSettings.tsx

8. Required Environment Variables (.env)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=agrolink
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key
MTN_MOMO_API_KEY=your-mtn-sandbox-key
MTN_MOMO_USER_ID=your-mtn-user-id
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
AFRICAS_TALKING_API_KEY=your-at-key
AFRICAS_TALKING_USERNAME=sandbox
PORT=3000

AgroLink Rwanda — DOCKS Corporation — Built in Kigali 🇷🇼
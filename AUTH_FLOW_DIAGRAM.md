# Authentication Flow Diagrams

## Registration Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Fills registration form
       │    (name, phone, location, role)
       ▼
┌─────────────────────────┐
│  FarmerCreateAccount    │
│  Component              │
└──────┬──────────────────┘
       │
       │ 2. Validates with Zod schema
       │    - Name: 2-80 chars
       │    - Phone: +?[0-9]{9,15}
       │    - Location: 2-80 chars
       ▼
┌─────────────────────────┐
│  registerUser()         │
│  API Call               │
└──────┬──────────────────┘
       │
       │ 3. POST /api/auth/register
       │    Content-Type: application/json
       ▼
┌─────────────────────────┐
│  Express Validator      │
│  Middleware             │
└──────┬──────────────────┘
       │
       │ 4. Server-side validation
       │    - Checks field formats
       │    - Validates role
       ▼
┌─────────────────────────┐
│  registerUser()         │
│  Controller             │
└──────┬──────────────────┘
       │
       │ 5. Checks if phone exists
       ▼
┌─────────────────────────┐
│  MongoDB                │
│  User.findOne()         │
└──────┬──────────────────┘
       │
       │ 6. If exists: 409 Conflict
       │    If not: Create user
       ▼
┌─────────────────────────┐
│  User.create()          │
│  Save to Database       │
└──────┬──────────────────┘
       │
       │ 7. Generate JWT token
       ▼
┌─────────────────────────┐
│  signToken()            │
│  JWT Creation           │
└──────┬──────────────────┘
       │
       │ 8. Return token + user data
       ▼
┌─────────────────────────┐
│  Client receives        │
│  response               │
└──────┬──────────────────┘
       │
       │ 9. Store in localStorage
       │    - Token
       │    - User data
       ▼
┌─────────────────────────┐
│  sessionStore.setToken()│
│  sessionStore.setUser() │
└──────┬──────────────────┘
       │
       │ 10. Redirect to dashboard
       │     - Farmer → /farmer
       │     - Buyer → /buyer
       ▼
┌─────────────────────────┐
│  User Dashboard         │
└─────────────────────────┘
```

## Login Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Enters phone number
       ▼
┌─────────────────────────┐
│  FarmerLogin            │
│  Component              │
└──────┬──────────────────┘
       │
       │ 2. Validates with Zod
       │    Phone: +?[0-9]{9,15}
       ▼
┌─────────────────────────┐
│  loginUser()            │
│  API Call               │
└──────┬──────────────────┘
       │
       │ 3. POST /api/auth/login
       ▼
┌─────────────────────────┐
│  Express Validator      │
└──────┬──────────────────┘
       │
       │ 4. Server validation
       ▼
┌─────────────────────────┐
│  loginUser()            │
│  Controller             │
└──────┬──────────────────┘
       │
       │ 5. Find user by phone
       ▼
┌─────────────────────────┐
│  MongoDB                │
│  User.findOne()         │
└──────┬──────────────────┘
       │
       │ 6. If not found: 401
       │    If found: Generate token
       ▼
┌─────────────────────────┐
│  signToken()            │
└──────┬──────────────────┘
       │
       │ 7. Return token + user
       ▼
┌─────────────────────────┐
│  Client receives        │
└──────┬──────────────────┘
       │
       │ 8. Check role matches
       │    requested role
       ▼
┌─────────────────────────┐
│  Role Validation        │
└──────┬──────────────────┘
       │
       │ 9. Store in localStorage
       ▼
┌─────────────────────────┐
│  sessionStore           │
└──────┬──────────────────┘
       │
       │ 10. Redirect to dashboard
       ▼
┌─────────────────────────┐
│  User Dashboard         │
└─────────────────────────┘
```

## Protected Route Access Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Navigates to /farmer
       ▼
┌─────────────────────────┐
│  React Router           │
└──────┬──────────────────┘
       │
       │ 2. Encounters RequireAuth
       ▼
┌─────────────────────────┐
│  RequireAuth            │
│  Component              │
└──────┬──────────────────┘
       │
       │ 3. Check localStorage
       ▼
┌─────────────────────────┐
│  sessionStore.getToken()│
│  sessionStore.getUser() │
└──────┬──────────────────┘
       │
       ├─── No token/user ───┐
       │                     │
       │ 4. Has token/user   │ 5. Redirect to login
       ▼                     ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│  isTokenLikelyExpired() │ │  /login?next=/farmer    │
└──────┬──────────────────┘ └─────────────────────────┘
       │
       ├─── Expired ─────────┐
       │                     │
       │ 6. Not expired      │ 7. Clear session
       ▼                     │    Redirect to login
┌─────────────────────────┐ │
│  Check user role        │ │
└──────┬──────────────────┘ │
       │                     │
       ├─── Wrong role ──────┤
       │                     │
       │ 8. Correct role     │
       ▼                     ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│  Render protected       │ │  Redirect to login      │
│  component              │ │  with role parameter    │
└─────────────────────────┘ └─────────────────────────┘
```

## API Request with Authentication Flow

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │
       │ 1. Needs to fetch data
       ▼
┌─────────────────────────┐
│  Get token from         │
│  sessionStore           │
└──────┬──────────────────┘
       │
       │ 2. Call API function
       │    with token
       ▼
┌─────────────────────────┐
│  apiRequest()           │
│  (e.g., fetchListings)  │
└──────┬──────────────────┘
       │
       │ 3. Add Authorization header
       │    Bearer <token>
       ▼
┌─────────────────────────┐
│  fetch() to server      │
└──────┬──────────────────┘
       │
       │ 4. Server receives request
       ▼
┌─────────────────────────┐
│  protect middleware     │
└──────┬──────────────────┘
       │
       │ 5. Extract token from header
       ▼
┌─────────────────────────┐
│  jwt.verify()           │
└──────┬──────────────────┘
       │
       ├─── Invalid/Expired ─┐
       │                     │
       │ 6. Valid token      │ 7. Return 401
       ▼                     ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│  Find user in DB        │ │  Client receives 401    │
└──────┬──────────────────┘ └──────┬──────────────────┘
       │                            │
       │ 8. User found              │ 9. Clear session
       ▼                            │    Redirect to login
┌─────────────────────────┐        │
│  Attach user to req     │        │
└──────┬──────────────────┘        │
       │                            │
       │ 10. Continue to controller │
       ▼                            │
┌─────────────────────────┐        │
│  Controller processes   │        │
│  request                │        │
└──────┬──────────────────┘        │
       │                            │
       │ 11. Return response        │
       ▼                            │
┌─────────────────────────┐        │
│  Client receives data   │        │
└─────────────────────────┘        │
                                    │
                                    ▼
                            ┌─────────────────────────┐
                            │  Login Page             │
                            └─────────────────────────┘
```

## Logout Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Clicks logout button
       ▼
┌─────────────────────────┐
│  LogoutButton           │
│  Component              │
└──────┬──────────────────┘
       │
       │ 2. Show confirmation
       ▼
┌─────────────────────────┐
│  window.confirm()       │
│  "Are you sure?"        │
└──────┬──────────────────┘
       │
       ├─── Cancel ──────────┐
       │                     │
       │ 3. Confirm          │ 4. Do nothing
       ▼                     ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│  logout()               │ │  Stay on page           │
│  from @/lib/auth        │ └─────────────────────────┘
└──────┬──────────────────┘
       │
       │ 5. Clear all session data
       ▼
┌─────────────────────────┐
│  sessionStore           │
│  .clearSession()        │
└──────┬──────────────────┘
       │
       │ 6. Remove from localStorage:
       │    - farm-market-token
       │    - farm-market-user
       │    - farm-market-farmer-profile
       ▼
┌─────────────────────────┐
│  localStorage.clear()   │
└──────┬──────────────────┘
       │
       │ 7. Redirect to login
       ▼
┌─────────────────────────┐
│  window.location.href   │
│  = "/login"             │
└──────┬──────────────────┘
       │
       │ 8. User sees login page
       ▼
┌─────────────────────────┐
│  Login Page             │
└─────────────────────────┘
```

## Token Lifecycle

```
┌─────────────────────────┐
│  User Registers/Logs In │
└──────┬──────────────────┘
       │
       │ Token Created
       ▼
┌─────────────────────────────────────────┐
│  JWT Token                              │
│  ┌───────────────────────────────────┐  │
│  │ Header                            │  │
│  │ { alg: "HS256", typ: "JWT" }      │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Payload                           │  │
│  │ {                                 │  │
│  │   sub: "user_id",                 │  │
│  │   role: "farmer",                 │  │
│  │   phoneNumber: "+233...",         │  │
│  │   iat: 1234567890,                │  │
│  │   exp: 1235777890                 │  │
│  │ }                                 │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Signature                         │  │
│  │ HMACSHA256(header + payload,      │  │
│  │            JWT_SECRET)            │  │
│  └───────────────────────────────────┘  │
└──────┬──────────────────────────────────┘
       │
       │ Stored in localStorage
       ▼
┌─────────────────────────┐
│  Client Storage         │
│  Valid for 14 days      │
└──────┬──────────────────┘
       │
       │ Used for API requests
       ▼
┌─────────────────────────┐
│  Authorization: Bearer  │
│  <token>                │
└──────┬──────────────────┘
       │
       │ Server validates
       ▼
┌─────────────────────────┐
│  jwt.verify()           │
│  - Check signature      │
│  - Check expiration     │
│  - Extract payload      │
└──────┬──────────────────┘
       │
       ├─── Valid ───────────┐
       │                     │
       │                     │ Invalid/Expired
       ▼                     ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│  Request Authorized     │ │  401 Unauthorized       │
└─────────────────────────┘ └──────┬──────────────────┘
                                    │
                                    │ Client clears session
                                    ▼
                            ┌─────────────────────────┐
                            │  Redirect to Login      │
                            └─────────────────────────┘
```

## Role-Based Access Control

```
┌─────────────────────────┐
│  User with Role         │
│  (farmer/buyer/admin)   │
└──────┬──────────────────┘
       │
       │ Attempts to access route
       ▼
┌─────────────────────────────────────────┐
│  Route Configuration                    │
│                                         │
│  <Route element={                       │
│    <RequireAuth                         │
│      allowedRoles={["farmer"]}          │
│    />                                   │
│  }>                                     │
│    <Route path="/farmer" ... />        │
│  </Route>                               │
└──────┬──────────────────────────────────┘
       │
       │ Check user role
       ▼
┌─────────────────────────┐
│  Get user from          │
│  localStorage           │
└──────┬──────────────────┘
       │
       │ Compare roles
       ▼
┌─────────────────────────────────────────┐
│  user.role in allowedRoles?             │
└──────┬──────────────────────────────────┘
       │
       ├─── Yes ─────────────┐
       │                     │
       │                     │ No
       ▼                     ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│  Render Route           │ │  Redirect to Login      │
│  <Outlet />             │ │  with role parameter    │
└─────────────────────────┘ └─────────────────────────┘

Role Matrix:
┌──────────┬─────────┬─────────┬─────────┐
│  Route   │ Farmer  │  Buyer  │  Admin  │
├──────────┼─────────┼─────────┼─────────┤
│ /farmer  │   ✓     │    ✗    │    ✗    │
│ /post    │   ✓     │    ✗    │    ✗    │
│ /listings│   ✓     │    ✗    │    ✗    │
│ /buyer   │   ✗     │    ✓    │    ✗    │
│ /profile │   ✓     │    ✓    │    ✓    │
│ /prices  │   ✓     │    ✓    │    ✓    │
└──────────┴─────────┴─────────┴─────────┘
```

## Error Handling Flow

```
┌─────────────────────────┐
│  API Request            │
└──────┬──────────────────┘
       │
       │ Request fails
       ▼
┌─────────────────────────────────────────┐
│  Error Response                         │
└──────┬──────────────────────────────────┘
       │
       │ Check status code
       ▼
┌─────────────────────────────────────────┐
│  Status Code?                           │
└──────┬──────────────────────────────────┘
       │
       ├─── 400 Bad Request ──────────────┐
       │                                  │
       ├─── 401 Unauthorized ─────────────┤
       │                                  │
       ├─── 403 Forbidden ────────────────┤
       │                                  │
       ├─── 404 Not Found ────────────────┤
       │                                  │
       ├─── 409 Conflict ─────────────────┤
       │                                  │
       └─── 500 Server Error ─────────────┤
                                          │
       ┌──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  401 Unauthorized Handler               │
│  (in apiClient.ts)                      │
└──────┬──────────────────────────────────┘
       │
       │ 1. Clear localStorage
       │    - Remove token
       │    - Remove user
       ▼
┌─────────────────────────────────────────┐
│  localStorage.removeItem()              │
└──────┬──────────────────────────────────┘
       │
       │ 2. Check current location
       ▼
┌─────────────────────────────────────────┐
│  Not on login/register page?            │
└──────┬──────────────────────────────────┘
       │
       │ Yes - redirect
       ▼
┌─────────────────────────────────────────┐
│  window.location.href =                 │
│  `/login?next=${currentPath}`           │
└──────┬──────────────────────────────────┘
       │
       │ User sees login page
       ▼
┌─────────────────────────────────────────┐
│  Login Page with Error Message          │
└─────────────────────────────────────────┘
```

## Data Flow Summary

```
┌──────────────┐
│   Browser    │
│ (localStorage)│
└──────┬───────┘
       │
       │ Token + User Data
       │
       ▼
┌──────────────────────────────────┐
│   React Components               │
│   - Login/Register               │
│   - RequireAuth                  │
│   - Protected Routes             │
└──────┬───────────────────────────┘
       │
       │ API Requests with Token
       │
       ▼
┌──────────────────────────────────┐
│   API Client                     │
│   - Add Authorization header     │
│   - Handle errors                │
└──────┬───────────────────────────┘
       │
       │ HTTP Request
       │
       ▼
┌──────────────────────────────────┐
│   Express Server                 │
│   - Middleware (protect)         │
│   - Controllers                  │
└──────┬───────────────────────────┘
       │
       │ Database Queries
       │
       ▼
┌──────────────────────────────────┐
│   MongoDB                        │
│   - User collection              │
└──────────────────────────────────┘
```

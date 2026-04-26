# Authentication Testing Checklist

Use this checklist to verify the authentication system works correctly.

## Pre-Testing Setup

- [ ] Server is running (`npm start` in server directory)
- [ ] Client is running (`npm run dev` in client directory)
- [ ] MongoDB is connected
- [ ] Environment variables are set correctly
- [ ] Browser console is open for debugging

## Registration Tests

### Farmer Registration
- [ ] Navigate to `/create-account?role=farmer`
- [ ] Fill in valid name (e.g., "John Farmer")
- [ ] Fill in valid phone number (e.g., "+233201234567")
- [ ] Fill in valid location (e.g., "Accra")
- [ ] Click "Create Account"
- [ ] Verify loading state shows "Creating Account..."
- [ ] Verify success message appears
- [ ] Verify redirect to `/farmer` dashboard
- [ ] Verify user data in localStorage
- [ ] Verify token in localStorage

### Buyer Registration
- [ ] Navigate to `/create-account?role=buyer`
- [ ] Fill in valid name (e.g., "Jane Buyer")
- [ ] Fill in valid phone number (e.g., "+233209876543")
- [ ] Fill in valid location (e.g., "Kumasi")
- [ ] Click "Create Account"
- [ ] Verify loading state shows "Creating Account..."
- [ ] Verify success message appears
- [ ] Verify redirect to `/buyer` marketplace
- [ ] Verify user data in localStorage
- [ ] Verify token in localStorage

### Registration Validation
- [ ] Try to register with empty name - should show error
- [ ] Try to register with name < 2 chars - should show error
- [ ] Try to register with invalid phone (e.g., "123") - should show error
- [ ] Try to register with empty location - should show error
- [ ] Try to register with existing phone number - should show "already registered" error
- [ ] Verify button is disabled during submission
- [ ] Verify errors clear when correcting input

## Login Tests

### Farmer Login
- [ ] Logout if logged in
- [ ] Navigate to `/login?role=farmer`
- [ ] Enter registered farmer phone number
- [ ] Click "Login"
- [ ] Verify loading state shows "Logging in..."
- [ ] Verify redirect to `/farmer` dashboard
- [ ] Verify user data in localStorage
- [ ] Verify token in localStorage

### Buyer Login
- [ ] Logout if logged in
- [ ] Navigate to `/login?role=buyer`
- [ ] Enter registered buyer phone number
- [ ] Click "Login"
- [ ] Verify loading state shows "Logging in..."
- [ ] Verify redirect to `/buyer` marketplace
- [ ] Verify user data in localStorage
- [ ] Verify token in localStorage

### Login Validation
- [ ] Try to login with empty phone - should show error
- [ ] Try to login with invalid phone format - should show error
- [ ] Try to login with non-existent phone - should show "not registered" error
- [ ] Try to login as farmer with buyer phone - should show role mismatch error
- [ ] Try to login as buyer with farmer phone - should show role mismatch error
- [ ] Verify button is disabled during submission
- [ ] Verify errors clear when correcting input

## Protected Routes Tests

### Farmer Routes
- [ ] Logout if logged in
- [ ] Try to access `/farmer` - should redirect to login
- [ ] Try to access `/post` - should redirect to login
- [ ] Try to access `/listings` - should redirect to login
- [ ] Login as farmer
- [ ] Access `/farmer` - should work
- [ ] Access `/post` - should work
- [ ] Access `/listings` - should work
- [ ] Try to access `/buyer` - should redirect to login

### Buyer Routes
- [ ] Logout if logged in
- [ ] Try to access `/buyer` - should redirect to login
- [ ] Login as buyer
- [ ] Access `/buyer` - should work
- [ ] Try to access `/farmer` - should redirect to login
- [ ] Try to access `/post` - should redirect to login

### Shared Routes
- [ ] Login as farmer
- [ ] Access `/profile` - should work
- [ ] Access `/prices` - should work
- [ ] Logout and login as buyer
- [ ] Access `/profile` - should work
- [ ] Access `/prices` - should work

## Session Management Tests

### Logout
- [ ] Login as any user
- [ ] Click logout button
- [ ] Verify confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Verify redirect to `/login`
- [ ] Verify token removed from localStorage
- [ ] Verify user removed from localStorage
- [ ] Verify profile data removed from localStorage
- [ ] Try to access protected route - should redirect to login

### Token Expiration
- [ ] Login as any user
- [ ] Open browser DevTools > Application > Local Storage
- [ ] Find the token and decode it (use jwt.io)
- [ ] Manually set expiration to past time (or wait for actual expiration)
- [ ] Try to access protected route
- [ ] Verify automatic redirect to login
- [ ] Verify session cleared

### Session Persistence
- [ ] Login as any user
- [ ] Refresh the page
- [ ] Verify still logged in
- [ ] Verify user data still available
- [ ] Close browser tab
- [ ] Open new tab and navigate to app
- [ ] Verify still logged in (if token not expired)

## API Authentication Tests

### Authenticated Requests
- [ ] Login as farmer
- [ ] Navigate to `/post` (create listing page)
- [ ] Fill in listing details
- [ ] Submit listing
- [ ] Verify request includes Authorization header
- [ ] Verify listing created successfully

### Unauthorized Requests
- [ ] Logout
- [ ] Open browser DevTools > Console
- [ ] Try to make authenticated API request manually
- [ ] Verify 401 error returned
- [ ] Verify automatic redirect to login

### Invalid Token
- [ ] Login as any user
- [ ] Open DevTools > Application > Local Storage
- [ ] Modify token to invalid value
- [ ] Try to access protected route or make API request
- [ ] Verify 401 error
- [ ] Verify automatic redirect to login
- [ ] Verify session cleared

## Role-Based Access Tests

### Farmer Permissions
- [ ] Login as farmer
- [ ] Verify can access farmer dashboard
- [ ] Verify can post produce
- [ ] Verify can view own listings
- [ ] Verify can edit own listings
- [ ] Verify can delete own listings
- [ ] Verify cannot access buyer-only routes

### Buyer Permissions
- [ ] Login as buyer
- [ ] Verify can access buyer marketplace
- [ ] Verify can view all listings
- [ ] Verify cannot post produce
- [ ] Verify cannot edit listings
- [ ] Verify cannot delete listings
- [ ] Verify cannot access farmer-only routes

## Error Handling Tests

### Network Errors
- [ ] Stop the server
- [ ] Try to login
- [ ] Verify error message displayed
- [ ] Verify button re-enabled
- [ ] Start server
- [ ] Try to login again
- [ ] Verify successful login

### Server Errors
- [ ] Temporarily break server endpoint (e.g., remove JWT_SECRET)
- [ ] Try to login
- [ ] Verify error message displayed
- [ ] Fix server
- [ ] Verify login works again

### Validation Errors
- [ ] Try various invalid inputs
- [ ] Verify specific error messages for each field
- [ ] Verify errors displayed inline
- [ ] Verify errors clear when input corrected

## User Experience Tests

### Loading States
- [ ] Verify login button shows loading text during login
- [ ] Verify register button shows loading text during registration
- [ ] Verify buttons disabled during submission
- [ ] Verify loading states clear after completion

### Success States
- [ ] Verify success message on registration
- [ ] Verify success message styling
- [ ] Verify automatic redirect after success

### Error States
- [ ] Verify error messages are user-friendly
- [ ] Verify error messages are specific
- [ ] Verify errors are clearly visible
- [ ] Verify errors don't persist after correction

### Navigation
- [ ] Verify "Create Account" link on login page
- [ ] Verify "Login instead" link on registration page
- [ ] Verify return URL preserved in login redirect
- [ ] Verify role parameter preserved in navigation

## Security Tests

### XSS Prevention
- [ ] Try to register with name containing `<script>alert('xss')</script>`
- [ ] Verify script not executed
- [ ] Verify data sanitized

### SQL Injection Prevention
- [ ] Try to register with phone `' OR '1'='1`
- [ ] Verify request fails or data sanitized
- [ ] Verify no database compromise

### Token Security
- [ ] Verify token stored in localStorage (not in URL)
- [ ] Verify token sent in Authorization header (not in URL)
- [ ] Verify token includes expiration
- [ ] Verify expired tokens rejected

## Performance Tests

### Load Time
- [ ] Measure time from login submit to dashboard load
- [ ] Should be < 2 seconds on good connection
- [ ] Verify no unnecessary API calls

### Caching
- [ ] Login and navigate to profile
- [ ] Verify user data loads instantly (from cache)
- [ ] Verify API call made in background to refresh data

## Mobile Tests

### Responsive Design
- [ ] Test on mobile device or DevTools mobile view
- [ ] Verify login form usable on mobile
- [ ] Verify registration form usable on mobile
- [ ] Verify buttons large enough to tap
- [ ] Verify text readable without zoom

### Touch Interactions
- [ ] Verify buttons respond to touch
- [ ] Verify no double-tap zoom on buttons
- [ ] Verify keyboard appears for input fields

## Browser Compatibility Tests

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

For each browser:
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Protected routes work
- [ ] Session persists

## Automated Tests

- [ ] Run unit tests: `npm run test auth.test.ts`
- [ ] Verify all tests pass
- [ ] Check test coverage

## Final Verification

- [ ] All manual tests passed
- [ ] All automated tests passed
- [ ] No console errors
- [ ] No console warnings
- [ ] Documentation reviewed
- [ ] Code reviewed

## Issues Found

Document any issues found during testing:

| Issue | Severity | Steps to Reproduce | Status |
|-------|----------|-------------------|--------|
|       |          |                   |        |

## Test Environment

- Date: _______________
- Tester: _______________
- Browser: _______________
- OS: _______________
- Server Version: _______________
- Client Version: _______________

## Sign-Off

- [ ] All critical tests passed
- [ ] All issues documented
- [ ] Ready for production (or next phase)

Tested by: _______________ Date: _______________

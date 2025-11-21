# Phase 4: Settings & Advanced Features

## Overview

Phase 4 focuses on settings management and advanced features to complete the core functionality of HeirLock.

## Tasks

### 4.1 Settings Page

#### Create Settings Page Route
- [ ] Create `/settings` page route
- [ ] Use DashboardLayout component
- [ ] Add page title and description

#### InactivityPeriodSettings Component
- [ ] Build component to configure inactivity period
- [ ] Input field for inactivity period (in seconds for testing)
- [ ] Validation (30-120 seconds for testing, or days for production)
- [ ] Display current value
- [ ] Save functionality with mutation
- [ ] Success/error feedback
- [ ] Show conversion (seconds to days for display)

#### AccountSettings Component
- [ ] Display user profile information
- [ ] Show account status (active/inherited)
- [ ] Display last login timestamp
- [ ] Show account creation date
- [ ] Display principal
- [ ] Show Bitcoin address (if generated)

### 4.2 Bitcoin Address Generation
- [ ] Add "Generate Address" button to dashboard (if not exists)
- [ ] Ensure address generation flow works
- [ ] Show loading state during generation
- [ ] Display generated address
- [ ] Add to settings page as well

### 4.3 Enhanced Features

#### Notifications/Toasts
- [ ] Install toast library (react-hot-toast or sonner)
- [ ] Replace alert() calls with toast notifications
- [ ] Add success toasts for mutations
- [ ] Add error toasts for failures
- [ ] Add info toasts for important actions

#### Error Boundaries
- [ ] Create ErrorBoundary component
- [ ] Wrap main app sections
- [ ] Display user-friendly error messages
- [ ] Add retry functionality

#### Loading Skeletons
- [ ] Create Skeleton component
- [ ] Replace loading text with skeletons
- [ ] Add to BalanceCard, HeirList, etc.

#### Transaction History (Optional)
- [ ] If canister provides transaction history
- [ ] Display recent Bitcoin transactions
- [ ] Show transaction status

#### Inheritance Execution Logs (Optional)
- [ ] If canister provides execution logs
- [ ] Display inheritance execution history
- [ ] Show execution status and results

## Deliverables

- Complete settings page
- Inactivity period configuration
- Account information display
- Enhanced user feedback (toasts)
- Better error handling
- Improved loading states

## Estimated Time

- Settings page: 2-3 hours
- Enhanced features: 2-3 hours
- **Total: 4-6 hours**

## Implementation Order

1. **Settings Page** (Priority)
   - Most important for user control
   - Allows configuration of inactivity period
   - Shows account information

2. **Enhanced Features** (Polish)
   - Improves user experience
   - Better feedback and error handling
   - Professional polish

## Files to Create

```
frontend/
├── app/
│   └── settings/
│       └── page.tsx              # Settings page
├── components/
│   ├── settings/
│   │   ├── InactivityPeriodSettings.tsx
│   │   └── AccountSettings.tsx
│   ├── common/
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── Toast.tsx (or use library)
│   └── ...
```

## Key Features

### Settings Page Features
- Inactivity period configuration
- Account information display
- Bitcoin address management
- Account status overview

### Enhanced UX Features
- Toast notifications (better than alerts)
- Error boundaries (graceful error handling)
- Loading skeletons (better than text)
- Improved visual feedback

## Next After Phase 4

**Phase 5: Polish & Optimization**
- UI/UX improvements
- Performance optimization
- Testing
- Documentation


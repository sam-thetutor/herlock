# Combine Balance & Address Card + QR Code Feature - Implementation Plan

## Overview
Combine the Bitcoin Balance and Bitcoin Address cards into a single unified card, with the Bitcoin address QR code displayed directly on the right side of the card (always visible, no button needed).

---

## 🎯 Requirements

### Functional Requirements
1. **Combined Card**: Merge BalanceCard and BitcoinAddress into one component
2. **QR Code Display**: Show Bitcoin address as QR code directly on the right side of the card (always visible when address exists)
3. **No Button Needed**: QR code is always displayed, no trigger button required
4. **Maintain Functionality**: Keep all existing features (copy, regenerate, balance display)
5. **Responsive Design**: Card should work on mobile and desktop (QR code may stack below on mobile)

### UI/UX Requirements
1. **Visual Hierarchy**: Balance should be prominent, address on left, QR code on right
2. **Two-Column Layout**: Left side (balance + address), Right side (QR code)
3. **Always Visible**: QR code displayed whenever address exists (no modal needed)
4. **Consistent Styling**: Match existing Bitcoin orange theme
5. **Responsive**: On mobile, QR code stacks below address section

---

## 🏗️ Architecture

### Component Structure
```
BitcoinWalletCard (New Combined Component)
├── Card Header
│   └── Title: "Bitcoin Wallet" with Bitcoin icon
├── Card Content (Two-Column Layout)
│   ├── Left Column
│   │   ├── Balance Section
│   │   │   ├── Large BTC amount (prominent)
│   │   │   └── Satoshis (smaller text)
│   │   ├── Address Section
│   │   │   ├── Full address (monospace, copyable)
│   │   │   ├── Truncated display
│   │   │   └── Action Buttons Row
│   │   │       ├── Copy Button
│   │   │       └── Regenerate Button
│   │   └── Generate Address (if no address exists)
│   └── Right Column
│       └── QR Code Display (always visible when address exists)
│           └── QR Code Image (256x256px)
```

---

## 📋 Implementation Steps

### Phase 1: Install QR Code Library

**Step 1.1: Install QR Code Package**
```bash
cd frontend
npm install qrcode.react
# OR
npm install react-qr-code
```

**Recommendation**: Use `qrcode.react` - lightweight, well-maintained, TypeScript support

---

### Phase 2: Create Combined Component (No Modal Needed)

**File**: `frontend/components/dashboard/BitcoinWalletCard.tsx` (NEW)

**Features**:
- Two-column layout (flex or grid)
- Left column: Balance + Address + Actions
- Right column: QR code (always visible when address exists)
- QR code rendered directly in component
- Responsive: stacks on mobile

**Layout Structure**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Left Column */}
  <div className="space-y-4">
    {/* Balance Section */}
    {/* Address Section */}
    {/* Action Buttons */}
  </div>
  
  {/* Right Column */}
  <div className="flex items-center justify-center">
    {/* QR Code */}
    {address && <QRCodeSVG value={address} size={256} />}
  </div>
</div>
```

---

### Phase 3: Implement Two-Column Layout

**File**: `frontend/components/dashboard/BitcoinWalletCard.tsx` (NEW)

**Combines**:
- Balance display from `BalanceCard.tsx`
- Address display from `BitcoinAddress.tsx`
- QR code display (always visible on right side)

**Layout**:
```
┌─────────────────────────────────────────────┐
│  Bitcoin Wallet          [Bitcoin Icon]     │
├─────────────────────────────────────────────┤
│  Left Column          │  Right Column      │
│                       │                     │
│  0.39999773 BTC       │   ┌───────────┐    │
│  39,999,773 satoshis  │   │           │    │
│                       │   │  QR CODE  │    │
│  ─────────────────── │   │           │    │
│                       │   └───────────┘    │
│  Address:             │                     │
│  moc7MDk3UR9y9otZRDBwj48J85efKr2HH4         │
│  [Copy] [Regenerate]  │                     │
│                       │                     │
└─────────────────────────────────────────────┘
```

**State Management**:
- `copied` state for copy button
- Use existing hooks: `useBalance()`, `useBitcoinAddress()`, `useGenerateBitcoinAddress()`
- No modal state needed

---

### Phase 4: Update Dashboard

**File**: `frontend/app/dashboard/page.tsx`

**Changes**:
- Remove `BalanceCard` import
- Remove `BitcoinAddress` import
- Add `BitcoinWalletCard` import
- Replace two cards with one combined card
- Adjust grid layout (combined card might span 2 columns)

**Before**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <BalanceCard />
  <BitcoinAddress />
  ...
</div>
```

**After**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <BitcoinWalletCard className="md:col-span-2" />
  ...
</div>
```

---

### Phase 5: Clean Up Old Components (Optional)

**Files to Consider Removing**:
- `frontend/components/dashboard/BalanceCard.tsx`
- `frontend/components/dashboard/BitcoinAddress.tsx`

**Note**: Keep them initially for rollback, remove after testing

---

## 🔧 Technical Details

### QR Code Library Options

**Option 1: qrcode.react** (Recommended)
```bash
npm install qrcode.react
```
- Pros: Lightweight, TypeScript support, React-friendly
- Cons: None significant
- Usage: `<QRCodeSVG value={address} />`

**Option 2: react-qr-code**
```bash
npm install react-qr-code
```
- Pros: Simple API, SVG-based
- Cons: Less popular
- Usage: `<QRCode value={address} />`

**Option 3: qrcode + canvas**
```bash
npm install qrcode @types/qrcode
```
- Pros: More control, can generate images
- Cons: More complex, requires canvas

**Recommendation**: Use `qrcode.react` for simplicity

---

### Modal/Dialog Component

**Check if exists**: Look for existing modal/dialog in `frontend/components/ui/`

**If exists**: Use existing component
**If not**: Create simple modal or use a library like `@headlessui/react` or `radix-ui`

**Simple Modal Implementation**:
```typescript
// Simple overlay + centered content
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-6 max-w-md w-full">
    {/* QR Code content */}
  </div>
</div>
```

---

### QR Code Size & Styling

**Recommended Settings**:
- Size: 256x256 pixels (good for scanning)
- Error Correction: Medium (default)
- Background: White
- Foreground: Black (or Bitcoin orange for branding)
- Padding: 20px around QR code

**Accessibility**:
- Include address text below QR code
- Ensure QR code has sufficient contrast
- Add alt text for screen readers

---

## 🎨 UI/UX Design

### Combined Card Layout

**Top Section (Balance)**:
- Large, prominent BTC amount (3xl font, Bitcoin orange)
- Smaller satoshi amount below (sm text, gray)
- Visual separator line

**Bottom Section (Address)**:
- "Bitcoin Address" label
- Full address in monospace font, copyable
- Truncated display version
- Button row: [Copy] [QR Code] [Regenerate]

**Button Styling**:
- Copy: Outline variant, check icon when copied
- QR Code: Outline variant, QrCode icon (from lucide-react)
- Regenerate: Outline variant, Wallet icon

### QR Code Modal Design

**Layout**:
```
┌─────────────────────────────┐
│  Bitcoin Address QR Code    │
│                             │
│      ┌───────────┐          │
│      │           │          │
│      │  QR CODE  │          │
│      │           │          │
│      └───────────┘          │
│                             │
│  moc7MD...Kr2HH4            │
│  [Copy Address]             │
│                             │
│           [Close]            │
└─────────────────────────────┘
```

**Features**:
- Centered modal
- QR code centered
- Address text below (truncated, copyable)
- Copy button for address
- Close button (X or "Close")
- Click outside to close (optional)

---

## 📦 Dependencies

### New Packages
```json
{
  "qrcode.react": "^3.1.0"
}
```

### Existing Packages (Already Installed)
- `lucide-react` - For QrCode icon
- `react-hot-toast` - For notifications
- `@tanstack/react-query` - For data fetching

---

## 🧪 Testing Checklist

### Component Tests
- [ ] Combined card displays balance correctly
- [ ] Combined card displays address correctly
- [ ] Copy button works
- [ ] QR code button opens modal
- [ ] QR code displays correct address
- [ ] QR code is scannable (test with phone)
- [ ] Regenerate button works
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] No address state displays correctly

### Integration Tests
- [ ] Dashboard layout updated correctly
- [ ] Card fits in grid layout
- [ ] Responsive on mobile
- [ ] Modal closes correctly
- [ ] Modal doesn't break layout

### QR Code Tests
- [ ] QR code generates correctly
- [ ] QR code is scannable by Bitcoin wallet apps
- [ ] QR code displays correct address
- [ ] QR code has proper size/contrast

---

## 📝 Files to Create/Modify

### New Files
1. ✅ `frontend/components/dashboard/BitcoinWalletCard.tsx` - Combined component with inline QR code

### Modified Files
1. ✅ `frontend/app/dashboard/page.tsx` - Update imports and layout
2. ✅ `frontend/package.json` - Add qrcode.react dependency

### Optional (Cleanup)
1. ⚠️ `frontend/components/dashboard/BalanceCard.tsx` - Remove after testing
2. ⚠️ `frontend/components/dashboard/BitcoinAddress.tsx` - Remove after testing

---

## 🚀 Implementation Order

1. **Install QR Code Library**
   ```bash
   cd frontend && npm install qrcode.react
   ```

2. **Create Combined Component**
   - Create `BitcoinWalletCard.tsx`
   - Implement two-column layout (flex or grid)
   - Left column: Balance + Address + Actions
   - Right column: QR code (always visible)
   - Integrate with existing hooks
   - Style according to design
   - Make responsive (stack on mobile)

3. **Update Dashboard**
   - Replace two cards with one
   - Update imports
   - Adjust grid layout (combined card spans 2 columns)
   - Test layout

4. **Test & Refine**
   - Test all functionality
   - Test QR code scanning
   - Adjust styling if needed
   - Test responsive design (mobile stacking)

5. **Cleanup (Optional)**
   - Remove old components if not needed elsewhere
   - Update any other references

---

## 🎯 Success Criteria

✅ **Combined Card**:
- Balance and address displayed in one card
- All existing functionality preserved
- Clean, organized layout

✅ **QR Code Feature**:
- QR code always visible on right side of card (when address exists)
- QR code is scannable by Bitcoin wallets
- QR code properly sized and centered
- Responsive: stacks below on mobile

✅ **User Experience**:
- Intuitive button placement
- Clear visual hierarchy
- Responsive design
- Consistent with existing design system

---

## 🔍 Edge Cases to Handle

1. **No Address**: Show "Generate Address" button, hide QR code section
2. **Loading States**: Show skeletons for balance and address, hide QR code while loading
3. **Error States**: Display error messages appropriately
4. **Zero Balance**: Still show address and QR code
5. **Long Address**: Ensure truncation works correctly
6. **Mobile Responsive**: QR code stacks below address section on small screens
7. **QR Code Size**: Ensure QR code is properly sized (not too large/small)

---

## 📊 Estimated Time

- **QR Code Library Setup**: 5 minutes
- **Combined Component with Inline QR Code**: 45-60 minutes
- **Dashboard Update**: 10 minutes
- **Testing & Refinement**: 30 minutes
- **Total**: ~1.5-2 hours

---

## 🎨 Design Mockup (Text)

```
┌─────────────────────────────────────────────────────────┐
│  Bitcoin Wallet                    [₿ Icon]            │
├─────────────────────────────────────────────────────────┤
│  Left Column                    │  Right Column       │
│                                 │                      │
│  0.39999773 BTC                 │   ┌───────────┐     │
│  39,999,773 satoshis            │   │           │     │
│                                 │   │  QR CODE  │     │
│  ───────────────────────────── │   │           │     │
│                                 │   └───────────┘     │
│  Bitcoin Address                │                      │
│  ┌───────────────────────────┐ │                      │
│  │ moc7MDk3UR9y9otZRDBwj48J85efKr2HH4 │ │                      │
│  │ [Copy] [Regenerate]        │ │                      │
│  └───────────────────────────┘ │                      │
│                                 │                      │
│  Display: moc7MD...Kr2HH4      │                      │
│                                 │                      │
└─────────────────────────────────────────────────────────┘

Mobile View (Stacked):
┌─────────────────────────────────┐
│  Bitcoin Wallet    [₿ Icon]    │
├─────────────────────────────────┤
│  0.39999773 BTC                 │
│  39,999,773 satoshis            │
│  ────────────────────────────  │
│  Bitcoin Address                │
│  moc7MDk3UR9y9otZRDBwj48J85efKr2HH4 │
│  [Copy] [Regenerate]            │
│                                 │
│      ┌───────────┐              │
│      │           │              │
│      │  QR CODE  │              │
│      │           │              │
│      └───────────┘              │
└─────────────────────────────────┘
```

---

## 🔐 Security Considerations

1. **QR Code Content**: Only display the address (no sensitive data)
2. **Modal Overlay**: Prevent interaction with background when modal is open
3. **Address Validation**: Ensure address is valid before generating QR code

---

## 📚 References

- [qrcode.react Documentation](https://www.npmjs.com/package/qrcode.react)
- [QR Code Best Practices](https://www.qrcode.com/en/howto/code.html)
- Bitcoin Address Formats: P2PKH, P2SH, Bech32

---

**Status**: Ready for Implementation
**Priority**: Medium
**Dependencies**: None (uses existing hooks and components)


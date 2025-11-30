# Send Bitcoin Feature - Implementation Plan

## Overview
Add functionality for users to manually send Bitcoin from their HeirLock address to any other Bitcoin address. This feature will allow users to transfer BTC while maintaining the inheritance system's integrity.

---

## 🎯 Requirements

### Functional Requirements
1. User can send BTC to any valid Bitcoin address
2. Amount can be specified in BTC or satoshis
3. Transaction must be validated before sending (balance check, address validation)
4. Transaction ID should be returned and displayed
5. Sending BTC should update user's last_activity timestamp
6. Should prevent sending if account is inherited/frozen
7. Should show estimated transaction fee
8. Should validate sufficient balance (amount + fees)

### Non-Functional Requirements
1. Clear error messages for validation failures
2. Loading states during transaction processing
3. Success confirmation with transaction ID
4. Balance refresh after successful transaction
5. Responsive UI that matches existing design patterns

---

## 🏗️ Architecture

### Backend Changes

#### 1. New Function in `Main.mo`

**Location**: `/src/heirlock/src/Main.mo`

**Function Signature**:
```motoko
public shared(msg) func send_bitcoin(
    recipient_address : BitcoinAddress,
    amount : Satoshi
) : async Result<Text, Text>
```

**Functionality**:
- Validate user exists and has Bitcoin address
- Check account status (must be `active` or `inactive`, not `inherited` or `frozen`)
- Get user's derivation path
- Check balance (amount + estimated fees)
- Call `P2pkh.send()` to create and broadcast transaction
- Update user's `last_activity` timestamp (sending BTC is activity)
- Return transaction ID as hex string
- Return error if validation fails

**Error Cases**:
- User not found
- No Bitcoin address configured
- Account is inherited/frozen
- Invalid recipient address format
- Insufficient balance (including fees)
- Transaction construction/signing failure
- Network broadcast failure

**Code Location**: Add after `get_balance()` function (around line 316)

---

### Frontend Changes

#### 1. TypeScript Interface Updates

**File**: `/frontend/lib/canister/heirlock.ts`

**Add to `HeirlockCanister` interface**:
```typescript
send_bitcoin: (recipientAddress: string, amount: bigint) => Promise<Result<string, string>>;
```

**Add to `Result` type** (if not already present):
```typescript
export type Result<Ok, Err> = { ok: Ok } | { err: Err };
```

---

#### 2. Candid Interface Updates

**File**: `/frontend/lib/canister/heirlock.did.ts`

**Add function to IDL**:
```typescript
send_bitcoin: IDL.Func(
  [IDL.Text, IDL.Nat64],  // [recipient_address, amount]
  [Result(IDL.Text, IDL.Text)],  // Result<txid, error>
  []
)
```

**Note**: After backend changes, run `dfx generate` to auto-update this file.

---

#### 3. React Hook

**File**: `/frontend/lib/hooks/useHeirlock.ts`

**Add new hook**:
```typescript
export function useSendBitcoin() {
  const { data: actor } = useHeirlockActor();
  const queryClient = useQueryClient();
  const { data: balance } = useBalance();

  return useMutation({
    mutationFn: async ({ recipientAddress, amount }: { recipientAddress: string; amount: bigint }) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.send_bitcoin(recipientAddress, amount);
    },
    onSuccess: (result) => {
      // Invalidate balance query to refresh
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['inactivity-status'] });
    },
  });
}
```

---

#### 4. UI Component

**File**: `/frontend/components/dashboard/SendBitcoinForm.tsx` (NEW)

**Component Structure**:
- Card container (matches existing design)
- Form with:
  - Recipient address input (with validation)
  - Amount input (BTC or satoshis, with toggle)
  - Estimated fee display
  - Max amount button (balance - estimated fee)
  - Send button
- Loading state during transaction
- Success message with transaction ID (link to block explorer)
- Error display

**Validation**:
- Recipient address format (P2PKH, P2SH, Bech32)
- Amount > 0
- Amount + fees <= balance
- Account status check

**UI Features**:
- Bitcoin orange theme (`#F7931A`)
- Icons from `lucide-react` (Send, Bitcoin, etc.)
- Toast notifications for success/error
- Disabled state when account is inherited/frozen

---

#### 5. Dashboard Integration

**File**: `/frontend/app/dashboard/page.tsx`

**Add component**:
```typescript
import { SendBitcoinForm } from '@/components/dashboard/SendBitcoinForm';

// In the grid:
<SendBitcoinForm />
```

**Layout**: Add as a new card in the dashboard grid (full width or 2-column)

---

#### 6. Utility Functions

**File**: `/frontend/lib/utils/format.ts`

**Add helper functions** (if needed):
```typescript
/**
 * Convert BTC string to satoshis
 */
export function btcToSatoshi(btc: string): bigint {
  const btcNum = parseFloat(btc);
  if (isNaN(btcNum) || btcNum < 0) return 0n;
  return BigInt(Math.floor(btcNum * 100_000_000));
}

/**
 * Validate Bitcoin address format
 */
export function isValidBitcoinAddress(address: string): boolean {
  // Basic validation: P2PKH (starts with 1 or m/n), P2SH (starts with 3 or 2), Bech32 (starts with bc1 or bcrt1)
  const p2pkhRegex = /^[1mn][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const p2shRegex = /^[23][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const bech32Regex = /^(bc1|bcrt1)[a-z0-9]{39,59}$/i;
  
  return p2pkhRegex.test(address) || p2shRegex.test(address) || bech32Regex.test(address);
}
```

---

## 📋 Implementation Steps

### Phase 1: Backend Implementation
1. ✅ Add `send_bitcoin` function to `Main.mo`
2. ✅ Add validation logic (account status, balance, address format)
3. ✅ Integrate with `P2pkh.send()` function
4. ✅ Update `last_activity` timestamp
5. ✅ Add error handling
6. ✅ Test with dfx canister call

### Phase 2: Candid & TypeScript Updates
1. ✅ Run `dfx generate` to update Candid interface
2. ✅ Update `heirlock.ts` TypeScript interface
3. ✅ Verify types match backend

### Phase 3: Frontend Hook
1. ✅ Create `useSendBitcoin` hook in `useHeirlock.ts`
2. ✅ Add query invalidation for balance/profile
3. ✅ Test hook with mock data

### Phase 4: UI Component
1. ✅ Create `SendBitcoinForm.tsx` component
2. ✅ Add form validation
3. ✅ Add loading/success/error states
4. ✅ Style with Bitcoin orange theme
5. ✅ Add toast notifications

### Phase 5: Integration
1. ✅ Add component to dashboard
2. ✅ Test end-to-end flow
3. ✅ Handle edge cases (inherited account, zero balance, etc.)

### Phase 6: Testing
1. ✅ Test with regtest network
2. ✅ Test validation (invalid address, insufficient balance)
3. ✅ Test transaction broadcast
4. ✅ Verify balance updates
5. ✅ Verify activity timestamp updates

---

## 🔍 Technical Details

### Transaction Fee Estimation
- Use `BitcoinApi.get_current_fee_percentiles()` (already in P2pkh.send)
- Default to 2000 millisatoshis/vbyte for regtest
- Estimate fee: `(transaction_size_bytes * fee_per_vbyte) / 1000`
- Conservative estimate: ~10,000 satoshis (0.0001 BTC) per transaction

### Account Status Check
- Only allow sending if `account_status == #active` or `#inactive`
- Block if `account_status == #inherited` or `#frozen`
- Show clear error message if blocked

### Balance Validation
- Check: `amount + estimated_fee <= current_balance`
- Show error if insufficient funds
- Provide "Send Max" option (balance - estimated fee)

### Activity Update
- Call `UserManager.update_last_activity()` after successful send
- This resets the inactivity timer
- Important for inheritance logic

---

## 🎨 UI/UX Design

### Component Layout
```
┌─────────────────────────────────────┐
│  Send Bitcoin          [Bitcoin Icon]│
├─────────────────────────────────────┤
│                                     │
│  Recipient Address:                 │
│  [_____________________________]   │
│                                     │
│  Amount:                            │
│  [BTC] [0.00000000] [Max]           │
│                                     │
│  Estimated Fee: 0.0001 BTC          │
│  Total: 0.0001 BTC                  │
│                                     │
│  [Send Transaction]                 │
│                                     │
│  ⚠️ Account is inherited.           │
│     Cannot send Bitcoin.           │
└─────────────────────────────────────┘
```

### States
1. **Default**: Form ready, user can input
2. **Loading**: Button disabled, spinner shown
3. **Success**: Green banner with transaction ID
4. **Error**: Red banner with error message
5. **Disabled**: Grayed out if account inherited/frozen

### Validation Messages
- "Invalid Bitcoin address format"
- "Amount must be greater than 0"
- "Insufficient balance (including fees)"
- "Cannot send: Account is inherited"
- "Cannot send: Account is frozen"

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] Send with valid address and amount
- [ ] Send with insufficient balance
- [ ] Send with inherited account (should fail)
- [ ] Send with frozen account (should fail)
- [ ] Send with invalid address format
- [ ] Verify transaction ID returned
- [ ] Verify balance updated after send
- [ ] Verify last_activity updated

### Frontend Tests
- [ ] Form validation works
- [ ] Address format validation
- [ ] Amount validation (max, min)
- [ ] Loading state during transaction
- [ ] Success message with transaction ID
- [ ] Error messages display correctly
- [ ] Balance refreshes after send
- [ ] Disabled state for inherited/frozen accounts

### Integration Tests
- [ ] End-to-end send flow
- [ ] Transaction appears on blockchain
- [ ] Balance updates correctly
- [ ] Activity timestamp updates
- [ ] Multiple sends in sequence

---

## 📝 Files to Modify/Create

### Backend
- ✅ `src/heirlock/src/Main.mo` - Add `send_bitcoin` function

### Frontend
- ✅ `frontend/lib/canister/heirlock.did.ts` - Add Candid function (auto-generated)
- ✅ `frontend/lib/canister/heirlock.ts` - Add TypeScript interface
- ✅ `frontend/lib/hooks/useHeirlock.ts` - Add `useSendBitcoin` hook
- ✅ `frontend/components/dashboard/SendBitcoinForm.tsx` - NEW component
- ✅ `frontend/app/dashboard/page.tsx` - Add component to dashboard
- ✅ `frontend/lib/utils/format.ts` - Add utility functions (if needed)

---

## 🚀 Deployment Notes

1. **Backend First**: Deploy backend changes first
2. **Regenerate Candid**: Run `dfx generate` after backend deployment
3. **Frontend Update**: Update frontend with new types
4. **Test Locally**: Test on regtest before mainnet
5. **Error Handling**: Ensure all error cases are handled gracefully

---

## 🔐 Security Considerations

1. **Address Validation**: Validate recipient address format before sending
2. **Balance Checks**: Always check balance server-side (backend)
3. **Account Status**: Enforce account status checks on backend
4. **Transaction Signing**: Use threshold ECDSA (already implemented)
5. **No Double Spending**: UTXO management handled by P2pkh module
6. **Rate Limiting**: Consider adding rate limits for production

---

## 📊 Success Metrics

- Users can successfully send Bitcoin
- Transaction IDs are returned and displayed
- Balance updates correctly after send
- Activity timestamp updates
- Error messages are clear and helpful
- UI is responsive and matches design system

---

## 🎯 Future Enhancements (Out of Scope)

- Transaction history view
- Multiple recipient support (batch sends)
- Custom fee selection
- QR code scanner for recipient address
- Address book for frequent recipients
- Transaction status polling
- Block explorer integration links

---

**Estimated Implementation Time**: 4-6 hours
**Priority**: High
**Dependencies**: None (uses existing P2pkh.send infrastructure)




25a68f42a3ccffb089589a5b9593ff9848e56d2528bfeabfa8e01b6f42bc63f7
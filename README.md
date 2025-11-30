# HeirLock 🔐
### Secure Bitcoin Inheritance on the Internet Computer

> **"What happens to your Bitcoin when you're gone?"**

---

## 🎯 The Problem

### The $30 Billion Question

Over **$30 billion in Bitcoin is estimated to be lost forever** due to:
- 🔑 Lost private keys
- 💀 Deceased holders with no recovery plan
- 🤐 Holders who never shared access with family
- 📝 No clear inheritance mechanism

### Current "Solutions" Are Broken

**❌ Traditional Custodial Services**
- Require trusting a third party with your Bitcoin
- Single point of failure
- Vulnerable to hacks, bankruptcy, or seizure
- Goes against Bitcoin's core principle: "Not your keys, not your coins"

**❌ Manual Solutions (Paper Wallets, Seed Phrases)**
- Require heirs to find and understand complex instructions
- No automatic execution
- Risk of discovery by wrong parties
- Seed phrases can be lost or destroyed

**❌ Multi-Signature Wallets**
- Complex setup requiring technical knowledge
- Heirs need to coordinate and act together
- No automatic trigger mechanism
- Still requires manual intervention

### The Core Challenge

**How do you ensure your Bitcoin reaches your loved ones without:**
1. Giving up custody of your assets
2. Trusting a centralized entity
3. Requiring complex technical knowledge from heirs
4. Manual intervention after you're gone

---

## 💡 Our Solution: HeirLock

**The first truly decentralized, automatic Bitcoin inheritance platform powered by the Internet Computer.**

### How It Works

```
1. Setup (5 minutes)
   ↓
2. Live Your Life (send heartbeats periodically)
   ↓
3. Automatic Inheritance (if inactive)
   ↓
4. Heirs Receive Bitcoin (automatically distributed)
```

### The Magic: Internet Computer + Bitcoin Integration

HeirLock leverages ICP's unique capabilities:
- **Native Bitcoin Integration**: Direct interaction with Bitcoin network
- **Threshold ECDSA**: Decentralized key management and signing
- **Smart Contract Automation**: Trustless execution without intermediaries
- **Chain-Key Cryptography**: Secure, distributed Bitcoin custody

---

## 🚀 Key Features

### For Bitcoin Holders

✅ **100% Non-Custodial**
- You control your Bitcoin at all times
- No third-party access to your funds
- True self-sovereignty

✅ **Set It and Forget It**
- Configure once, runs automatically forever
- Simple "heartbeat" mechanism to prove you're active
- No complex maintenance required

✅ **Flexible Inheritance**
- Multiple heirs with custom allocation percentages
- Update heirs and allocations anytime
- Configurable inactivity periods (30 days to 1 year)

✅ **Real-Time Monitoring**
- Live countdown timer
- Activity tracking dashboard
- Bitcoin balance monitoring for heirs

### For Heirs

✅ **No Technical Knowledge Required**
- Just provide a Bitcoin address
- Automatic distribution when triggered
- No seed phrases or complex recovery process

✅ **Transparent Process**
- Track inheritance status
- View allocated percentage
- Monitor Bitcoin balance in real-time

---

## 🏗️ Technology Architecture

### Built on Internet Computer Protocol

```
┌─────────────────────────────────────────┐
│         HeirLock Frontend (Next.js)      │
│    Dashboard • Heirs • Settings • Auth   │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      HeirLock Canister (Motoko)         │
│  • User Management                       │
│  • Heir Configuration                    │
│  • Activity Tracking                     │
│  • Inheritance Engine                    │
│  • Automated Scheduler (60s checks)      │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│    Internet Computer Protocol (ICP)      │
│  • Bitcoin Integration API               │
│  • Threshold ECDSA (tECDSA)             │
│  • Chain-Key Cryptography                │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Bitcoin Network                  │
│  • Balance Queries                       │
│  • UTXO Management                       │
│  • Transaction Broadcasting              │
└─────────────────────────────────────────┘
```

### Smart Contract Components

**Core Modules:**
- `UserManager.mo` - Profile and account management
- `HeirManager.mo` - Heir configuration and allocations
- `ActivityTracker.mo` - Inactivity detection
- `InheritanceEngine.mo` - Automatic execution
- `Scheduler.mo` - Periodic inheritance checks
- `BitcoinApi.mo` - Bitcoin network integration
- `EcdsaApi.mo` - Cryptographic signing transactions

---

## 📊 Market Opportunity

### Target Market

**Primary:**
- 50M+ Bitcoin holders worldwide
- $800B+ total Bitcoin market cap
- Growing concern about inheritance planning

**Secondary:**
- Family offices managing crypto assets
- High-net-worth individuals (HNWIs)
- Estate planning professionals

### Competitive Advantages

| Feature | HeirLock | Custodial Services | Multi-Sig | Paper Wallets |
|---------|----------|-------------------|-----------|---------------|
| **Non-Custodial** | ✅ | ❌ | ✅ | ✅ |
| **Automatic** | ✅ | ⚠️ | ❌ | ❌ |
| **No Technical Knowledge** | ✅ | ✅ | ❌ | ❌ |
| **Decentralized** | ✅ | ❌ | ⚠️ | ✅ |
| **Trustless** | ✅ | ❌ | ⚠️ | ⚠️ |
| **Easy for Heirs** | ✅ | ✅ | ❌ | ❌ |

---

## 🎬 User Journey

### Alice's Story

**Day 1: Setup**
- Alice connects with Internet Identity
- Generates a Bitcoin address through HeirLock
- Transfers 1 BTC to the address
- Adds her two children as heirs (50% each)
- Sets inactivity period to 90 days

**Day 1-89: Normal Life**
- Alice logs in monthly to check her balance
- Each login automatically sends a "heartbeat"
- Dashboard shows countdown timer: "89 days until inheritance"
- Alice can update heirs or allocations anytime

**Day 90+: Unexpected Event**
- Alice stops logging in (accident, illness, etc.)
- HeirLock's smart contract detects 90 days of inactivity
- Automatic inheritance process begins

**Day 91: Automatic Distribution**
- Smart contract checks Alice's Bitcoin balance
- Calculates distribution: 0.5 BTC to each child
- Builds and signs Bitcoin transactions using threshold ECDSA
- Broadcasts transactions to Bitcoin network
- Children receive Bitcoin at their addresses

**No lawyers. No courts. No delays. Just code.**

---

## 🛠️ Getting Started

### Quick Start (5 Minutes)

```bash
# 1. Clone and install
git clone <repository>
cd heirlock
mops install
cd frontend && npm install && cd ..

# 2. Start local Bitcoin (regtest)
bitcoind -conf=bitcoin.conf -datadir=./bitcoin_data

# 3. Start Internet Computer
dfx start --clean --background

# 4. Deploy
dfx deploy

# 5. Launch frontend
cd frontend && npm run dev
```

Visit `http://localhost:3000` and connect with Internet Identity!

### For Testing

```bash
# Mint test Bitcoin
bitcoin-cli -regtest sendtoaddress "your_address" 0.5
bitcoin-cli -regtest -generate 1

# Check balance
dfx canister call heirlock get_balance

# View logs
dfx canister logs heirlock
```

---

## 🔐 Security & Trust

### Why It's Secure

**🔒 Non-Custodial Architecture**
- Bitcoin controlled by threshold ECDSA
- No single party can access funds
- Distributed key generation across ICP subnet

**🛡️ Smart Contract Guarantees**
- Immutable code execution
- Transparent and auditable
- No human intervention possible

**⚡ Decentralized Execution**
- Runs on 13+ independent node providers
- Byzantine fault tolerance
- No single point of failure

**🔑 Cryptographic Security**
- Chain-key cryptography
- Threshold signatures (t-ECDSA)
- Battle-tested Bitcoin integration

---

## 📈 Roadmap

### Phase 1: MVP ✅ (Completed)
- [x] Core inheritance logic
- [x] Bitcoin integration (P2PKH)
- [x] Activity tracking
- [x] Automatic inheritance execution
- [x] Web dashboard
- [x] Heir management

### Phase 2: Enhanced Features 🚧 (In Progress)
- [ ] Email/SMS notifications for heirs
- [ ] Multi-signature support
- [ ] Advanced Bitcoin address types (P2TR)
- [ ] Mobile app
- [ ] Testnet deployment

### Phase 3: Scale 🔮 (Future)
- [ ] Support for other cryptocurrencies (ETH, SOL)
- [ ] Integration with hardware wallets
- [ ] Legal document integration
- [ ] Mainnet deployment
- [ ] Enterprise features for family offices

---

## 💰 Business Model (Future)

### Revenue Streams

1. **Transaction Fees** (0.5% of inherited amount)
   - Only charged when inheritance executes
   - Competitive with traditional estate planning

2. **Premium Features** (Subscription)
   - Advanced notifications
   - Priority support
   - Custom inheritance rules

3. **Enterprise Plans** (Custom Pricing)
   - Family office solutions
   - Multi-account management
   - White-label options

---

## 🌍 Impact

### The Vision

**Make Bitcoin inheritance as simple as writing a will, but:**
- ✅ Automatic
- ✅ Trustless
- ✅ Decentralized
- ✅ Accessible to everyone

### By The Numbers

If HeirLock captures just **1% of Bitcoin holders**:
- **500,000 users**
- **$8B+ in assets under management**
- **Preventing billions in lost Bitcoin**

---

## 👥 Team

Built by blockchain developers passionate about:
- Bitcoin's mission of financial sovereignty
- Internet Computer's vision of decentralized computing
- Making crypto accessible to everyone

---

## 📞 Get Involved

### For Users
🌐 **Try the Demo**: [Launch HeirLock](#getting-started)
📧 **Join Waitlist**: [Coming Soon]

### For Developers
🔧 **Contribute**: Open source and welcoming contributions
📖 **Documentation**: Comprehensive API docs included
🐛 **Report Issues**: Help us improve

### For Investors
💼 **Contact**: [Investment opportunities available]

---

## ⚠️ Important Disclaimers

- **Experimental Software**: Currently in testing phase
- **Use at Your Own Risk**: Start with small amounts
- **Not Financial Advice**: Consult professionals for estate planning
- **Regulatory Compliance**: Users responsible for local regulations

---

## 🎓 Learn More

### Resources
- [Internet Computer Bitcoin Integration](https://internetcomputer.org/bitcoin-integration)
- [Threshold ECDSA](https://internetcomputer.org/docs/current/developer-docs/integrations/t-ecdsa/)
- [Motoko Documentation](https://internetcomputer.org/docs/current/motoko/main/motoko)

### Technical Documentation
- API Reference: See [API Endpoints](#-api-endpoints) section
- Architecture Deep Dive: See [Technology Architecture](#-technology-architecture)
- Security Audit: [Coming Soon]

---

## 📄 License

Open source under [MIT License]. Part of the Internet Computer examples repository.

---

<div align="center">

### 🔐 HeirLock: Your Bitcoin Legacy, Secured Forever

**Built with ❤️ on the Internet Computer**

[Get Started](#-getting-started) • [Documentation](#-learn-more) • [GitHub](#)

*"The best time to plan your Bitcoin inheritance was yesterday. The second best time is now."*

</div>

---

## 📊 Appendix: API Endpoints

### User Management
```motoko
login() : async UserProfile
get_profile() : async ?UserProfile
heartbeat() : async ()
```

### Bitcoin Operations
```motoko
generate_bitcoin_address() : async Text
get_bitcoin_address() : async ?Text
get_balance() : async Satoshi
get_address_balance(address: Text) : async Satoshi
get_address_utxos(address: Text) : async GetUtxosResponse
```

### Heir Management
```motoko
add_heir(request: AddHeirRequest) : async Result<HeirId, Text>
remove_heir(heir_id: HeirId) : async Result<(), Text>
get_heirs() : async [Heir]
get_total_allocation() : async Nat
```

### Inheritance Control
```motoko
set_inactivity_period(seconds: Nat) : async Result<(), Text>
get_inactivity_status() : async ?InactivityStatus
trigger_inheritance_check() : async ()
```

---

**Last Updated**: November 2025
**Version**: 1.0.0
**Status**: MVP Complete, Testing Phase




HeirLock is a decentralized Bitcoin inheritance platform built on the Internet Computer Protocol (ICP) that solves the critical problem of lost Bitcoin assets when holders pass away or become inactive. The platform enables automatic, trustless distribution of Bitcoin to designated heirs after a configurable period of inactivity.

**Development Process:**

The project was built using a full-stack approach with Motoko for the backend smart contracts and Next.js/React for the frontend. The development process involved:

1. **Backend Architecture (Motoko):**
   - Implemented core modules: UserManager, HeirManager, ActivityTracker, InheritanceEngine, and Scheduler
   - Integrated with ICP's Bitcoin API for direct Bitcoin network interaction
   - Utilized Threshold ECDSA (tECDSA) for decentralized key management and transaction signing
   - Built automated scheduler that checks for inactive users every 60 seconds
   - Implemented P2PKH transaction construction for Bitcoin transfers

2. **Frontend Development (Next.js/React):**
   - Created intuitive dashboard with real-time countdown timer
   - Implemented heir management interface with Bitcoin balance tracking
   - Built activity monitoring system with heartbeat mechanism
   - Integrated Internet Identity for secure authentication
   - Used TanStack Query for efficient data fetching and caching

3. **Bitcoin Integration:**
   - Leveraged ICP's native Bitcoin integration capabilities
   - Implemented UTXO management and balance queries
   - Built transaction construction and signing using threshold signatures
   - Tested extensively on Bitcoin regtest network

**Key Achievements:**

✅ **Technical Innovation:**
- First fully automated, non-custodial Bitcoin inheritance solution on ICP
- Seamless integration of Bitcoin network with Internet Computer smart contracts
- Trustless execution without requiring intermediaries or manual intervention

✅ **User Experience:**
- Simple 5-minute setup process
- Real-time monitoring dashboard with live countdown timer
- No technical knowledge required for heirs to receive Bitcoin
- Flexible configuration (multiple heirs, custom allocations, configurable inactivity periods)

✅ **Security & Decentralization:**
- 100% non-custodial - users maintain full control of their Bitcoin
- Distributed key management through threshold ECDSA
- Automated execution via immutable smart contracts
- No single point of failure

✅ **Production-Ready Features:**
- Complete MVP with all core functionality
- Comprehensive error handling and validation
- Real-time balance tracking for all addresses
- Activity monitoring with configurable periods (30 seconds to 1 year for testing/production)

The platform addresses a real-world problem affecting billions of dollars in lost Bitcoin, providing a practical solution that combines the security of Bitcoin with the automation capabilities of Internet Computer smart contracts.
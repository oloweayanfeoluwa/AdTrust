# AdTrust

A blockchain-based advertising and marketing platform that ensures transparency, rewards real engagement, and eliminates fraud through a decentralized, privacy-respecting protocol — all powered by smart contracts on-chain.

---

## Overview

AdTrust consists of ten smart contracts that collectively create a secure, fair, and verifiable advertising ecosystem for advertisers, users, and publishers:

1. **Ad Campaign Contract** – Launches and manages on-chain ad campaigns with budgets and targeting.
2. **Ad Verification Oracle Contract** – Validates genuine ad views and engagement using off-chain data.
3. **Reward Distribution Contract** – Rewards verified users with tokens based on interaction.
4. **User Identity & Consent Contract** – Handles user opt-in, data privacy preferences, and verification.
5. **Reputation Score Contract** – Tracks behavior history of advertisers and publishers.
6. **Ad Publisher Registry Contract** – Manages the registry of verified ad-hosting entities.
7. **Fraud Detection Bounty Contract** – Allows the community to report and prove fraudulent activity.
8. **Escrow & Dispute Resolution Contract** – Holds funds and resolves advertiser-publisher disputes.
9. **Analytics & Performance Contract** – Records ad campaign metrics on-chain.
10. **Governance DAO Contract** – Empowers stakeholders to vote on protocol upgrades and rules.

---

## Features

- **Verified ad impressions** with oracle integration  
- **User rewards** for real engagement (clicks, views, shares)  
- **On-chain advertiser transparency** for budgets and targeting  
- **Community-based fraud detection** with bounties  
- **Reputation scores** for trust in advertisers and publishers  
- **Decentralized dispute resolution** through escrow logic  
- **Publisher registry** to ensure verified ad placements  
- **DAO governance** for protocol evolution  
- **User-owned data** with opt-in monetization  
- **Detailed analytics** for advertisers and stakeholders  

---

## Smart Contracts

### Ad Campaign Contract
- Create, modify, or end campaigns
- Set budget, format, and targeting rules
- Track funds and ad lifecycle status

### Ad Verification Oracle Contract
- Connects to off-chain ad view/click data
- Validates human interaction before payment
- Prevents bot/spam clicks

### Reward Distribution Contract
- Distributes tokens to verified users
- Tiered rewards by engagement type
- Rate limits to prevent abuse

### User Identity & Consent Contract
- Stores hashed user identity and preferences
- Allows users to opt into monetization
- Respects privacy while enabling targeting

### Reputation Score Contract
- Calculates score from past behavior
- Penalizes bad actors or fraud attempts
- Weights reputation in DAO votes

### Ad Publisher Registry Contract
- Registers approved sites and creators
- Links wallet to platform identity
- Verifies eligibility for campaigns

### Fraud Detection Bounty Contract
- Users report suspected fraud
- On-chain evidence submission
- Rewards verified fraud busters

### Escrow & Dispute Resolution Contract
- Holds ad funds during campaign
- Resolves disputes with DAO/judges
- Refund or release logic

### Analytics & Performance Contract
- Logs view/click/conversion metrics
- Public campaign dashboards
- Campaign-specific reports

### Governance DAO Contract
- Stakeholders vote on protocol updates
- Funds allocation and bounty governance
- On-chain proposal lifecycle

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet/getting-started)
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/adtrust.git
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

## Usage

Each contract operates modularly and can be integrated via function calls or DAO-approved workflows. Refer to the /contracts/ folder for detailed documentation on how to interact with each smart contract.

## License

MIT License
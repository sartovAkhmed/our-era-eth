# TreeChain — Green Blockchain for Real-World Impact

## Project Overview
TreeChain is a decentralized application focused on carbon footprint compensation and environmental sustainability through real tree planting backed by blockchain technology.

The goal is to create a global platform that connects companies, donors, planters, and verifiers in a transparent ecosystem using tokenized proof of action.

“Created during the ETHBishkek 2025 hackathon.”

## Problem Statement
Traditional carbon offset markets suffer from low transparency, manual verification, and limited trust. Donors and businesses often cannot verify whether their funds truly contribute to real environmental impact.

## How It Works
TreeChain combines two business models in a single ecosystem:

### B2B: Corporate Carbon Compensation
1. A company creates planting orders  
2. Payment locked in escrow smart contract  
3. Planters execute planting tasks  
4. DAO/verifiers validate proofs  
5. Company receives verified corporate NFT certificate  
6. Platform earns margin from the transaction  

### B2C: NFT Tree Sponsorship
1. Donor purchases a Tree NFT  
2. Funds are allocated to real planting  
3. NFT is marked “Pending” before verification  
4. After planting is verified, NFT becomes “Verified”  
5. Donor receives reward tokens  
6. Platform receives commission  

Both models use a shared task pool for tree-planting assignments.

## User Roles
- **Business Client** — pays for CO₂ compensation and receives certified NFT  
- **Donor** — sponsors planting through Tree NFTs  
- **Planter** — executes planting tasks and receives rewards  
- **Verifier / DAO** — confirms evidence and ensures trust  

## Mission Statement
We create a digital trace for every planted tree to ensure transparency and trust in environmental improvement.

## Key Features
- On-chain tree verification
- NFT generation and lifecycle (Pending → Verified)
- Escrow smart contract for corporate orders
- Token rewards for planters and donors
- DAO-based verification mechanics
- Transparent task marketplace for planting operations

## Technologies Used
- **Frontend:** Next.js, React, TypeScript, Wagmi
- **Blockchain:** Solidity, Hardhat
- **Framework / Boilerplate:** Scaffold-Eth 2
- **Network:** Status Network
- **Development Tools:** Yarn


## Installation & Execution

### Install Scaffold-Eth extension
```bash
npx create-eth@latest -e status-im/status-network-scaffold-extension

Configure account
yarn generate

Deploy to Status Network
yarn deploy --network statusSepolia

Verify smart contract
yarn hardhat:hardhat-verify --network statusSepolia <YourDeployedContractAddress>

Launch Frontend
yarn start

Team
  - Akhmed — Smart Contract Developer
  - Kurmanbek — Smart Contract Developer
  - Erlik — Product Manager
  - Maksat — Business Analyst
  - Ramzan — Frontend Developer

License
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

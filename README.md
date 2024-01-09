## Introduction 

The xxx token(s) is a stablecoin with a smart contract architecture designed for upgradeability and robust features such as EIP-2612 permit, pausability, blacklisting, and flexible access control. The stablecoin is fully collateralised by a combination of cash and high quality government bonds, combining the stability of traditional finance with the flexibility of blockchain technology. The smart contract is based on traditional architecture for smart contract with additional functionalities as required for legal, compliance and business requiremeents.


## Smart Contract Capabilities

- Upgradeable
- Supports EIP 2612
- Pausable
- Supports blacklisting/freezing wallet addresses
- Access Control

## Features

### Upgradeability

The smart contract is designed to be upgradeable, which means that it can be updated or improved over time without the need to deploy a new contract. This is crucial for fixing bugs, improving functionality, or adding new features in response to regulatory changes or business requirements.

Upgradeability is achieved through a proxy pattern using OpenZeppelin's ERC20PermitUpgradeable.sol, which separates the contract logic from the state. This allows us to upgrade the contract's code while preserving its state, such as balances and allowances.


### Permit (EIP-2612)

The EIP-2612 standard introduces a method for users to approve token transfers with signatures instead of transactions. This means users can allow a third party to transfer tokens on their behalf without executing a transaction and incurring gas fees at the time of approval. Permits significantly reduce transaction costs and improve user experience, especially in applications where users need to give various permissions for automated or recurring transactions.

The implementation also relies on standard OpenZeppelin erc20 extensions, notably ERC20PermitUpgradeable.sol from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/token/ERC20/extensions/ERC20PermitUpgradeable.sol)

### Pausability

The contract can be paused in the case of an emergency or a detected vulnerability. When paused, all token transfers, minting, and burning are halted. Pausability is a safeguard feature that can be triggered by authorized roles, effectively freezing all non-administrative contract activity. Pausability is a critical security feature for a stablecoin, as it allows the issuer to mitigate damage in the event of an attack or a critical bug, ensuring the safety of the users' funds.

Pausability is implemented by reusing https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/utils/PausableUpgradeable.sol

### Blacklisting

The contract includes a feature to blacklist addresses. Blacklisted addresses are prevented from receiving and sending the stablecoin, effectively freezing their assets. Blacklisting addresses allows the issuer to comply with regulatory requirements, such as anti-money laundering (AML) laws, by preventing bad actors from participating in the network. Administrative roles can add or remove addresses from this list.

A blacklist feature is implemented via maintaining a simple mapping structure:
`mapping(address => bool) public isBlacklisted;`

### Access Control

Access control is a security feature that restricts who can perform certain actions within the contract. It ensures that only authorized entities can execute sensitive functions like minting or blacklisting. In a regulated environment, strict control over who can mint or burn tokens is necessary for compliance and to prevent unauthorized issuance of the stablecoin, which could lead to fraud or financial instability.

Access control functionality relies on Open Zeppelin's upgradeable implementation (https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/access/AccessControlUpgradeable.sol). The contract defines multiple roles with specific permissions.

## Implementation

### Double-mint/burn safeguard

To prevent the same minting or burning request from being executed multiple times, the contract includes a safeguard mechanism (unique identified). The contract keeps track of these IDs, ensuring that each request is only executed once.

Minting and burning is governed by a bespoke off-chain system implemented specificaly for xxx. Due to the asynchronous nature of web2 interactions, the smart contract needs to safeguard the rest of the platform from executing the same mint or burn operation twice. 

To this end, the `mint()` and `burn()` operations on the smart contract are enriched with an `id` parameter: 

`function mint(address to, uint256 amount, string calldata id)` 

and 

`burn(uint256 amount, string calldata id)` 

and their respective storage fields:

`mapping(string => bool) public executedMintRequests;`

and

`mapping(string => bool) public executedBurnRequests;`

### Access Control

There are four customisable roles estalished in the smart contract:

- AP_ROLE - used for whitelisting addresses to mint to. Only authorized partners and their wallets are allowed to be recipients (transfer to) of newly minted tokens. 
- MINTER_ROLE - used for gatekeeping access to the `mint()` function
- BURNER_ROLE - used for gatekeeping access to the `burn()` function
- BLACKLIST_ROLE - used for gatekeeping access to the `addToBlacklist()` and `removeFromBlacklist()` functions

the `pause()` and `unpause()` methods can only be called by the holder of the DEFAULT_ADMIN_ROLE

# Deployment and migrations

truffle migrate --network dashboard
truffle run verify DFToken --network [TARGET_NETWORK]

## Install dependencies

Run `npm i` to install all dependencies.

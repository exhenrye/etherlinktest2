# xxx Stablecoin Token

the xxx token is an upgradeable stablecoin contract. The stablecoin itself is backed by real-life reserves which are held by a traditional bank.

# Smart Contract

- Upgradeable
- Supports EIP 2612
- Pausable
- Supports blacklisting/freezing wallet addresses
- Access Control

## Features

### Upgradeability

The contract is built with upgradeability in mind. Upgradeability is provided by reusing ERC20PermitUpgradeable.sol from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/token/ERC20/extensions/ERC20PermitUpgradeable.sol) and maintaining migrations via Truffle.

### Permit

EIP-2612 permits are implemented for transactionless permit approvals. The implementation also relies on standard OpenZeppelin erc20 extensions, notably ERC20PermitUpgradeable.sol from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/token/ERC20/extensions/ERC20PermitUpgradeable.sol)

### Pausability

Pausability is implemented by reusing https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/utils/PausableUpgradeable.sol

### Blacklisting

A blacklist feature is implemented via maintaining a simple mapping structure:

`mapping(address => bool) public isBlacklisted;`

### Access Control

Access control functionality relies on Open Zeppelin's upgradeable implementation (https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/access/AccessControlUpgradeable.sol).

## Implementation

### Double-mint/burn safeguard

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

There are four roles estalished in the smart contract:

- AP_ROLE - used for whitelisting addresses to mint to. Only authorized partners and their wallets are allowed to be recipients of newly minted tokens. 
- MINTER_ROLE - used for gatekeeping access to the `mint()` function
- BURNER_ROLE - used for gatekeeping access to the `burn()` function
- BLACKLIST_ROLE - used for gatekeeping access to the `addToBlacklist()` and `removeFromBlacklist()` functions

the `pause()` and `unpause()` methods can only be called by the holder of the DEFAULT_ADMIN_ROLE

# Deployment and migrations

truffle migrate --network dashboard 

## Install dependencies

Run `npm i` to install all dependencies.

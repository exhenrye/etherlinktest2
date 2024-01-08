// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract DFToken is
    ERC20PermitUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    bytes32 public constant AP_ROLE = keccak256("AP_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant BLACKLIST_ROLE = keccak256("BLACKLIST_ROLE");

    // Stores a key value pair to track all blacklisted addresses
    mapping(address => bool) public isBlacklisted;

    // Stores a key value pair to track all executed mint requests
    mapping(string => bool) public executedMintRequests;

    // Stores a key value pair to track all executed transfer requests
    mapping(string => bool) public executedTransferRequests;

    // Stores a key value pair to track all executed burn requests
    mapping(string => bool) public executedBurnRequests;

    /// @notice Logs when an address is added to the blacklist
    /// @param user the blacklisted address
    event AddedToBlacklist(address user);
    /// @notice Logs when an address is removed from the blacklist
    /// @param user the un-blacklisted address
    event RemovedFromBlacklist(address user);
    /// @notice Logs when tokens are minted
    /// @param to the address receving tokens
    /// @param amount the token amount
    /// @param id request id used for bookkeeping
    event Mint(address to, uint256 amount, string id);
    /// @notice Logs when tokens are burned
    /// @param from the address burning tokens
    /// @param amount the amount of tokens burned
    /// @param id request id used for bookkeeping
    event Burn(address from, uint256 amount, string id);
    /// @notice Logs when tokens are transferred out
    /// @param to the address receiving tokens
    /// @param amount the amount of tokens transferred
    /// @param id request id used for bookkeeping
    event TransferOut(address to, uint256 amount, string id);

    function initialize(
        string memory name,
        string memory symbol
    ) public virtual initializer {
        __ERC20_init(name, symbol);
        __ERC20Permit_init(name);
        __Pausable_init();
        __AccessControl_init();

        _setRoleAdmin(AP_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(BURNER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(BLACKLIST_ROLE, DEFAULT_ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(BLACKLIST_ROLE, msg.sender);
    }

    /// @notice Emergency pause contract
    /// @dev only the admin can call this function. Emits Pause event
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        super._pause();
    }

    /// @notice Unpause contract
    /// @dev only the admin can call this function. Emits Unpause event
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        super._unpause();
    }

    /// @notice Adds an address to the blacklist
    /// @dev only granted address can call this function. Emits AddedToBlacklist event
    /// @param addr address
    function addToBlacklist(address addr) public onlyRole(BLACKLIST_ROLE) 
    {
        require(!isBlacklisted[msg.sender], "address already blacklisted");
        
        isBlacklisted[addr] = true;
        emit AddedToBlacklist(addr);
    }

    /// @notice Removes an address from the blacklist
    /// @dev only granted address can call this function. Emits RemovedFromBlacklist event
    /// @param addr address
    function removeFromBlacklist(address addr) public onlyRole(BLACKLIST_ROLE)
    {
        require(isBlacklisted[msg.sender], "address not blacklisted");
        
        isBlacklisted[addr] = false;
        emit RemovedFromBlacklist(addr);
    }

    /// @notice Mint tokens 
    /// @dev only granted address address can call this function. Emits Mint event
    /// @param to the recipient of minted tokens 
    /// @param amount the amount of minted tokens
    /// @param id request id; used for bookkeeping
    function mint(
        address to,
        uint256 amount,
        string calldata id
    ) public onlyRole(MINTER_ROLE) {
        require(!executedMintRequests[id],"mint request already executed");
        require(hasRole(AP_ROLE,to),"mint wallet not registered");
        executedMintRequests[id] = true;

        _mint(to, amount);
        emit Mint(to, amount, id);
    }

    /// @notice Burn tokens 
    /// @dev only granted address address can call this function. Emits Burn event
    /// @param amount the amount of burned tokens
    /// @param id request id; used for bookkeeping
    function burn(
        uint256 amount,
        string calldata id
    ) public onlyRole(BURNER_ROLE) {
        require(!executedBurnRequests[id],"burn request already executed");
        executedBurnRequests[id] = true;

        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount, id);
    }

    /// @notice Transfer tokens 
    /// @dev only granted address address can call this function. Emits TransferOut event
    /// @param to the recipient of transferred tokens 
    /// @param amount the amount of transferred tokens
    /// @param id request id; used for bookkeeping
    function transferOut(
        address to,
        uint256 amount,
        string calldata id
    ) public onlyRole(MINTER_ROLE) {
        require(!executedTransferRequests[id],"transfer request already executed");
        executedTransferRequests[id] = true;

        transfer(to, amount);
        emit TransferOut(to, amount, id);
    }

    /// @notice implements pause and blacklist functionality
    function _update(address from, address to, uint256 value) internal virtual override whenNotPaused {
        require(!isBlacklisted[from], "Sender is blacklisted");
        require(!isBlacklisted[to], "Recipient is blacklisted");

        super._update(from, to, value);
    }
}
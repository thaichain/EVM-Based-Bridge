// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BscBridge {
    address public owner;
    address public bridgeAddress;
    IERC20 private token;
    uint public tokenCount = 1;
    uint public transactionCount = 1;

    struct Transaction {
        address sender;
        uint amount;
        uint targetchain;
        uint tokenId;
        uint status;
    }

    struct Tokens {
        string name;
        address tokenAddress;
        string symbol;
        uint decimal;
        bool available;
    }

    event Log(
        address indexed sender,
        uint amount,
        uint tokenID,
        string tokenName
    );
    event LogReceive(
        address indexed recipent,
        uint amount,
        uint tokenID,
        string tokenName
    );

    mapping(uint => Tokens) public supportedTokens;
    mapping(uint => Transaction) public transactions;

    constructor(address _bridgeAddress) {
        owner = msg.sender;
        bridgeAddress = _bridgeAddress;
    }

    function addSupportedToken(
        string memory _name,
        string memory _symbol,
        address _tokenAddress,
        uint _decimal
    ) public onlyOwner {
        supportedTokens[tokenCount] = Tokens({
            name: _name,
            tokenAddress: _tokenAddress,
            symbol: _symbol,
            decimal: _decimal,
            available: true
        });
        tokenCount++;
    }

    function pauseToken(uint _tokenId) public onlyBridge {
        supportedTokens[_tokenId].available = false;
    }

    function unpauseToken(uint _tokenId) public onlyBridge {
        supportedTokens[_tokenId].available = true;
    }

    function viewCount() public view returns (uint) {
        return tokenCount;
    }

    function viewTxCount() public view returns (uint) {
        return transactionCount;
    }

    function viewSupportedToken(
        uint _tokenID
    ) public view returns (Tokens memory) {
        return supportedTokens[_tokenID];
    }

    function wss(uint _txID) public view returns (Transaction memory) {
        return transactions[_txID];
    }

    function approveToken(uint _amount, uint _tokenID) public {
        token = IERC20(supportedTokens[_tokenID].tokenAddress);
        token.approve(address(this), _amount * 10 ** supportedTokens[_tokenID].decimal);
    }

    function setCompleted(uint _txID) public onlyBridge {
        transactions[_txID].status = 3;
    }

    function deposit(uint256 _amount, uint _tokenID) public {
        require(
            supportedTokens[_tokenID].available == true,
            "this token is paused"
        );
        token = IERC20(supportedTokens[_tokenID].tokenAddress);
        bool txn = token.transferFrom(msg.sender, address(this), _amount * 10 ** supportedTokens[_tokenID].decimal);
        require(txn, "Not Confirmed");
        transactions[transactionCount] = Transaction({
            sender: msg.sender,
            amount: _amount,
            tokenId: _tokenID,
            targetchain: 1,
            status: 1
        });
        transactionCount++;
        emit Log(msg.sender, _amount, _tokenID, supportedTokens[_tokenID].name);
    }

     function recive(
        uint256 _amount,
        address _recipent,
        uint _tokenID
    ) public onlyBridge returns (bool) {
        require(
            supportedTokens[_tokenID].available == true,
            "this token is paused"
        );
        token = IERC20(supportedTokens[_tokenID].tokenAddress);
        bool txn = token.transferFrom(address(this), _recipent,  _amount * 10 ** supportedTokens[_tokenID].decimal);
        emit LogReceive(
            _recipent,
            _amount,
            _tokenID,
            supportedTokens[_tokenID].name
        );
        return txn;
    }

    function ClearETH(address payable _to, uint _amount) public onlyOwner {
        _to.transfer(_amount);
    }

    function ClearERC20(
        uint256 _amount,
        address _recipent,
        uint _tokenID
    ) public onlyOwner {
        token = IERC20(supportedTokens[_tokenID].tokenAddress);
        token.transferFrom(address(this), _recipent, _amount);
        emit LogReceive(
            _recipent,
            _amount,
            _tokenID,
            supportedTokens[_tokenID].name
        );
    }

    modifier onlyBridge() {
        require(msg.sender == bridgeAddress, "You should use Bridge");
        _;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
}

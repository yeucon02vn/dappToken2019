// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.9;
import "./TeamToken.sol";

contract TeamTokenSale {

    TeamToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address _buyer,
        uint256 _amount
    );

    event Buy(
        address _buyer,
        address _owner,
        uint256 _amount
    );

    constructor(TeamToken _tokenContract, uint256 _tokenPrice ) {
        tokenPrice = _tokenPrice;
        tokenContract = _tokenContract;
    }

    function buyTokens(uint256 _numberOfTokens) public payable returns (bool) {

        require(tokenContract.transfer(msg.sender , _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);

        return true;
    }

    
    function buyProducts(uint256 _numberOfTokens) public payable returns (bool) {
        
        require(tokenContract.transferFrom(msg.sender, address(this), _numberOfTokens));
        require(tokensSold >= _numberOfTokens);
        tokensSold -= _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);

        return true;
    }
}
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

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable returns (bool) {
        // require(msg.value == multiply(_numberOfTokens, tokenPrice));
        // require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender , _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);

        return true;
    }

    
    function buyProducts(uint256 _numberOfTokens) public payable returns (bool) {
        require(tokenContract.balanceOf(msg.sender) >= _numberOfTokens);
        require(tokenContract.transferFrom(msg.sender, address(this), _numberOfTokens));
        require(tokensSold >= _numberOfTokens);
        tokensSold -= _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);

        return true;
    }
}
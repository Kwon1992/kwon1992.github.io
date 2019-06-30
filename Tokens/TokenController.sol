pragma solidity 0.5.2;

import "./ButterToken.sol";
import "./BakingMastery.sol";

contract TokenController{
    address owner;
    address[2] tokens; // 0 : ButterToken, 1 : BakingMastery

    constructor() public {
        owner = msg.sender;
        tokens[0] = new ButterToken("ButterToken", "BTK", msg.sender);
        //tokens[1] = new LeaderToken();
    }

    function convertTokens(uint256 amount) returns (uint256) { // BakingMastery to Butter
        //여기서의 msg.sender == Token 교환을 요청한 user
        require(BakingMastery(tokens[1]).convertLTKtoGTK(amount, msg.sender));
        ButterToken(tokens[0]).convertLTKtoGTK(amount/100, msg.sender);
        return amount/100;
    } 

}


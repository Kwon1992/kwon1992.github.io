pragma solidity 0.5.2;

import "https://github.com/Kwon1992/kwon1992.github.io/blob/master/Tokens/ButterToken.sol";
import "https://github.com/Kwon1992/kwon1992.github.io/blob/master/Tokens/BakingMastery.sol";

contract TokenController{
    address owner;
    address[2] tokens; // 0 : ButterToken, 1 : BakingMastery

    constructor() public {
        owner = msg.sender;
        tokens[0] = address(new ButterToken("ButterToken", "BTK", msg.sender));
        tokens[1] = address(new BakingMastery("BakingMasteryToken","BMTK", msg.sender));
    }

    function convertTokens(uint256 amount) public returns (uint256) { // BakingMastery to Butter
        //여기서의 msg.sender == Token 교환을 요청한 user
        require(BakingMastery(tokens[1]).convertLTKtoGTK(amount, msg.sender));
        ButterToken(tokens[0]).convertLTKtoGTK(amount/100, msg.sender);
        return amount/100;
    } 
    
    function viewButterTokenAddr() external view returns (address) {
        return tokens[0];
    }
    
    function viewBakingMasteryTokenAddr() external view returns (address) {
        return tokens[1];
    }

}


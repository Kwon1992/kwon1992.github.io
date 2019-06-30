pragma solidity 0.5.2;


contract BakingMastery{ // LTK == BakingMastery

    address owner;
    address controller;
    string name;
    string symbol;
    uint256 private initialTokens;
    uint256 private totalTokens;
    uint256 private tokenPrice;  // 1ETH에 몇 개의 토큰을 줄 것인가.

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) private allowed;

    constructor (string memory _name, string memory _symbol, address minter) public payable { // Constructor only called once when deployed.
        owner = minter;
        controller = msg.sender;
        name = _name;
        symbol = _symbol;

        initialTokens = 10**21;
        totalTokens = 10**21;
    }

    modifier onlyOwner() {
        require(msg.sender == owner || msg.sender == controller);
        _;
    }


    // give initial BakingMasteryToken
    function createAccount() public returns (bool) {
        require(balances[msg.sender] == 0);
        totalTokens -= 10000;
        balances[msg.sender] += 10000;
        return true;
    }

    // get BakingMastery
    function getLTK(uint256 value) public returns (uint256 remains) {
        require(totalTokens >= 0);
        require(balances[msg.sender] + value > balances[msg.sender]);
        balances[msg.sender] += value;
        totalTokens -= value;
        return balances[msg.sender];
    }

    // convert LTK to GTK [1:1 ratio]
    function convertLTKtoGTK(uint256 amount, address user) public onlyOwner returns (bool) {
        require(balances[user] > amount);
        balances[user] -= amount;
        return true;
    }


    function transfer(address to, uint256 value) external returns (bool) {
        require(balances[msg.sender] >= value); // need more balance than value.
        require(balances[to] != 0x0); // "to" must have an account for transfer.
        require(balances[to] + value > balances[to]); // caution for overflow.
        balances[msg.sender] -= value;
        balances[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return allowed[owner][spender];
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(balances[from] != 0x0 && balances[to] != 0x0);
        require(balances[from] >= value);
        require(balances[to] + value > value);
        require(allowance(from, msg.sender) != 0);

        balances[from] -= value;
        balances[to] += value;
        allowed[from][msg.sender] -= 1; // sub 1 from count of approve
        return true;

    }

    // VIEWERS
    function totalSupply() external view returns (uint256) {
        return totalTokens;
    }

    function balanceOf(address who) external view returns (uint256) {
        return balances[who];
    }

    function viewOwner() external view returns (address) {
        return owner;
    }

    function viewcontroller() external view returns (address) {
        return controller;
    }



    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

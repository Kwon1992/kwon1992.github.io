pragma solidity 0.5.2;

contract ButterToken { //ButterToken == GTK

    address owner;
    address controller;
    string name;
    string symbol;
    uint256 public initialTokens;
    uint256 public totalTokens;
    uint256 public tokenPrice;  // 1토큰 가격

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) private allowed;

    constructor (string memory _name, string memory _symbol, address minter) public { // Constructor only called once when deployed.
        owner = minter;
        controller = msg.sender;
        name = _name;
        symbol = _symbol;
        initialTokens = 10**21;
        totalTokens = 10**21;
        tokenPrice = 10000000000000;
    }

    modifier onlyOwner() {
        require(msg.sender == owner || msg.sender == controller);
        _;
    }

    // view amount of ETH in this contract
    function getETH() public view returns (uint256) {
        return address(this).balance;
    }

    //to send ETH to deployer.
    function sendETH() payable public onlyOwner returns (bool result) {
        require(getETH() > 0);
        msg.sender.transfer(address(this).balance);
        return true;
    }

    //convert LTK to GTK function
    function convertLTKtoGTK(uint256 value, address to)  public onlyOwner returns (bool result){
        require(totalTokens - value >= 0);
        balances[to] += value;
        totalTokens -= value;
        return true;
    }


    function buyToken() payable public returns (uint) {
        uint tokensToBuy = msg.value / tokenPrice;
        require(balances[msg.sender] + tokensToBuy >= balances[msg.sender]); // watch for overflow
        require(totalTokens >= tokensToBuy);
        balances[msg.sender] += tokensToBuy;
        totalTokens -= tokensToBuy;
    }

    function retrieveTokens(uint256 tokenAmount) public returns (bool) {
        balances[msg.sender] -= tokenAmount;
        totalTokens += tokenAmount;
        return true;
    }


    function transfer(address to, uint256 value) external returns (bool) {
        require(balances[msg.sender] >= value); // need more balance than value.
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
    function getInitialSupply() external view returns (uint) {
        return initialTokens;
    }

    function getTotalSupply() external view returns (uint) {
        return totalTokens;
    }

    function getBalanceOf() external view returns (uint) {
        return balances[msg.sender];
    }

    function getTokenPrice() view public returns(uint){
        return tokenPrice;
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
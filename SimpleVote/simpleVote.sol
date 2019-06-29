pragma solidity ^0.4.24;

contract simpleVote {
    
    struct voter {
        address voterAddress;
        uint tokenBought;
    }
    
    mapping (address => voter) public voters; // ��ǥ�ڵ��� �ּ�
    mapping (bytes32 => uint) public votesReceived; // �ĺ��� ��ǥ ��
    
    bytes32[] public candidateNames; // �ĺ��� �迭
    
    uint public totalToken; // ��ū �� ����
    uint public balanceTokens; // ���� ��ū ��
    uint public tokenPrice; // ��ū ���� ex) 0.01 ether
    
    constructor(uint _totalToken, uint _tokenPrice) public // Tx ������ ȣ����
    {
        totalToken = _totalToken;
        balanceTokens = _totalToken;
        tokenPrice = _tokenPrice;
        
        candidateNames.push("Monday");
        candidateNames.push("Tuesday");
        candidateNames.push("Wednesday");
        candidateNames.push("Thursday");
        candidateNames.push("Friday");
        candidateNames.push("Saturday");
        candidateNames.push("Sunday");
    }
    
    function buy() payable public returns (int) 
    {
        uint tokensToBuy = msg.value / tokenPrice;
        require(tokensToBuy <= balanceTokens);
        voters[msg.sender].voterAddress = msg.sender;
        voters[msg.sender].tokenBought += tokensToBuy;
        balanceTokens -= tokensToBuy;
    }
    
    function getVotesReceivedFor() view public returns (uint, uint, uint, uint, uint, uint, uint)
    {
        return (votesReceived["Monday"],
        votesReceived["Tuesday"],
        votesReceived["Wednesday"],
        votesReceived["Thursday"],
        votesReceived["Friday"],
        votesReceived["Saturday"],
        votesReceived["Sunday"]);
    }
    
    function vote(bytes32 candidateName, uint tokenCountForVote) public
    {
        uint index = getCandidateIndex(candidateName);
        require(index != uint(-1));
        
        require(tokenCountForVote <= voters[msg.sender].tokenBought);
        
        votesReceived[candidateName] += tokenCountForVote;
        voters[msg.sender].tokenBought -= tokenCountForVote;
    }
    
    function getCandidateIndex(bytes32 candidate) view public returns (uint) // �ش� �ĺ����� index ��ȯ
    {
        for(uint i=0; i < candidateNames.length; i++)
        {
            if(candidateNames[i] == candidate)
            {
                return i;
            }
        }
        
        return uint(-1); // �ĺ��ڰ� ���� ��� -1 ��ȯ
    }
    
    function getCandidatesInfo() view public returns (bytes32[]) // �ĺ��� �̸��� ��ȯ
    {
        return candidateNames;
    }
    
    function getTotalToken() view public returns(uint)
    {
        return totalToken;
    }
    
    function getBalanceTokens() view public returns(uint)
    {
        return balanceTokens;
    }
    
    function getTokenPrice() view public returns(uint)
    {
        return tokenPrice;
    }
    
    function getTokenBought() view public returns(uint)
    {
        return voters[msg.sender].tokenBought;
    }
}
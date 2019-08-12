import React from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3'; // yarn add web3 후 사용 가능.


let lotteryAddress = '0xe5269d1B96fe86e45675bBA41029F6c9fC3BF5F5';
let lotteryABI = [ { "constant": true, "inputs": [], "name": "answerForTest", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x84f7e4f0" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8da5cb5b" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor", "signature": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "BET", "type": "event", "signature": "0x100791de9f40bf2d56ffa6dc5597d2fd0b2703ea70bc7548cd74c04f5d215ab7" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answer", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "WIN", "type": "event", "signature": "0x8219079e2d6c1192fb0ff7f78e6faaf5528ad6687e69749205d87bd4b156912b" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answer", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "FAIL", "type": "event", "signature": "0x3b19d607433249d2ebc766ae82ca3848e9c064f1febb5147bc6e5b21d0adebc5" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answer", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "DRAW", "type": "event", "signature": "0x72ec2e949e4fad9380f9d5db3e2ed0e71cf22c51d8d66424508bdc761a3f4b0e" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "REFUND", "type": "event", "signature": "0x59c0185881271a0f53d43e6ab9310091408f9e0ff9ae2512613de800f26b8de4" }, { "constant": true, "inputs": [], "name": "getPot", "outputs": [ { "name": "pot", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x403c9fa8" }, { "constant": false, "inputs": [ { "name": "challenges", "type": "bytes1" } ], "name": "betAndDistribute", "outputs": [ { "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function", "signature": "0xe16ea857" }, { "constant": false, "inputs": [ { "name": "challenges", "type": "bytes1" } ], "name": "bet", "outputs": [ { "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function", "signature": "0xf4b46f5b" }, { "constant": false, "inputs": [], "name": "distribute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xe4fc6b6d" }, { "constant": false, "inputs": [ { "name": "answer", "type": "bytes32" } ], "name": "setAnswerForTest", "outputs": [ { "name": "result", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x7009fa36" }, { "constant": true, "inputs": [ { "name": "challenges", "type": "bytes1" }, { "name": "answer", "type": "bytes32" } ], "name": "isMatch", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "pure", "type": "function", "signature": "0x99a167d7" }, { "constant": true, "inputs": [ { "name": "index", "type": "uint256" } ], "name": "getBetInfo", "outputs": [ { "name": "answerBlockNumber", "type": "uint256" }, { "name": "bettor", "type": "address" }, { "name": "challenges", "type": "bytes1" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x79141f80" }, { "constant": true, "inputs": [], "name": "getETH", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x14f6c3be" } ];


/* DAPP 설계
1) 지갑 관리
2) 아키텍쳐
  a. smart contract - front
  b. smart contraft - server - front
3) 코드
  a. 코드 실행하는데 돈이 든다
  b. 권한 관리
  c. 비즈니스 로직 업데이트
  d. 데이터 마이그레이션
4) 운영
  a. public
  b. private
*/

/* DAPP 데이터 관리
1) READ
 - smart contract를 직접 call/batch read call (시간이 event log 읽는 것에 비해 오래걸림)
 - event log를 읽는 방법 -- event parameter를 indexed 표시할 경우 해당 parameter에 대해 검색조건으로 활용할 수 있다!! (중요할듯?)
   * HTTP call (polling : 직접 요청 시 응답하는 것)
     
   * web socket 이용
     I)   init과 동시에 past event들을 가져온다
     II)  web socket으로 geth 또는 infura와 연결한다.
     III) web3.eth.subscribe("logs")를 이용해 어떤 이벤트가 발생했는지 지속적으로 확인한다. (특정 event를 subscribe하는 것)
      cf. web socket이 불가능한 경우 http를 통해 long polling(특정 주기로 계속적으로 요청하는 것)을 한다
     IV)  돈이 크게 걸려있는 서비스의 경우... block confirmation을 확인하다. (ETH의 경우 20 confimation 정도의 확인이 필요.)
*/


/* DAPP 서비스
1) 비즈니스 로직(Lottery)
2) 스마트 컨트랙트 제작
  a. 블록체인 상에 배포(ganache-cli)
3) DAPP front 제작
  a. react.js
4) 
*/
class App extends React.Component {  

  constructor(props){ // 클래스 변수 선언 방법
    super(props);

    this.state = {
      betRecords: [],
      winRecords: [],
      failRecords: [],
      pot: '0',
      challenges: ['A','B'],
      finalRecords: [{
        bettor:'0xabcd...',
        index:'0',
        challenges:'ab',
        answer:'ab',
        targetBlockNumber:'10',
        pot:'0'
      }]
    }
  }

  async componentDidMount() { // 제일 먼저 실행될 부분...
    await this.initWeb3();   
    // await this.pollData();
    setInterval(this.pollData, 1000);
  }

  pollData = async () => { // 주기적으로 데이터 가져오려고!!
    await this.getPot();
    await this.getBetEvent();
    await this.getWinEvent();
    await this.getFailEvent();
    this.makeFinalRecords();
    // await this.getBetEvent();
  }

  initWeb3 = async () => {
    if (window.ethereum) {
      console.log('recent mode');
      this.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        // this.web3.eth.sendTransaction({/* ... */});
      } catch (error) {
        // User denied account access...
        console.log(`User denied account access error : ${error}`);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log('legacy mode');
      this.web3 = new Web3(Web3.currentProvider);
      // Acccounts always exposed
      // this.web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    //smart contract initiate
    let accounts = await this.web3.eth.getAccounts();
    this.account = accounts[0];

    console.log(this.account);
    
    this.lotteryContract = new this.web3.eth.Contract(lotteryABI, lotteryAddress); // Contract 연결!!

    // let pot = await this.lotteryContract.methods.getPot().call();// Contract의 함수 호출
    // console.log(pot)
    // let owner = await this.lotteryContract.methods.owner().call();
    // console.log(owner);
    // ~~~~.methods.(함수).[call() / send()]  
    // call() : 컨트랙트 내 값 변경없이 읽기만!!
    // send() : 트랜잭션 object를 넣어서 값 변경 시 활용
    // filter() : 스마트 컨트랙트가 발생시키는 event를 잡아서 처리한다.. 즉 스마트 컨트랙트와 통신할 수 있는 하나의 방법 -- getPastEvents()가 filter의 일종!!
    //            web3.eth.Contract()의 event 관련 함수들을 사용하거나 web3.eth.Subscribe()의 websocket을 사용한다.

  }

  getPot = async () => {
    let pot = await this.lotteryContract.methods.getPot().call();
    // this.setState({pot:pot}) // 근데 이렇게만 하면 error가 난다... react CHILD가 아니라고..? (변수 호환이 안되기 때문) String을 받아야함?

    
    let potString = this.web3.utils.fromWei(pot.toString(), 'ether');
    this.setState({pot:potString}); // setting 하는 법을 잘 기억하자!! 

  }

  bet = async () => {
    let nonce = await this.web3.eth.getTransactionCount(this.account); // 이 계정의 nonce값 가져옴..
    // nonce : 특정 address가 몇 개의 txn을 만들었는지에 대한 값.
    // nonce : txn의 replay를 방지하고, 외부 user가 나의 계정을 마음대로 사용하지 못하도록 함..
    // metamask의 경우 자동으로 내부적에서 nonce 처리함!!
    let challenges = '0x' + this.state.challenges[0].toLowerCase() + this.state.challenges[1].toLowerCase();
    this.lotteryContract.methods.betAndDistribute(challenges).send({from:this.account, value:5000000000000000, gas:300000, nonce:nonce})
    .on('transactionHash', (hash) => {
      console.log(hash)
    }); // txn의 hash 값을 http로도 받아올 수 있음.
    // BET 버튼을 누르면 txn DATA에서 
    //0xe16ea857ab00000000000000000000000000000000000000000000000000000000000000 를 확인가능
    // 0x 앞 8자리(e16ea857)는 함수 identifier, ab는 bettor가 입력한 값 2개..


  }
  

  getBetEvent = async() => {
    let records = [];
    let events = await this.lotteryContract.getPastEvents('BET', {fromBlock:0, toBlock:'latest'}); // CATHC할 EVENT 명을 적는다. fromBlock부터 toBlock 사이의 event들을 가져옴.
    
    // raw는 bytecode로 되어있는 data ====해독하면===> returnValues. 즉, raw == returnValues.
    // log의 address는 contract의 address. id는 log마다의 unique한 id, blockhash는 어느 블럭에 들어갔는지 
    for(let i=0; i < events.length; i++) {
      let record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.bettor = events[i].returnValues.bettor.slice(0,4) + '...' + events[i].returnValues.bettor.slice(40,42);
      record.betBlockNumber = events[i].returnValues.blocknumber;
      record.targetBlockNumber = events[i].returnValues.answerBlockNumber.toString();
      record.challenges = events[i].returnValues.challenges;
      record.win = 'Not Revealed'; //default
      record.answer = "0x00"; //default
      records.unshift(record);
    }
    this.setState({betRecords:records});
  }

  getWinEvent = async() => {
    let records = [];
    let events = await this.lotteryContract.getPastEvents('WIN', {fromBlock:0, toBlock:'latest'}); // CATHC할 EVENT 명을 적는다. fromBlock부터 toBlock 사이의 event들을 가져옴.
    
    // raw는 bytecode로 되어있는 data ====해독하면===> returnValues. 즉, raw == returnValues.
    // log의 address는 contract의 address. id는 log마다의 unique한 id, blockhash는 어느 블럭에 들어갔는지 
    for(let i=0; i < events.length; i++) {
      let record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.amount = parseInt(events[i].returnValues.amount, 10).toString();
      records.unshift(record);
    }

    this.setState({winRecords:records});
  }

  getFailEvent = async() => {
    let records = [];
    let events = await this.lotteryContract.getPastEvents('FAIL', {fromBlock:0, toBlock:'latest'}); // CATHC할 EVENT 명을 적는다. fromBlock부터 toBlock 사이의 event들을 가져옴.
    
    // raw는 bytecode로 되어있는 data ====해독하면===> returnValues. 즉, raw == returnValues.
    // log의 address는 contract의 address. id는 log마다의 unique한 id, blockhash는 어느 블럭에 들어갔는지 
    for(let i=0; i < events.length; i++) {
      let record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.answer = events[i].returnValues.answer; //default
      records.unshift(record);
    }
    console.log(records);
    this.setState({failRecords:records});
  }


  makeFinalRecords = async () => { // O(n)
    let f = 0, w = 0; //f : fail index, w : win index
    const records = [...this.state.betRecords];
    for(let i = 0; i  <this.state.betRecords.length; i++) { // O(n)
      if(this.state.winRecords.length > 0 && this.state.betRecords[i].index === this.state.winRecords[w].index) {
        records[i].win = 'WIN';
        records[i].answer = records[i].challenges;
        records[i].pot = this.web3.utils.fromWei(this.state.winRecords[w].amount, 'ether');
        if(this.state.winRecords.length - 1 > w ) w++;
      } else if(this.state.failRecords.length > 0 && this.state.betRecords[i].index === this.state.failRecords[f].index) {
        records[i].win = 'FAIL';
        records[i].answer = this.state.failRecords[f].answer;
        records[i].pot = 0;
        if(this.state.failRecords.length - 1 > f ) f++;
      } else { // DRAW는 제외함...
        records[i].answer = 'Not Revealed';
      }
    }
    this.setState({finalRecords:records});
  }

  //bet 글자 선택 UI
  //bet button
  //history table : index, address, challenge, answer, pot, status, answerBlockNumber
  
  
  // 클래스의 state를 html에 입력하는 방법 잘 확인!!

  onClickCard = (_Character) => {
    this.setState({
      challenges: [this.state.challenges[1], _Character] 
      // challenges가 원래는 배열... 
      // 새로 클릭한 것이 1번자리로 가고 기존 1번자리에 있던 것은 0번자리로 간다.
    })
  }

  getCard = (_Character, _cardStyle) => {
    let _card = '';
    if(_Character === 'A') {
      _card = '🂡';
    }
    if(_Character === 'B') {
      _card = '🂱';
    }
    if(_Character === 'C') {
      _card = '🃁';
    }
    if(_Character === '0') {
      _card = '🃑';
    }

    return (
      <button className={_cardStyle} onClick = {() => {
        this.onClickCard(_Character)
      }}>
      <div className="card-body text-center">
        <p className="card-text"></p>
        <p className="card-text text-center" style ={{fontSize:300}}>{_card}</p>
        <p className="card-text"></p>
      </div>            
      </button>
    )
  }

  render() {
    return (
      <div className="App">

        {/* Header - Pot, Betting characters */}
        <div className="container">
          <div className="jumbotron">
            <h1>Current Pot : {this.state.pot}</h1>
            <p>Lottery</p>
            <p>Lottery tutorial</p>
            <p>Your Bet</p>
            <p>{this.state.challenges[0]} {this.state.challenges[1]}</p> 
          </div>
        </div>

        <br></br>

        {/* Card Section */}
        <div className="container">
          <div className="card-group">
            {this.getCard('A','card bg-primary')}
            {this.getCard('B','card bg-warning')}
            {this.getCard('C','card bg-danger')}
            {this.getCard('0','card bg-success')}
          </div>
        </div>
        
        <br></br>
        
        <div className="container">
          <button className="btn btn-danger btn-lg" onClick={this.bet}>BET!</button>
        </div>

        <br></br>

        {/* History Table */}
        <div className="container">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
              <th>Index</th><th>Address</th><th>Challenge</th><th>Answer</th><th>Pot</th><th>Status</th><th>answerBlockNumber</th>
              </tr>
            </thead>
            <tbody>
                {
                  this.state.finalRecords.map((record, index) => {
                    return(
                      <tr key={index}>
                          <td>{record.index}</td><td>{record.bettor}</td><td>{record.challenges}</td><td>{record.answer}</td><td>{record.pot}</td><td>{record.win}</td><td>{record.targetBlockNumber}</td>
                      </tr>
                    )
                  })
                }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;

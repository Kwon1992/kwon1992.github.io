import React from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3';

let lotteryAddress = '0x1AA57FDcd4ef43C680e48E6069e370Aa4F3AbbD4';
let lotteryABI = [{"constant": true,"inputs": [],"name": "answerForTest","outputs": [{"name": "","type": "bytes32"}],"payable": false,"stateMutability": "view","type": "function","signature": "0x84f7e4f0"},{"constant": true,"inputs": [],"name": "owner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function","signature": "0x8da5cb5b"},{"inputs": [],"payable": false,"stateMutability": "nonpayable","type": "constructor","signature": "constructor"},{"anonymous": false,"inputs": [{"indexed": false,"name": "index","type": "uint256"},{"indexed": false,"name": "bettor","type": "address"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "challenges","type": "bytes1"},{"indexed": false,"name": "answerBlockNumber","type": "uint256"}],"name": "BET","type": "event","signature": "0x100791de9f40bf2d56ffa6dc5597d2fd0b2703ea70bc7548cd74c04f5d215ab7"},{"anonymous": false,"inputs": [{"indexed": false,"name": "index","type": "uint256"},{"indexed": false,"name": "bettor","type": "address"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "challenges","type": "bytes1"},{"indexed": false,"name": "answer","type": "bytes1"},{"indexed": false,"name": "answerBlockNumber","type": "uint256"}],"name": "WIN","type": "event","signature": "0x8219079e2d6c1192fb0ff7f78e6faaf5528ad6687e69749205d87bd4b156912b"},{"anonymous": false,"inputs": [{"indexed": false,"name": "index","type": "uint256"},{"indexed": false,"name": "bettor","type": "address"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "challenges","type": "bytes1"},{"indexed": false,"name": "answer","type": "bytes1"},{"indexed": false,"name": "answerBlockNumber","type": "uint256"}],"name": "FAIL","type": "event","signature": "0x3b19d607433249d2ebc766ae82ca3848e9c064f1febb5147bc6e5b21d0adebc5"},{"anonymous": false,"inputs": [{"indexed": false,"name": "index","type": "uint256"},{"indexed": false,"name": "bettor","type": "address"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "challenges","type": "bytes1"},{"indexed": false,"name": "answer","type": "bytes1"},{"indexed": false,"name": "answerBlockNumber","type": "uint256"}],"name": "DRAW","type": "event","signature": "0x72ec2e949e4fad9380f9d5db3e2ed0e71cf22c51d8d66424508bdc761a3f4b0e"},{"anonymous": false,"inputs": [{"indexed": false,"name": "index","type": "uint256"},{"indexed": false,"name": "bettor","type": "address"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "challenges","type": "bytes1"},{"indexed": false,"name": "answerBlockNumber","type": "uint256"}],"name": "REFUND","type": "event","signature": "0x59c0185881271a0f53d43e6ab9310091408f9e0ff9ae2512613de800f26b8de4"},{"constant": true,"inputs": [],"name": "getPot","outputs": [{"name": "pot","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function","signature": "0x403c9fa8"},{"constant": false,"inputs": [{"name": "challenges","type": "bytes1"}],"name": "betAndDistribute","outputs": [{"name": "result","type": "bool"}],"payable": true,"stateMutability": "payable","type": "function","signature": "0xe16ea857"},{"constant": false,"inputs": [{"name": "challenges","type": "bytes1"}],"name": "bet","outputs": [{"name": "result","type": "bool"}],"payable": true,"stateMutability": "payable","type": "function","signature": "0xf4b46f5b"},{"constant": false,"inputs": [],"name": "distribute","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function","signature": "0xe4fc6b6d"},{"constant": false,"inputs": [{"name": "answer","type": "bytes32"}],"name": "setAnswerForTest","outputs": [{"name": "result","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function","signature": "0x7009fa36"},{"constant": true,"inputs": [{"name": "challenges","type": "bytes1"},{"name": "answer","type": "bytes32"}],"name": "isMatch","outputs": [{"name": "","type": "uint8"}],"payable": false,"stateMutability": "pure","type": "function","signature": "0x99a167d7"},{"constant": true,"inputs": [{"name": "index","type": "uint256"}],"name": "getBetInfo","outputs": [{"name": "answerBlockNumber","type": "uint256"},{"name": "bettor","type": "address"},{"name": "challenges","type": "bytes1"}],"payable": false,"stateMutability": "view","type": "function","signature": "0x79141f80"},{"constant": true,"inputs": [],"name": "getETH","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function","signature": "0x14f6c3be"}];

class App extends React.Component{ // class로 바꿔줌.. 기본 세팅은 functional로 생김!!

  constructor(props) {
    super(props);

    this.state = {
      betRecords: [],
      winRecords: [],
      failRecords: [],
      drawRecords: [],
      pot: '0',
      challenges: ['A', 'B'],
      finalRecords: [{
        bettor:'0xabcd....',
        index:'0',
        challenges:'ab',
        answer:'ab',
        targetBlockNumber:'10',
        pot:'0'
      }]
    }
  }

  async componentDidMount() {
    await this.initWeb3();
    await this.getBetEvents();
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

    let accounts = await this.web3.eth.getAccounts();
    this.account = accounts[0];
    this.lotteryContract = new this.web3.eth.Contract(lotteryABI, lotteryAddress);// 스마트 컨트랙트 객체 만들기.
    
    let pot = await this.lotteryContract.methods.getPot().call(); // web3에서 contract의 함수를 호출하는 방법... ~~.method.[함수].call()
    //call()은 무슨 뜻?? : 스마트 컨트랙트에서 실제로 상태를 변화시키지 않고 값만 읽어오는 것!!!
    console.log(pot);
    let owner = await this.lotteryContract.methods.owner().call();
    console.log(owner);


  } 

  //BET function!! : send와 call을 활용하는 방법
  bet = async () => { 

    //nonce : 특정 어드레스가 몇 개의 트랜잭션을 만들었는지에 대한 값.
    //nonce : 트랜잭션의 replay를 방지하고 외부 유저가 나의 주소를 마음대로 사용하지 못하게 한다.
    //transaction을 보내기 전에는 nonce를 같이 보내야한다!!
    let nonce = await this.web3.eth.getTransactionCount(this.account);
    this.lotteryContract.methods.betAndDistribute('0xcd').send({from:this.account, value:5000000000000000, gas:300000, nonce:nonce}); 
    // call이 아니라 send...
    // send 안에 transaction object를 넣는다.
  }


  //filter 활용하기.. (Smart contract에서 Event로 찍힌 log를 가져오고 활용하기)
  // event :: BLOCKCHAIN 외부에서 event를 catch하여 일을 한다.. -> filter 라는 web3의 기능을 활용
  // web3.eth.Contract 쪽의 event 혹은 web3.eth.Subscribe의 웹소켓 
  getBetEvents = async () => {
    const records = [];
    let events = await this.lotteryContract.getPastEvents('BET', {fromBlock:0, toBlock:'latest'}); // 0번 블락부터 최근 블락까지의 이벤트 가져오기
    console.log(events);
    /*
    raw : 데이터들이 들어감 -> bytecode 해독 (ABI 이용) -> returnValues (raw == returnValues)
    */
  }

  /* DAPP 에서의 데이터 관리
  1) READ.... 속도의 문제!! 
     - smart contract를 직접 call/batch read call(getPot 함수 등...) :: 속도가 event log에 비해 조금 느림
     - event log를 읽는 방법 (event의 parameter에 indexed를 활용하면 검색조건으로 활용할 수도 있음)
        1.HTTP call (polling: 내가 물어봤을 때 알려줌)  || 
        2. websocket 이용
          I)   init과 동시에 past event들을 가져온다.
          II)  websocket으로 geth 혹은 infura와 연결한다.
          III) web3.eth.subscribe에 logs라는 항목이 존재... -- websockect으로 원하는 이벤트를 subscribe한다.
             cf. websocket을 사용할 수 없다면 long polling을 이용한다 (N초에 한 번씩 물어봄... 특정 event 일어났니?)
          IX)  돈이 크게 걸려있는 서비스 -> block confirmation을 확인한다! (ETH는 최소 20 confirm 확인)
  */

  getCard = (_Character, _cardStyle) => {
    let _card = '';
    if(_Character === 'A') {
      _card = '🂡'
    }
    if(_Character === 'B') {
      _card = '🂱'
    }
    if(_Character === 'C') {
      _card = '🃁'
    }
    if(_Character === 'D') {
      _card = '🃑'
    }

    return (
      <button className={_cardStyle}>
        <div className = "card-body text-center">
          <p className="card-text"></p>
          <p className="card-text text-center" style={{fontSize:300}}>{_card}</p>
          <p className="card-text"></p>
        </div>
      </button>
    )
  }

  render() { 
    // jumbotron : bootstrap의 css 테마임 : 회색 사각형...
    // card-group : 부트스트랩의 테마 중 하나 
    // 필요 UI?
      // Pot money 확인
      // bet 버튼
      // betting 글자 ui (버튼)
      
      // histroy 테이블  ->  
      // 넣을 column? :: order index (내림차순... 최신것부터), address, challenge, answer(나왔을 시), pot, status(NOT BUILD/FAIL/WIN), answerBlockNumber
    return (
      <div className="App">

        {/* Header - Pot, betting characters*/}
        <div className="container">
          <div className="jumbotron">   
            <h1>Current Pot : {this.state.pot}</h1>
            <p>Lottery</p>  
            <p>Lottery Tutorial</p>
            <p>Your Bet</p>
            <p>{this.state.challenges[0]} {this.state.challenges[1]}</p>
          </div>
        </div>
        <div className="container">
          <div className="card-group">  
            {this.getCard('A', 'card bg-primary')}
            {this.getCard('B', 'card bg-warning')}
            {this.getCard('C', 'card bg-danger')}
            {this.getCard('D', 'card bg-success')}
          </div>
        </div>
        <br></br>
        <div className="'container">
          <button className="btn btn-danger btn-lg">BET!</button>
        </div>
        <br></br>
        <div className="container">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Index</th>
                <th>Address</th>
                <th>Challenges</th>
                <th>Answer</th>
                <th>Pot</th>
                <th>Status</th>
                <th>AnswerBlockNumber</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.finalRecords.map((record, index) => {
                  return (
                    <tr key={index}>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
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

// 스타트 버튼 누르면 자동으로 txn 승인한 것으로 처리하는 방법?
// 


//controllerAddr, controllerAbi
//butterTokenAddr, butterAbi
//bakingMasteryAddr, bakingMasteryAbi

//minified js.
//using https://javascript-minifier.com/
let controllerAddr="0x3b6571a63acc2d146bfa8fe90ee143a480ee11a4",controllerAbi=[{constant:!1,inputs:[{name:"amount",type:"uint256"}],name:"convertTokens",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"nonpayable",type:"function"},{inputs:[],payable:!1,stateMutability:"nonpayable",type:"constructor"},{constant:!0,inputs:[],name:"viewBakingMasteryTokenAddr",outputs:[{name:"",type:"address"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"viewButterTokenAddr",outputs:[{name:"",type:"address"}],payable:!1,stateMutability:"view",type:"function"}],butterTokenAddr="0xd81066E39d1caEcce3f47d888FC63d428076b76A",butterAbi=[{constant:!1,inputs:[{name:"spender",type:"address"},{name:"value",type:"uint256"}],name:"approve",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"getETH",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[],name:"sendETH",outputs:[{name:"result",type:"bool"}],payable:!0,stateMutability:"payable",type:"function"},{constant:!1,inputs:[{name:"from",type:"address"},{name:"to",type:"address"},{name:"value",type:"uint256"}],name:"transferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"viewcontroller",outputs:[{name:"",type:"address"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"getTokenPrice",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"initialTokens",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"value",type:"uint256"},{name:"to",type:"address"}],name:"convertLTKtoGTK",outputs:[{name:"result",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"totalTokens",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"tokenPrice",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"getInitialSupply",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[],name:"buyToken",outputs:[{name:"",type:"uint256"}],payable:!0,stateMutability:"payable",type:"function"},{constant:!1,inputs:[{name:"to",type:"address"},{name:"value",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"viewOwner",outputs:[{name:"",type:"address"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"getTotalSupply",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{name:"owner",type:"address"},{name:"spender",type:"address"}],name:"allowance",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"getBalanceOf",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{inputs:[{name:"_name",type:"string"},{name:"_symbol",type:"string"},{name:"minter",type:"address"}],payable:!1,stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"owner",type:"address"},{indexed:!0,name:"spender",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Approval",type:"event"}],bakingMasteryAddr="0xA36D5Bcdf1bb71210440EAFafef5cfD79d5778A6",bakingMasteryAbi=[{constant:!1,inputs:[{name:"spender",type:"address"},{name:"value",type:"uint256"}],name:"approve",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{name:"from",type:"address"},{name:"to",type:"address"},{name:"value",type:"uint256"}],name:"transferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"viewcontroller",outputs:[{name:"",type:"address"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"amount",type:"uint256"},{name:"user",type:"address"}],name:"convertLTKtoGTK",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"getInitialSupply",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[],name:"createAccount",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{name:"to",type:"address"},{name:"value",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"viewOwner",outputs:[{name:"",type:"address"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"getTotalSupply",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{name:"owner",type:"address"},{name:"spender",type:"address"}],name:"allowance",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"value",type:"uint256"}],name:"getLTK",outputs:[{name:"remains",type:"uint256"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"getBalanceOf",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{inputs:[{name:"_name",type:"string"},{name:"_symbol",type:"string"},{name:"minter",type:"address"}],payable:!0,stateMutability:"payable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"owner",type:"address"},{indexed:!0,name:"spender",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Approval",type:"event"}];

//Event Listeners
window.addEventListener('load', function() {

    //Assign Metamask to window.web3 var
    if (typeof web3 !== 'undefined') {
      window.web3 = new Web3(web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!')
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
    }
    // Now you can start your app & access web3 freely:
    // startApp()?

    loadContracts();
    loadUserInfo();
    console.log(sessionStorage);
});



//variables
var accountAddr;



function loadContracts() {
  tokenControllerContract = web3.eth.contract(controllerAbi); // Tokens Controller
  tokenController = tokenControllerContract.at(controllerAddr);

  butterContract = web3.eth.contract(butterAbi); // BT Token Contract
  butterToken = butterContract.at(butterTokenAddr);

  bakingMasteryContract = web3.eth.contract(bakingMasteryAbi); // BMT Token Contract
  bakingMastery = bakingMasteryContract.at(bakingMasteryAddr);
}



//Core Functions (핵심 함수)
function loadUserInfo(){
  web3.eth.getAccounts(function(e,r){ 
    document.getElementById('user-name').innerHTML =  getLink(r[0]);
    accountAddr = r[0];
  });
  getTokens();
}


function getTokens() {
  butterToken.getBalanceOf(function(e,r){
    document.getElementById('btTokens').innerHTML = r;
    sessionStorage.setItem('btTokensRemains', r);
  });
  
  bakingMastery.getBalanceOf(function(e,r){
    document.getElementById('bmtTokens').innerHTML = r;
    sessionStorage.setItem('bmtTokensRemains', r);
  });
}


export function sendTxnForBettingAndUsingItem(isWinner) {
  if(isWinner) {

  } else {

  }
}



// Secondary Functions (부차적 함수)
function getLink(addr) {
    return '<a target="_blank" href=https://rinkeby.etherscan.io/address/' + addr + '>' + addr +'</a>';
}


function thousandSeparatorCommas ( number ){ 
  var string = "" + number; 
  string = string.replace( /[^-+\.\d]/g, "" );
  var regExp = /^([-+]?\d+)(\d{3})(\.\d+)?/; 
  while ( regExp.test( string ) ) string = string.replace( regExp, "$1" + "," + "$2" + "$3" ); 
  return string; 
} 
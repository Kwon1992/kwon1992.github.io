const Lottery = artifacts.require("Lottery");
// test할 contract를 가져온다.

const assertRevert = require("./asserRevert");
const expectEvent = require("./expectEvent");

// truffle에서 test하기에는 보통 Mocha나 Chai가 있다.


// Mocha 형식 사용!
contract('Lottery', function([deployer, user1, user2]) {
    // deployer, user1, user2에는 Account 주소가 각각 들어간다.
    // ganache-cli를 켜놓은 경우에는 deployer에는 0번 주소 / user1에는 1번 주소 / user2에는 2번 주소가 들어감 
    // ganache-cli를 켜놓은 경우에는 최대 10개의 Account가 있으므로, parameter로 10개까지 가능....

    let lottery;
    let betAmount = 5 * 10 **15 ;
    let betAmountBN = new web3.utils.BN("5000000000000000");
    let bet_block_interval = 3;

    beforeEach(async () => {
        lottery = await Lottery.new();
    })

    it('getPot should return current pot', async () => {
        let pot = await lottery.getPot();
        assert.equal(pot, 0)
    })

    describe('Bet', function() {
        it('should Fail when the bet money is not 0.005 ETH', async () => {
            // Fail transaction
            await assertRevert(lottery.bet('0xab', {from: user1, value: 4000000000000000, })) //뒤에 붙는 {}는 transaction object이다.

            // transaction object?  {chainId, value, to, from, gas(Limit), gasPrice}
            // chainId : 네트워크 별로 할당된 identifier... Notability 참고!
        })
        
        it('should put the bet to the bet Queue with 1 bet', async () => { //only를 붙이면 only가 붙은 곳만 test함.
            // bet
            let receipt = await lottery.bet('0xab', {from: user1, value: 5000000000000000, }) //뒤에 붙는 {}는 transaction object이다.

            let pot = await lottery.getPot();
            assert.equal(pot, 0);

            // check contract balance  == 0.005 ETH?
            let contractBalance = await web3.eth.getBalance(lottery.address);
            assert.equal(contractBalance, betAmount);
            
            
            
            // check betInfo 
            let currentBlockNumber = await web3.eth.getBlockNumber();
            let bet = await lottery.getBetInfo(0);

            assert.equal(bet.answerBlockNumber, currentBlockNumber + bet_block_interval);
            assert.equal(bet.bettor, user1);
            assert.equal(bet.challenges, '0xab');

            // check log
            // console.log(receipt);
            await expectEvent.inLogs(receipt.logs, 'BET');
        })
    })

    describe('isMatch', function() {
        it('should be BettingResult.win when 2 characters match', async () => {
            let blockHash = '0xf4aa9cf8e3058aef5471277099b29d32c57d77e2dd3039c6211db47fc82e8aeb';
            let matchingResult = await lottery.isMatch('0xf4', blockHash);
            assert.equal(matchingResult, 1);
        })

        it('should be BettingResult.fail when 2 characters not match', async () => {
            let blockHash = '0xf4aa9cf8e3058aef5471277099b29d32c57d77e2dd3039c6211db47fc82e8aeb';
            let matchingResult = await lottery.isMatch('0xab', blockHash);
            assert.equal(matchingResult, 0);
        })

        it('should be BettingResult.draw when 1 character match', async () => {
            let blockHash = '0xf4aa9cf8e3058aef5471277099b29d32c57d77e2dd3039c6211db47fc82e8aeb';
            let matchingResult = await lottery.isMatch('0xfb', blockHash);
            assert.equal(matchingResult, 2);

            matchingResult = await lottery.isMatch('0xd4', blockHash);
            assert.equal(matchingResult, 2);
        })
    })

    describe('distribute', function () {
        describe('When the answer is checked', function() {
            it('should give the user the pot when the answer is matched', async () => {
                // 둘 다 맞았을 때
                await lottery.setAnswerForTest('0xabec17438e4f0afb9cc8b77ce84bb7fd501497cfa9a1695095247daa5b4b7bcc', {from:deployer})
                
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 1 -> 4
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 2 -> 5
                await lottery.betAndDistribute('0xab', {from:user1, value:betAmount}) // 3 -> 6
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 4 -> 7
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 5 -> 8
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 6 -> 9
                
                let potBefore = await lottery.getPot(); //  == 0.01 ETH
                let user1BalanceBefore = await web3.eth.getBalance(user1);
                
                let receipt7 = await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 7 -> 10 // user1에게 pot이 간다

                let potAfter = await lottery.getPot(); // == 0
                let user1BalanceAfter = await web3.eth.getBalance(user1); // == before + 0.015 ETH
                
                // pot 의 변화량 확인
                // web3.utils 에서 BN(Big Number) 라이브러리를 쓸 수 있다.  for Safety Issue
                // potBefore을 반환해보면 BIG NUMBER로 나온다는 사실을 잊지 말자!!
                // web3js.readthedocs.io에서 확인해보자
                console.log(potBefore);
                assert.equal(potBefore.toString(), new web3.utils.BN('10000000000000000').toString());
                assert.equal(potAfter.toString(), new web3.utils.BN('0').toString());

                // user의 balance 확인
                user1BalanceBefore = new web3.utils.BN(user1BalanceBefore);
                assert.equal(user1BalanceBefore.add(potBefore).add(betAmountBN).toString(), new web3.utils.BN(user1BalanceAfter).toString());
            })
            it('should give the user the amount he/she bet when a single character is matched', async () => {
                // 하나만 맞았을 때
                await lottery.setAnswerForTest('0xabec17438e4f0afb9cc8b77ce84bb7fd501497cfa9a1695095247daa5b4b7bcc', {from:deployer})
                    
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 1 -> 4
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 2 -> 5
                await lottery.betAndDistribute('0xef', {from:user1, value:betAmount}) // 3 -> 6
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 4 -> 7
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 5 -> 8
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 6 -> 9
                
                let potBefore = await lottery.getPot(); //  == 0.01 ETH
                let user1BalanceBefore = await web3.eth.getBalance(user1);
                
                let receipt7 = await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 7 -> 10 // user1에게 pot이 간다

                let potAfter = await lottery.getPot(); // == 0.01 ETH
                let user1BalanceAfter = await web3.eth.getBalance(user1); // == before + 0.015 ETH
                
                // pot 의 변화량 확인
                assert.equal(potBefore.toString(), potAfter.toString());

                // user의 balance 확인
                user1BalanceBefore = new web3.utils.BN(user1BalanceBefore);
                assert.equal(user1BalanceBefore.add(betAmountBN).toString(), new web3.utils.BN(user1BalanceAfter).toString());
            })
            it('should get the eth of user when the answer does not match at all', async () => {
                // 다 틀렸을 때
                await lottery.setAnswerForTest('0xabec17438e4f0afb9cc8b77ce84bb7fd501497cfa9a1695095247daa5b4b7bcc', {from:deployer})
                
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 1 -> 4
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 2 -> 5
                await lottery.betAndDistribute('0xef', {from:user1, value:betAmount}) // 3 -> 6
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 4 -> 7
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 5 -> 8
                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 6 -> 9
                
                let potBefore = await lottery.getPot(); //  == 0.01 ETH
                let user1BalanceBefore = await web3.eth.getBalance(user1);
                
                let receipt7 = await lottery.betAndDistribute('0xef', {from:user2, value:betAmount}) // 7 -> 10 // user1에게 pot이 간다

                let potAfter = await lottery.getPot(); // == 0.015 ETH
                let user1BalanceAfter = await web3.eth.getBalance(user1); // == before + 0.015 ETH
                
                console.log(user1BalanceBefore);
                console.log(user1BalanceAfter);
                // pot 의 변화량 확인
                assert.equal(potBefore.add(betAmountBN).toString(), potAfter.toString());

                // user의 balance 확인
                user1BalanceBefore = new web3.utils.BN(user1BalanceBefore);
                assert.equal(user1BalanceBefore.toString(), new web3.utils.BN(user1BalanceAfter).toString());

            })
            
        })
        describe('When the block is not mined', function() {
            it.only('Not mined', async ()=> {
                await lottery.setAnswerForTest('0xabec17438e4f0afb9cc8b77ce84bb7fd501497cfa9a1695095247daa5b4b7bcc', {from:deployer})

                await lottery.bet('0xef', {from:user2, value:betAmount});

                let potBefore = await lottery.getPot(); //  == 0.01 ETH
                let user2BalanceBefore = await web3.eth.getBalance(user2);
                let contractBalanceBefore = await lottery.getETH({from:deployer});

                await lottery.distribute({from:deployer});

                let potAfter = await lottery.getPot(); // == 0.01 ETH
                let user2BalanceAfter = await web3.eth.getBalance(user2); // == before + 0.015 ETH
                let contractBalanceAfter = await lottery.getETH({from:deployer});
                

                // 스마트컨트랙트의 balance 확인
                assert.equal(contractBalanceBefore.toString(), contractBalanceAfter.toString());

                // pot 의 변화량 확인
                assert.equal(potBefore.toString(), potAfter.toString());

                // user의 balance 확인
                user2BalanceBefore = new web3.utils.BN(user2BalanceBefore);
                assert.equal(user2BalanceBefore.toString(), new web3.utils.BN(user2BalanceAfter).toString());
            })
            //betting 전후 : smart contract balance, pot money balance, user balance...
        })
        describe('When the block is too old-dated(Block limit passed)', function() {
            //Block을 계속 증가시긴다....
            it('test', async () => {
                let loopCount = 260;
                let cur;

                await lottery.betAndDistribute('0xef', {from:user2, value:betAmount});

                for(cur = 0; cur < loopCount ; cur++) {
                    await lottery.setAnswerForTest('0xabec17438e4f0afb9cc8b77ce84bb7fd501497cfa9a1695095247daa5b4b7bcc', {from:deployer}); // 1 -> 4            })
                }

                let potBefore = await lottery.getPot(); //  == 0.005 ETH
                let user2BalanceBefore = await web3.eth.getBalance(user2);

                let receipt = await lottery.distribute({from:deployer}); 


                let potAfter = await lottery.getPot(); // == 0 ETH
                let user2BalanceAfter = await web3.eth.getBalance(user2); // == before + 0.005 ETH
                

                // pot 의 변화량 확인
                assert.equal(potBefore.toString(), potAfter.toString()); // fail해야 pot에 쌓이는데 안 쌓이므로.. before도 0, after도 0


                // user의 balance 확인
                user2BalanceBefore = new web3.utils.BN(user2BalanceBefore);
                assert.equal(user2BalanceBefore.add(betAmountBN).toString(), new web3.utils.BN(user2BalanceAfter).toString());
            })
        })
    })
});

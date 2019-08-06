// const Migrations = artifacts.require("Migrations");
// artifacts.require : build 폴더 내 Migrations라는 데이터(bytecode)를 가져옴.

const Lottery = artifacts.require("Lottery");

module.exports = function(deployer) {
  deployer.deploy(Lottery);
  // bytecode를 deployer가 배포함.
  // deployer?? -> truffle-config.js에서 설정할 수 있다. (어디로 배포할지)
  // 
};

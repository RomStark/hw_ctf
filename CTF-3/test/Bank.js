const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Bank", function () {
    let bank;
    let bankAttacker;
    let attacker;
    let deployer;

    before(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const Bank = await ethers.getContractFactory("Bank", deployer);
        bank = await Bank.deploy({ value: ethers.utils.parseEther("1") });
        await bank.deployed();

        console.log("Адрес контракта:", Bank.target);
        console.log("Адрес контракта:", await Bank.getAddress());

        const contractBalance = await ethers.provider.getBalance(Bank.target);
        console.log(
          "Баланс контракта:",
          ethers.formatEther(contractBalance),
          "ETH"
        );


        const BankAttacker = await ethers.getContractFactory("BankAttacker", attacker);
        bankAttacker = await BankAttacker.deploy(bank.address);
        await bankAttacker.deployed();
    });

    it("hack", async function () {
        const attackTx = await bankAttacker.connect(attacker).attack({ value: ethers.utils.parseEther("0.1") });
        await attackTx.wait();

        const finalBalance = await ethers.provider.getBalance(bank.address);
        expect(finalBalance).to.equal(0);

        expect(await bank.completed()).to.be.true;
    });
});
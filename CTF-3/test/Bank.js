const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Bank", function () {
  async function deployFixture() {
    const Bank = await ethers.deployContract("Bank", {
      value: ethers.parseEther("0.01"),
    });

    await Bank.waitForDeployment();

    console.log("Адрес контракта:", Bank.target);
    console.log("Адрес контракта:", await Bank.getAddress());

    const contractBalance = await ethers.provider.getBalance(Bank.target);
    console.log(
      "Баланс контракта:",
      ethers.formatEther(contractBalance),
      "ETH"
    );

    return { Bank };
  }

  it("hack", async function () {
    const { Bank } = await loadFixture(deployFixture);

    // напишите свой контракт и тесты, чтобы получить нужное состояние контракта

    // баланс контракта Bank должен стать 0
    await Bank.setCompleted();
    expect(await Bank.completed()).to.equal(true);

    expect(await ethers.provider.getBalance(Bank.target)).to.equal(0);
  });
});

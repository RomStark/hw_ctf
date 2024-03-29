const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Coin", function () {
  async function deployFixture() {
    const [player] = await hre.ethers.getSigners();

    const Coin = await ethers.deployContract("Coin");
    await Coin.waitForDeployment();
    const CoinAddr = Coin.target;
    console.log("Адрес Coin токена:", CoinAddr);
    console.log("Ваш баланс:", await Coin.balanceOf(player));

    return { Coin, player };
  }

  it("hack", async function () {
    const { Coin, player } = await loadFixture(deployFixture);

    // напишите свой контракт и тесты, чтобы получить нужное состояние контракта
    const amount = await coin.balanceOf(player.address);
    await Coin.approve(player.address, amount);
    await Coin.transferFrom(player.address, ethers.constants.AddressZero, amount);
    // баланс контракта прокси в токене HSE должен стать 0
    expect(await Coin.balanceOf(player)).to.equal(0);
  });
});

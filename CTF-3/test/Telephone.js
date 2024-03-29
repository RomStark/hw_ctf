const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Telephone", function () {
  async function deployFixture() {
    const [player, owner] = await hre.ethers.getSigners();

    const Telephone = await ethers.deployContract("Telephone", [owner]);
    await Telephone.waitForDeployment();
    const TelephoneAddr = Telephone.target;
    console.log("Адрес контракта:", TelephoneAddr);

    return { Telephone, player };
  }

  it("hack", async function () {
    const { Telephone, player } = await loadFixture(deployFixture);

    // напишите свой контракт и тесты, чтобы получить нужное состояние контракта

    // теперь владелец контракта player, а не owner
    expect(await Telephone.owner()).to.equal(player);
  });
});

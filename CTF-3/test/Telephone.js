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
    const { Telephone, deployer } = await loadFixture(deployFixture);

    const Attacker = await ethers.getContractFactory("TelephoneAttack");
    const attacker = await Attacker.deploy(Telephone.address);
    await attacker.deployed();

    const [_, player] = await ethers.getSigners();
    await attacker.connect(player).attack(player.address);

    expect(await Telephone.owner()).to.equal(player);
  });
});
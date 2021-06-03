const { expect } = require("chai");

describe("AR Token", function() {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    const ar = await ethers.getContractFactory("AR");
    [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    token = await ar.deploy(owner.address);
  });

  it("Should return meta", async function() {
    expect(await token.owner()).equal(owner.address);
    expect(await token.totalSupply()).equal(0);
    expect(await token.name()).equal("Arweave");
    expect(await token.symbol()).equal("AR");
    expect(await token.decimals()).equal(12);
  });

  it("Should mint", async function() {
    await token.connect(owner).mint(addr1.address, 10)
    expect(await token.totalSupply()).equal(10);
    expect(await token.balanceOf(addr1.address)).equal(10);

    await expect(token.connect(addr1).mint(addr1.address, 99999999999999)).to.be.revertedWith("Ownable: caller is not the owner")
  });

  it("Should transfer", async function() {
    await token.connect(owner).mint(addr1.address, 10)
    await token.connect(addr1).transfer(addr2.address, 3)

    expect(await token.balanceOf(addr1.address)).equal(7);
    expect(await token.balanceOf(addr2.address)).equal(3);

    await expect(token.connect(addr1).transfer(addr2.address, 10)).to.be.revertedWith("ERC20: transfer amount exceeds balance")
  }); 

  it("Should burned", async function() {
    await token.connect(owner).mint(addr1.address, 10)
    await token.connect(addr1).transfer(owner.address, 3)

    expect(await token.balanceOf(addr1.address)).equal(7);
    expect(await token.balanceOf(owner.address)).equal(0);
    expect(await token.totalSupply()).equal(7);
  }); 

});

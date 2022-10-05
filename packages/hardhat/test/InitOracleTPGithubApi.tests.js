const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("BG Contracts Deployment & Init", function () {

    let oracleTPGithubApi;
    let owner, addr0, addr1, addr2;

    beforeEach(async function () {
        [owner, addr0, addr1, addr2] = await ethers.getSigners();
		// const OracleTPGithubApi = await ethers.getContractFactory("OracleTPGithubApi");
		// oracleTPGithubApi = await OracleTPGithubApi.deploy();
		// await oracleTPGithubApi.deployed();
	});

    // quick fix to let gas reporter fetch data from gas station & coinmarketcap
    before((done) => {
        setTimeout(done, 2000);
    });

    describe("Init OracleTPGithubApi", function () {
        it("Should deploy OracleTPGithubApi", async function () {
            const OracleTPGithubApi = await ethers.getContractFactory("OracleTPGithubApi");
            oracleTPGithubApi = await OracleTPGithubApi.deploy();
        });

        it("constructor()", async function() {
            expect(await oracleTPGithubApi.name()).to.equal("BGTellorPlaygroundGithubApi");
            expect(await oracleTPGithubApi.symbol()).to.equal("TRBP");
            expect(await oracleTPGithubApi.decimals()).to.equal(18);
            expect(await oracleTPGithubApi.addresses(h.hash("_BG_TELLORPG_GITHUBAPI_CONTRACT"))).to.equal(oracleTPGithubApi.address)
        });
        
        it("Should get some faucets", async function () {
            await oracleTPGithubApi.faucet(owner.address);
        });
    });

    // describe("Supply query & Submit Value", function () {
    //     it("Should submit query", async function () {
            
    //     });

    //     it("Should submit response", async function () {

    //     });
    // });

    describe("Playground contract Tests", function (){
        it("addStakingRewards()", async function() {
            expect(await oracleTPGithubApi.balanceOf(oracleTPGithubApi.address)).to.equal(0)
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(0)
            await oracleTPGithubApi.faucet(owner.address)
            expect(await oracleTPGithubApi.balanceOf(oracleTPGithubApi.address)).to.equal(0)
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT)
            await h.expectThrow(oracleTPGithubApi.addStakingRewards(web3.utils.toWei("300")))
            await oracleTPGithubApi.approve(oracleTPGithubApi.address, FAUCET_AMOUNT)
            await oracleTPGithubApi.addStakingRewards(web3.utils.toWei("300"))
            expect(await oracleTPGithubApi.balanceOf(oracleTPGithubApi.address)).to.equal(web3.utils.toWei("300"))
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(web3.utils.toWei("700"))
            await oracleTPGithubApi.addStakingRewards(web3.utils.toWei("700"))
            expect(await oracleTPGithubApi.balanceOf(oracleTPGithubApi.address)).to.equal(FAUCET_AMOUNT)
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(0)
        })
    
        it("approve()", async function() {
            let approvalAmount = BigInt(500) * precision;
            await oracleTPGithubApi.faucet(owner.address);
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
            expect(await oracleTPGithubApi.allowance(owner.address, addr1.address)).to.equal(0);
            await expect(oracleTPGithubApi.connect(addr1).transferFrom(owner.address, addr2.addr2, approvalAmount)).to.be.reverted;
            await oracleTPGithubApi.approve(addr1.address, approvalAmount);
            expect(await oracleTPGithubApi.allowance(owner.address, addr1.address)).to.equal(approvalAmount);
            await oracleTPGithubApi.connect(addr1).transferFrom(owner.address, addr2.address, approvalAmount);
            expect(await oracleTPGithubApi.balanceOf(addr2.address)).to.equal(approvalAmount);
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT - approvalAmount);
            expect(await oracleTPGithubApi.allowance(owner.address, addr1.address)).to.equal(0);
            await expect(oracleTPGithubApi.approve(ZERO_ADDRESS, approvalAmount)).to.be.reverted;
        });
    
        it("beginDispute()", async function() {
            await oracleTPGithubApi.faucet(addr1.address);
            await oracleTPGithubApi.connect(addr1).submitValue(h.uintTob32(1),150,0,'0x')
            blocky = await h.getBlock()
            await oracleTPGithubApi.beginDispute(h.uintTob32(1), blocky.timestamp)
            expect(await oracleTPGithubApi.isDisputed(h.uintTob32(1), blocky.timestamp))
        })
    
        it("faucet()", async function() {
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(0);
            await oracleTPGithubApi.faucet(owner.address);
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
            expect(await oracleTPGithubApi.totalSupply()).to.equal(FAUCET_AMOUNT);
            await expect(oracleTPGithubApi.faucet(ZERO_ADDRESS)).to.be.reverted;
        });
    
        it("balanceOf()", async function() {
            await oracleTPGithubApi.faucet(addr1.address);
            expect(await oracleTPGithubApi.balanceOf(addr1.address)).to.equal(FAUCET_AMOUNT)
            await oracleTPGithubApi.connect(addr1).transfer(addr2.address, BigInt(100)*precision)
            expect(await oracleTPGithubApi.balanceOf(addr1.address)).to.equal(FAUCET_AMOUNT - BigInt(100)*precision)
            expect(await oracleTPGithubApi.balanceOf(addr2.address)).to.equal(BigInt(100)*precision)
        })
    
        it("name()", async function() {
            expect(await oracleTPGithubApi.name()).to.equal("TellorPlayground");
        });
    
        it("symbol()", async function() {
            expect(await oracleTPGithubApi.symbol()).to.equal("TRBP");
        });
    
        it("decimals()", async function() {
            expect(await oracleTPGithubApi.decimals()).to.equal(18);
        });
    
        it("totalSupply()", async function() {
            expect(await oracleTPGithubApi.totalSupply()).to.equal(0);
            await oracleTPGithubApi.faucet(owner.address);
            expect(await oracleTPGithubApi.totalSupply()).to.equal(BigInt(1000) * precision);
        });
    
        it("transfer()", async function() {
            await oracleTPGithubApi.faucet(owner.address);
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
            expect(await oracleTPGithubApi.balanceOf(addr1.address)).to.equal(0);
            await oracleTPGithubApi.transfer(addr1.address, BigInt(250) * precision);
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(BigInt(750) * precision);
            expect(await oracleTPGithubApi.balanceOf(addr1.address)).to.equal(BigInt(250) * precision);
            await expect(oracleTPGithubApi.transfer(addr1.address, BigInt(1000) * precision)).to.be.reverted;
            await expect(oracleTPGithubApi.transfer(ZERO_ADDRESS, 1)).to.be.reverted;
        });
    
      it("submitValue()", async function() {
            await h.expectThrow(oracleTPGithubApi.submitValue(h.uintTob32(500),150,0,'0xabcd')) // queryId must equal hash(queryData)
            await h.expectThrow(oracleTPGithubApi.submitValue(h.uintTob32(1),150,1,'0x')) // nonce must be correct
        await oracleTPGithubApi.submitValue(h.uintTob32(1),150,0,'0x');
        timestamp = await oracleTPGithubApi.getTimestampbyQueryIdandIndex(h.uintTob32(1), 0);
            expect(await oracleTPGithubApi["retrieveData(bytes32,uint256)"](h.uintTob32(1), timestamp) - 150).to.equal(0);
            await oracleTPGithubApi.submitValue(h.hash("abracadabra"), h.bytes("houdini"), 0, h.bytes("abracadabra"))
            timestamp = await oracleTPGithubApi.getTimestampbyQueryIdandIndex(h.hash("abracadabra"), 0);
            expect(await oracleTPGithubApi["retrieveData(bytes32,uint256)"](h.hash("abracadabra"), timestamp)).to.equal(h.bytes("houdini"))
      });
    
        it("retrieveData(bytes32,uint256)", async function() {
        await oracleTPGithubApi.submitValue(h.uintTob32(1),150,0,'0x')
            blocky = await h.getBlock()
            expect(await oracleTPGithubApi["retrieveData(bytes32,uint256)"](h.uintTob32(1), blocky.timestamp) - 150).to.equal(0)
            await oracleTPGithubApi.submitValue(h.hash("abracadabra"), h.bytes("houdini"), 0, h.bytes("abracadabra"))
            blocky = await h.getBlock()
            expect(await oracleTPGithubApi["retrieveData(bytes32,uint256)"](h.hash("abracadabra"), blocky.timestamp)).to.equal(h.bytes("houdini"))
        })
    
        it("getNewValueCountbyQueryId()", async function() {
            expect(await oracleTPGithubApi.getNewValueCountbyQueryId(h.uintTob32(1))).to.equal(0)
            expect(await oracleTPGithubApi.getNewValueCountbyQueryId(h.uintTob32(2))).to.equal(0)
            await oracleTPGithubApi.submitValue(h.uintTob32(1),150,0,'0x')
            await oracleTPGithubApi.submitValue(h.uintTob32(1),160,1,'0x')
            await oracleTPGithubApi.submitValue(h.uintTob32(2),250,0,'0x')
            expect(await oracleTPGithubApi.getNewValueCountbyQueryId(h.uintTob32(1))).to.equal(h.bytes(2))
            expect(await oracleTPGithubApi.getNewValueCountbyQueryId(h.uintTob32(2))).to.equal(h.bytes(1))
        })
    
        it("getTimestampbyQueryIdandIndex()", async function() {
            await oracleTPGithubApi.submitValue(h.uintTob32(1),150,0,'0x')
            blocky = await h.getBlock()
            expect(await oracleTPGithubApi.getTimestampbyQueryIdandIndex(h.uintTob32(1),0)).to.equal(blocky.timestamp)
            await oracleTPGithubApi.submitValue(h.uintTob32(1),160,1,'0x')
            blocky = await h.getBlock()
            expect(await oracleTPGithubApi.getTimestampbyQueryIdandIndex(h.uintTob32(1),1)).to.equal(blocky.timestamp)
            await oracleTPGithubApi.submitValue(h.hash("abracadabra"), h.bytes("houdini"), 0, h.bytes("abracadabra"))
            blocky = await h.getBlock()
            expect(await oracleTPGithubApi.getTimestampbyQueryIdandIndex(h.hash("abracadabra"),0)).to.equal(blocky.timestamp)
        })
    
        it("getVoteRounds()", async function() {
            await oracleTPGithubApi.connect(addr1).submitValue(h.uintTob32(1),150,0,'0x')
        blocky1 = await h.getBlock()
        await oracleTPGithubApi.connect(addr1).submitValue(h.uintTob32(1),160,1,'0x')
        blocky2 = await h.getBlock()
            let hash = ethers.utils.solidityKeccak256(['bytes32','uint256'], [h.uintTob32(1),blocky1.timestamp])
            voteRounds = await oracleTPGithubApi.getVoteRounds(hash)
            expect(voteRounds.length).to.equal(0)
            await oracleTPGithubApi.beginDispute(h.uintTob32(1), blocky1.timestamp)
            voteRounds = await oracleTPGithubApi.getVoteRounds(hash)
            expect(voteRounds.length).to.equal(1)
            expect(voteRounds[0]).to.equal(1)
            await oracleTPGithubApi.beginDispute(h.uintTob32(1), blocky1.timestamp)
            voteRounds = await oracleTPGithubApi.getVoteRounds(hash)
            expect(voteRounds.length).to.equal(2)
            expect(voteRounds[0]).to.equal(1)
            expect(voteRounds[1]).to.equal(2)
        })
    
        it("tipQuery()", async function() {
            expect(await oracleTPGithubApi.balanceOf(oracleTPGithubApi.address)).to.equal(0);
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(0);
            await oracleTPGithubApi.faucet(owner.address);
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(BigInt(1000) * precision);
            await (oracleTPGithubApi.tipQuery(h.uintTob32(1), BigInt(10) * precision, '0x'));
            expect(await oracleTPGithubApi.balanceOf(oracleTPGithubApi.address)).to.equal(BigInt(5) * precision);
            expect(await oracleTPGithubApi.balanceOf(owner.address)).to.equal(BigInt(990) * precision);
        });
    });
 
});
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("BG Contracts Deployment & Init", function () {

    const AUT_COMMUNITY_BG_ADDR = "0x09e930B4FEB47cA86236c8961B8B1e23e514ec3F"; // DAO: Bounty Granter
    
    // Bounty Granter DAO on Görli
    const AUT_COMMITTEE_BG_ADMIN_ADDR = "0xe3B377c705659a1380c361b56d1F96354a906043"; // Sub-DAO: BG Admin

    // Web3 Hack on Görli
    const AUT_COMMITTEE_ORG1_DEV1_ADDR = "0xc61Ec858c3bf3068e80fBd5654BaE47f4181dE8C"; // Sub-DAO: Web3 Hack
    const AUT_COMMITTEE_ORG1_ADMIN_ADDR = "0xc61Ec858c3bf3068e80fBd5654BaE47f4181dE8C"; // Sub-DAO: Web3 Hack

    // SeaShepherd on Görli
    const AUT_COMMITTEE_SEASHEPHERD_DEV1_ADDR = "0xB866Ee8a2396ab82cD0489be87D9692F057c9c29"; // Sub-DAO: Web3 Hack
    const AUT_COMMITTEE_SEASHEPHERD_ADMIN_ADDR = "0xB866Ee8a2396ab82cD0489be87D9692F057c9c29"; // Sub-DAO: Web3 Hack

    const DEFAULT_COMMUNITY = AUT_COMMUNITY_BG_ADDR;
    const DEFAULT_COMMITTEE = AUT_COMMITTEE_ORG1_DEV1_ADDR;
    const DEFAULT_ADMIN = AUT_COMMITTEE_BG_ADMIN_ADDR;

    let oracleTPGithubApi;

    // quick fix to let gas reporter fetch data from gas station & coinmarketcap
    before((done) => {
        setTimeout(done, 2000);
    });

    describe("Init OracleTPGithubApi", function () {
        it("Should deploy OracleTPGithubApi", async function () {
            const OracleTPGithubApi = await ethers.getContractFactory("OracleTPGithubApi");
            oracleTPGithubApi = await OracleTPGithubApi.deploy(DEFAULT_COMMUNITY, 
                DEFAULT_COMMITTEE, DEFAULT_ADMIN);
        });

        it("Registry should be empty", async function () {
            expect(await oracleTPGithubApi.numberOfProjectGrants()).to.equal(0);
        });

        it("Should have matching memberships info", async function () {
            let memberships = await oracleTPGithubApi.memberships();
            //console.log(memberships);
            expect(memberships).to.length(3);
        });
    });
});
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("BountyGranter", function () {

    const AUT_COMMUNITY_BG_ADDR = ""; // DAO: Bounty Granter
    const AUT_COMMITTEE_BG_ADMIN_ADDR = ""; // Sub-DAO: BG Admin

    const AUT_COMMUNITY_ORG1_ADDR = ""; // Sub-DAO: Web3 Hack
    const AUT_COMMITTEE_ORG1_DEV1_ADDR = ""; // Sub-DAO: Web3 Hack

    let projectGrantFactory;
    let projectGrantRegistry;
    let projectGrantCollectionV1;

    // quick fix to let gas reporter fetch data from gas station & coinmarketcap
    before((done) => {
        setTimeout(done, 2000);
    });

    describe("Init ProjectGrantRegistry", function () {
        it("Should deploy ProjectGrantRegistry", async function () {
            const ProjectGrantRegistry = await ethers.getContractFactory("ProjectGrantRegistry");
            projectGrantFactory = await ProjectGrantRegistry.deploy(AUT_COMMUNITY_BG_ADDR, AUT_COMMITTEE_BG_ADMIN_ADDR);
        });

        describe("numberOfProjectGrants()", function () {
            it("Registry should be empty", async function () {
                expect(await projectGrantFactory.numberOfProjectGrants()).to.equal(0);
            });
        })
    });

    describe("Init ProjectGrantFactory", function () {
        it("Should deploy ProjectGrantFactory", async function () {
            const ProjectGrantFactory = await ethers.getContractFactory("ProjectGrantFactory");
            projectGrantFactory = await ProjectGrantFactory.deploy(projectGrantRegistry.address, AUT_COMMUNITY_BG_ADDR, AUT_COMMITTEE_BG_ADMIN_ADDR);
        });

        describe("getProjectGrantCollections()", function () {
            it("Should have no project grant collections available", async function () {
                expect((await projectGrantFactory.getProjectGrantCollections()).length).to.equal(0);
            });
        });
    });
    
    describe("Init ProjectGrantCollectionV1", function () {
        it("Should deploy ProjectGrantCollectionV1", async function () {
            const ProjectGrantCollectionV1 = await ethers.getContractFactory("ProjectGrantCollectionV1");
            projectGrantCollectionV1 = await ProjectGrantCollectionV1.deploy("Project Grants Collection V1 - Test", "BGPG", "0.1.0");
        });

        describe("Collection fields are set", function () {
            it("Should have a name", async function () {
                expect(await projectGrantCollectionV1.name()).to.equal("Project Grants Collection V1 - Test");
            });
            it("Should have a symbol", async function () {
                expect(await projectGrantCollectionV1.symbol()).to.equal("BGPG");
            });        
            it("Should have a version", async function () {
                expect(await projectGrantCollectionV1.version()).to.equal("0.1.0");
            });
            it("Should have no supply", async function () {
                expect(await projectGrantCollectionV1.totalSupply()).to.equal(0);
            });    
        });

        describe("Collection token can be minted", function () {
            it("Should have a name", async function () {
                expect(await projectGrantCollectionV1.mintItem()).to.equal("Project Grants Collection V1 - Test");
            });
            it("Should have a symbol", async function () {
                expect(await projectGrantCollectionV1.symbol()).to.equal("BGPG");
            });        
            it("Should have a version", async function () {
                expect(await projectGrantCollectionV1.version()).to.equal("0.1.0");
            });
            it("Should have no supply", async function () {
                expect(await projectGrantCollectionV1.totalSupply()).to.equal(0);
            });    
        });
    });

    describe("Register the CollectionV1 in PGFactory", function () {
        it("Should be mintable via Factory", async function () {
            expect(await projectGrantFactory.registerProjectGrantCollection(projectGrantCollectionV1)).to.NaN;
        });

        describe("getProjectGrantCollections()", function () {
            it("Should have 1 project grant collection available", async function () {
                expect((await projectGrantFactory.getProjectGrantCollections()).length).to.equal(1);
            });

            it("Should have the project grant collection V1 available", async function () {
                expect((await projectGrantFactory.getProjectGrantCollectionByIndex(0))).to.equal(projectGrantCollectionV1.address);
            });
        });
    });

    describe("Prevent 2nd registration of the same collection", function () {
        it("Should not allow registering again the project grant collection", async function () {
            expect(await projectGrantFactory.registerProjectGrantCollection(projectGrantCollectionV1)).to.revertedWith("ProjectGrantFactory: Project Grants Collection already registered");
        });
        describe("Ensure collections list is kept unchanged", function() {
            it("Should have 1 project grant collection available", async function () {
                expect((await projectGrantFactory.getProjectGrantCollections()).length).to.equal(1);
            });

            it("Should have the project grant collection V1 available", async function () {
                expect((await projectGrantFactory.getProjectGrantCollectionByIndex(0))).to.equal(projectGrantCollectionV1.address);
            });
        });
    });

    describe("Create a Project Grant from PGCollectionV1 via Factory", function () {
        it("Should be mintable via Factory", async function () {
            expect(await projectGrantFactory.createProjectGrant(0, "Project Grant Test0", AUT_COMMITTEE_ORG1-DEV1_ADDR)).to.equal(0);
        });

        describe("Collection checks", function () {
            it("Should have 1 token", async function () {
                expect(await projectGrantCollectionV1.totalSupply()).to.equal(1);
            });

            describe("Should be a token created in the collection", function() {
                it("")
            });
        });
        
        // it("Should emit a CreateProjectGrant event ", async function () {
        //     const [owner] = await ethers.getSigners();

        //     expect(await projectGrantFactory.createProjectGrant(0, "Project Grant Test1", AUT_COMMITTEE_ADDR))
        //         .to.emit(projectGrantFactory, "CreateProjectGrant")
        //         .withArgs(owner.address, 1, );
        // });

    });

});
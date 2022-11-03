const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("BG Contracts Deployment & Init", function () {

    const AUT_COMMUNITY_BG_ADDR = "0x09e930B4FEB47cA86236c8961B8B1e23e514ec3F"; // DAO: Bounty Granter
    
    // Bounty Granter on Görli
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
            projectGrantRegistry = await ProjectGrantRegistry.deploy(DEFAULT_COMMUNITY, 
                DEFAULT_COMMITTEE, DEFAULT_ADMIN);
        });

        it("Registry should be empty", async function () {
            expect(await projectGrantRegistry.numberOfProjectGrants()).to.equal(0);
        });

        it("Should have matching memberships info", async function () {
            let memberships = await projectGrantRegistry.memberships();
            //console.log(memberships);
            expect(memberships).to.length(3);
        });
    });

    describe("Init ProjectGrantFactory", function () {
        it("Should deploy ProjectGrantFactory", async function () {
            const ProjectGrantFactory = await ethers.getContractFactory("ProjectGrantFactory");
            projectGrantFactory = await ProjectGrantFactory.deploy(projectGrantRegistry.address, 
                DEFAULT_COMMUNITY, DEFAULT_COMMITTEE, DEFAULT_ADMIN
            );
            await projectGrantFactory.deployed();
        });

        it("Should have no project grant collections available", async function () {
            expect((await projectGrantFactory.getProjectGrantCollections()).length).to.equal(0);
        });
    });
    
    describe("Init ProjectGrantCollectionV1", function () {
        it("Should deploy ProjectGrantCollectionV1", async function () {
            const ProjectGrantCollectionV1 = await ethers.getContractFactory("ProjectGrantCollectionV1");
            projectGrantCollectionV1 = await ProjectGrantCollectionV1.deploy(
                "Project Grants Collection V1 - Test", "BGPG", "0.1.0",
                DEFAULT_COMMUNITY, DEFAULT_COMMITTEE, DEFAULT_ADMIN
            );
        });

        describe("Check collection fields", function () {
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

        // describe("Collection token are mintable", function () {
        //     it("Should mint", async function () {
        //         let tokenId = await projectGrantCollectionV1.mintItem();
        //         expect(tokenId).is.to.equal("Project Grants Collection V1 - Test");
        //     });  
        // });
    });

    describe("Register the CollectionV1 in PGFactory", function () {
        it("Should get registered by the Factory", async function () {
            const tx = await projectGrantFactory.registerProjectGrantCollection(projectGrantCollectionV1.address);
            //console.log(tx);
            await expect(tx).to.emit(projectGrantFactory, 'RegisterProjectGrantCollection');
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const interfaceRegisterProjectGrantCollection = new ethers.utils.Interface(["event RegisterProjectGrantCollection(address initiator, uint256 index, address indexed collectionAddress, string name, uint256 timestamp)"]);
            const data = receipt.logs[0].data;
            const topics = receipt.logs[0].topics;
            const event = interfaceRegisterProjectGrantCollection.decodeEventLog("RegisterProjectGrantCollection", data, topics);
            console.log("Project grant token id: " + event.tokenId);
            expect(event.index).to.equal(0);
            expect(event.name).to.equal("Project Grants Collection V1 - Test");
            expect(event.collectionAddress).to.equal(projectGrantCollectionV1.address);
        });

        // it("Should have 1 project grant collection available", async function () {
        //     expect((await projectGrantFactory.getProjectGrantCollections()).length).to.equal(1);
        // });

        it("Should have the project grant collection V1 available at index 0", async function () {
            expect((await projectGrantFactory.getProjectGrantCollectionByIndex(0))).to.equal(projectGrantCollectionV1.address);
        });
    });

    describe("Prevent 2nd registration of the same collection", function () {
        it("Should not allow registering again the project grant collection", async function () {
            expect(await projectGrantFactory.registerProjectGrantCollection(projectGrantCollectionV1.address)).to.revertedWith("ProjectGrantFactory: Project Grants Collection already registered");
        });
        describe("Ensure collections list is kept unchanged", function() {
            // it("Should have 1 project grant collection available", async function () {
            //     expect((await projectGrantFactory.getProjectGrantCollections()).length).to.equal(1);
            // });
            it("Should have the project grant collection V1 available", async function () {
                expect((await projectGrantFactory.getCollectionIndex(projectGrantCollectionV1.address))).to.equal(0);
            });
        });
    });

    describe("Create a Project Grant from PGCollectionV1 via Factory", function () {
        it("Should be minted via Factory and registered", async function () {
            const tx = await projectGrantFactory.createProjectGrant(
                projectGrantCollectionV1.address, 
                "Project Grant Test0", 
                DEFAULT_COMMITTEE
                );
            //console.log(tx);
            await expect(tx).to.emit(projectGrantFactory, 'CreateProjectGrant');
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const interfaceCreateProjectGrant = new ethers.utils.Interface(["event CreateProjectGrant(address creator, address indexed factory, address indexed collection, uint256 indexed tokenId, string name, address committee, uint256 timestamp)"]);
            const data2 = receipt.logs[2].data;
            const topics2 = receipt.logs[2].topics;
            const event2 = interfaceCreateProjectGrant.decodeEventLog("CreateProjectGrant", data2, topics2);
            expect(event2.name).to.equal("Project Grant Test0");

            await expect(tx).to.emit(projectGrantRegistry, 'RegisterProjectGrant');
            //const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const interfaceRegisterProjectGrant = new ethers.utils.Interface(["event RegisterProjectGrant(address initiator, uint256 index, uint256 indexed tokenId, string tokenUri, string collectionName, address indexed collectionAddress, uint256 timestamp)"]);
            //console.log(receipt.logs);
            const data1 = receipt.logs[1].data;
            const topics1 = receipt.logs[1].topics;
            const event1 = interfaceRegisterProjectGrant.decodeEventLog("RegisterProjectGrant", data1, topics1);
            console.log("Project grant token id: " + event1.tokenId);
            expect(event1.collectionName).to.equal("Project Grants Collection V1 - Test");
            expect(event1.collectionAddress).to.equal(projectGrantCollectionV1.address);
            expect(event1.index).to.equal(0);
        });

        describe("Collection checks", function () {
            it("Should have 1 token", async function () {
                expect(await projectGrantCollectionV1.totalSupply()).to.equal(1);
            });

            // describe("Should be a token created in the collection", function() {
            //     it("")
            // });
        });
        
        // it("Should emit a CreateProjectGrant event ", async function () {
        //     const [owner] = await ethers.getSigners();

        //     expect(await projectGrantFactory.createProjectGrant(0, "Project Grant Test1", AUT_COMMITTEE_ADDR))
        //         .to.emit(projectGrantFactory, "CreateProjectGrant")
        //         .withArgs(owner.address, 1, );
        // });

    });

});
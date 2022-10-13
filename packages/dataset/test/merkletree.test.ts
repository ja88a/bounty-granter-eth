import { expect, assert } from 'chai';
import * as fs from 'fs';

import * as yaml from 'js-yaml';
import { decode, encode } from 'cbor-x';

import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

const buf2hex = (x: Buffer): string => '0x' + x.toString('hex');

const SOURCE_V1 = 'grants/dmnemo-backup_v1_full';
const SOURCE_V2 = 'grants/dmnemo-backup_v2_id';
const SOURCE_DEFAULT = SOURCE_V2;

const DUMP_LOG_OUTPUT = true;
const DUMP_FILE_OUTPUT = true;

function loadYaml(yamlFileNameNoExt?: string) {
    let filePath = './samples/' + SOURCE_DEFAULT + '.yaml';
    if (yamlFileNameNoExt)
        filePath = './samples/' + yamlFileNameNoExt + '.yaml'
    let fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
}

describe('Test yaml to json to MerkleTree', () => {
    it("Should create a build dir ./build/samples/grants", async function () {
        if (DUMP_FILE_OUTPUT) {
            fs.mkdir('./build/samples/grants', { recursive: true }, () => { });
            setTimeout(() => { }, 1000);
        }
    });

    it("Should load the sample YAML file ./samples/" + SOURCE_DEFAULT + ".yaml", async function () {
        let dataJsonRaw = loadYaml();
        expect(dataJsonRaw).to.not.be.null;
    });

    it("Should perform basic merkletree based verifications", async function () {
        //let dataJsonRaw =  loadYaml();

        const leaves = ['a', 'b', 'c', 'd'].map(v => keccak256(v));
        const tree = new MerkleTree(leaves, keccak256, { sort: true });
        const root = tree.getHexRoot();
        const leaf = keccak256('a');
        const proof = tree.getProof(leaf);
        const proofHex = tree.getHexProof(leaf);
        let verif = tree.verify(proof, leaf, root);
        if (DUMP_LOG_OUTPUT) {
            console.log("============ Generated #01\n\troot: " + root + "\n\tLeaf:" + buf2hex(leaf) + "\n\tproof: " + JSON.stringify(proof) + " / " + proofHex + "\n\tVerified: " + verif);
        }
        assert(verif, "Verification should have succeeded");

        const badLeaves = ['a', 'b', 'x', 'd'].map(v => keccak256(v));
        const badTree = new MerkleTree(badLeaves, keccak256, { sort: true });
        const badProof = badTree.getProof(leaf);
        const badProofHex = badTree.getHexProof(leaf);
        verif = tree.verify(badProof, leaf, root);
        if (DUMP_LOG_OUTPUT) {
            console.log("============ Generated #02\n\troot: " + root + "\n\tLeaf: " + buf2hex(leaf) + "\n\tbad proof: " + JSON.stringify(badProof) + " / " + badProofHex + "\n\tVerified: " + verif);
        }
        assert(!verif, "Verification should have failed");
    });

    const merkleTreeOpts = {
        sort: true,
        fillDefaultHash: buf2hex(keccak256('theresmorewatchoutstaypositive')),
    };

    if (merkleTreeOpts.fillDefaultHash != null)
        if (DUMP_LOG_OUTPUT) { console.log("\nFILLING IN - fillDefaultHash with " + merkleTreeOpts.fillDefaultHash); }

    it('Should simulate contract-based merkle proof verification - balanced tree', async () => {
        const leaves: Buffer[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].map(v => keccak256(v));
        const tree: MerkleTree = new MerkleTree(leaves, keccak256, merkleTreeOpts);
        const rootHex: string = buf2hex(tree.getRoot());
        const leaf = keccak256('d');
        const leafHex: string = buf2hex(leaf);
        const proof = tree.getProof(leaf);
        const proofHex: string[] = proof.map(x => buf2hex(x.data));

        let verified: boolean = tree.verify(proofHex, leafHex, rootHex);
        //const verified = await contract.verify.call(hexroot, hexleaf, hexproof);

        if (DUMP_LOG_OUTPUT) {
            console.log("============ Generated #03\n: " + tree.toString());
            const leavesHex: Buffer[] = tree.getLeaves();
            console.log("\n\troot: " + rootHex + "\n\tLeaves ("+leavesHex.length+"): " + JSON.stringify(leavesHex) + "\n\tLeaf: " + leafHex + "\n\tProof: " + JSON.stringify(proof) + "\n\t\t" + proofHex + "\n\tVerified: " + verified);
        }
        assert.equal(verified, true, "#03 Verification should have succeeded");

        const leavesBad = ['a', 'b', 'c', 'd', 'e', 'f', 'x', 'h', 'i', 'j'].map(v => keccak256(v));
        const treeBad = new MerkleTree(leavesBad, keccak256, { sort: true });
        const proofBad = treeBad.getProof(keccak256('d'));
        const proofBadHex = proofBad.map(x => buf2hex(x.data));

        verified = tree.verify(proofBadHex, leafHex, rootHex);

        if (DUMP_LOG_OUTPUT) {
            console.log("============ Generated #04\n: " + treeBad.toString());
            const leavesBadHex: Buffer[] = treeBad.getLeaves();
            console.log("\n\troot: " + rootHex + "\n\tBad Leaves ("+leavesBadHex.length+"): " + JSON.stringify(leavesBadHex) + "\n\tLeaf: " + leafHex + "\n\tProof Bad: " + JSON.stringify(proofBad) + "\n\t\t" + proofBadHex + "\n\tVerified: " + verified);
        }
        assert.equal(verified, false, "#04 Verification should have failed");
    });

    it('Should simulate contract-based merkle proof verification - odd tree', async () => {
        const leaves: Buffer[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'].map(v => keccak256(v));
        const tree: MerkleTree = new MerkleTree(leaves, keccak256, merkleTreeOpts);
        const rootHex: string = buf2hex(tree.getRoot());
        const leaf = keccak256('d');
        const leafHex: string = buf2hex(leaf);
        const proof = tree.getProof(leaf);
        const proofHex: string[] = proof.map(x => buf2hex(x.data));

        let verified: boolean = tree.verify(proofHex, leafHex, rootHex);
        //const verifiedOnChain = await contract.verify.call(hexroot, hexleaf, hexproof);

        if (DUMP_LOG_OUTPUT) {
            console.log("============ Generated #05\n: " + tree.toString());
            const leavesHex: string[] = tree.getLeaves().map(v => buf2hex(keccak256(v.toString())));
            console.log("\n\troot: " + rootHex + "\n\tLeaves ("+leavesHex.length+"): " + JSON.stringify(leavesHex) + "\n\tLeaf: " + leafHex + "\n\tProof: " + JSON.stringify(proofHex) + "\n\t\t" + proofHex + "\n\tVerified: " + verified);
        }
        assert.equal(verified, true, "#05 Verification should have succeeded -odd");

        const leavesBad = ['a', 'b', 'c', 'd', 'e', 'f', 'x', 'h', 'i', 'j', 'k'].map(v => keccak256(v));
        const treeBad = new MerkleTree(leavesBad, keccak256, { sort: true });
        const proofBad = treeBad.getProof(keccak256('d'));
        const proofBadHex = proofBad.map(x => buf2hex(x.data));

        verified = tree.verify(proofBadHex, leafHex, rootHex);

        if (DUMP_LOG_OUTPUT) {
            console.log("============ Generated #06\n: " + treeBad.toString());
            const leavesBadHex: Buffer[] = treeBad.getLeaves();
            console.log("\n\troot: " + rootHex + "\n\tBad Leaves ("+leavesBadHex.length+"): " + JSON.stringify(leavesBadHex) + "\n\tLeaf: " + leafHex + "\n\tProof Bad: " + JSON.stringify(proofBadHex) + "\n\t\t" + proofBadHex + "\n\tVerified: " + verified);
        }
        assert.equal(verified, false, "#06 Verification should have failed -odd");
    });
});

export { };
import { expect, assert } from 'chai';
import * as fs from 'fs';

import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import {
  buf2hex,
  DUMP_FILE_OUTPUT,
  DUMP_LOG_OUTPUT,
  loadYaml,
  SOURCE_DEFAULT,
} from './testing.commons';

describe('Test yaml to json to MerkleTree', () => {
  it('Should create a build dir ./build/samples/grants', async function () {
    if (DUMP_FILE_OUTPUT) {
      fs.mkdir('./build/samples/grants', { recursive: true }, () => {});
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setTimeout(() => {}, 1000);
    }
  });

  it(
    'Should load the sample YAML file ./samples/' + SOURCE_DEFAULT + '.yaml',
    async function () {
      const dataJsonRaw = loadYaml();
      expect(dataJsonRaw).to.not.be.null;
    },
  );

  it('Should perform basic merkletree based verifications', async function () {
    //let dataJsonRaw =  loadYaml();

    const leaves = ['a', 'b', 'c', 'd'].map((v) => keccak256(v));
    const tree = new MerkleTree(leaves, keccak256, { sort: true });
    const root = tree.getHexRoot();
    const leaf = keccak256('a');
    const proof = tree.getProof(leaf);

    let verif = tree.verify(proof, leaf, root);

    if (DUMP_LOG_OUTPUT) {
      const proofHex = tree.getHexProof(leaf);
      console.log(
        '============ Generated #01\n\troot: ' +
          root +
          '\n\tLeaf:' +
          buf2hex(leaf) +
          '\n\tproof: ' +
          JSON.stringify(proofHex) +
          '\n\tVerified: ' +
          verif,
      );
    }
    assert(verif, 'Verification should have succeeded');

    const badLeaves = ['a', 'b', 'x', 'd'].map((v) => keccak256(v));
    const badTree: MerkleTree = new MerkleTree(badLeaves, keccak256, {
      sort: true,
    });
    const badProof = badTree.getProof(leaf);

    verif = tree.verify(badProof, leaf, root);

    if (DUMP_LOG_OUTPUT) {
      const badProofHex: string[] = badTree.getHexProof(leaf);
      console.log(
        '============ Generated #02\n\troot: ' +
          root +
          '\n\tLeaf: ' +
          buf2hex(leaf) +
          '\n\tbad proof: ' +
          JSON.stringify(badProofHex) +
          '\n\tVerified: ' +
          verif,
      );
    }
    assert(!verif, 'Verification should have failed');
  });

  const merkleTreeOpts = {
    duplicateOdd: false,
    fillDefaultHash: buf2hex(
      keccak256('jabba01alwaysmorelistenwatchoutbepositive'),
    ),
    hashLeaves: false,
    sort: true,
  };

  if (merkleTreeOpts.fillDefaultHash != null)
    if (DUMP_LOG_OUTPUT) {
      console.log(
        '\nFILLING IN - fillDefaultHash with ' + merkleTreeOpts.fillDefaultHash,
      );
    }

  it('Should simulate contract-based merkle proof verification - balanced tree', async () => {
    const leaves: Buffer[] = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
    ].map((v) => keccak256(v));
    const tree: MerkleTree = new MerkleTree(leaves, keccak256, merkleTreeOpts);
    const rootHex: string = buf2hex(tree.getRoot());
    const leaf = keccak256('d');
    const leafHex: string = buf2hex(leaf);
    const proof = tree.getProof(leaf);
    const proofHex: string[] = proof.map((x) => buf2hex(x.data));

    let verified: boolean = tree.verify(proofHex, leafHex, rootHex);
    //const verified = await contract.verify.call(hexroot, hexleaf, hexproof);

    if (DUMP_LOG_OUTPUT) {
      console.log('============ Generated #03\n: ' + tree.toString());
      const leavesHex: string[] = tree.getLeaves().map((v) => buf2hex(v));
      console.log(
        '\n\troot: ' +
          rootHex +
          '\n\tLeaves (' +
          leavesHex.length +
          '): ' +
          JSON.stringify(leavesHex) +
          '\n\tLeaf: ' +
          leafHex +
          '\n\tProof: ' +
          JSON.stringify(proof) +
          '\n\t\t' +
          proofHex +
          '\n\tVerified: ' +
          verified,
      );
    }
    assert.equal(verified, true, '#03 Verification should have succeeded');

    const leavesBad = ['a', 'b', 'c', 'd', 'e', 'f', 'x', 'h', 'i', 'j'].map(
      (v) => keccak256(v),
    );
    const treeBad = new MerkleTree(leavesBad, keccak256, { sort: true });
    const proofBad = treeBad.getProof(keccak256('d'));
    const proofBadHex = proofBad.map((x) => buf2hex(x.data));

    verified = tree.verify(proofBadHex, leafHex, rootHex);

    if (DUMP_LOG_OUTPUT) {
      console.log('============ Generated #04\n: ' + treeBad.toString());
      const leavesBadHex: string[] = treeBad.getLeaves().map((v) => buf2hex(v));
      console.log(
        '\n\troot: ' +
          rootHex +
          '\n\tBad Leaves (' +
          leavesBadHex.length +
          '): ' +
          JSON.stringify(leavesBadHex) +
          '\n\tLeaf: ' +
          leafHex +
          '\n\tProof Bad: ' +
          JSON.stringify(proofBad) +
          '\n\t\t' +
          proofBadHex +
          '\n\tVerified: ' +
          verified,
      );
    }
    assert.equal(verified, false, '#04 Verification should have failed');
  });

  it('Should simulate contract-based merkle proof verification - odd tree', async () => {
    const leaves: Buffer[] = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
    ].map((v) => keccak256(v));

    const tree: MerkleTree = new MerkleTree(leaves, keccak256, merkleTreeOpts);
    const root: Buffer = tree.getRoot();
    const leaf: Buffer = keccak256('d');
    const proof: any[] = tree.getProof(leaf);

    const verified: boolean = tree.verify(proof, leaf, root);

    const rootHex: string = buf2hex(root);
    const leafHex: string = buf2hex(leaf);
    const proofHex: string[] = proof.map((x) => buf2hex(x.data));

    const verifiedHex: boolean = tree.verify(proofHex, leafHex, rootHex);
    //const verifiedOnChain = await contract.verify.call(hexroot, hexleaf, hexproof);

    if (DUMP_LOG_OUTPUT) {
      console.log('============ Generated #05\n: ' + tree.toString());
      const leavesHex: string[] = tree.getLeaves().map((v) => buf2hex(v));
      console.log(
        '\n\troot: ' +
          rootHex +
          '\n\tLeaves (' +
          leavesHex.length +
          '): ' +
          JSON.stringify(leavesHex) +
          '\n\tLeaf: ' +
          leafHex +
          '\n\tProof (' +
          proofHex.length +
          '): ' +
          JSON.stringify(proofHex) +
          '\n\t\t' +
          proofHex +
          '\n\tVerified: ' +
          verifiedHex,
      );
    }
    assert.equal(verified, true, '#05 Verification should have succeeded -odd');
    assert.equal(
      verifiedHex,
      true,
      '#05 Verification based on HEX should have succeeded -odd',
    );

    const leavesBad = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'x',
      'h',
      'i',
      'j',
      'k',
    ].map((v) => keccak256(v));

    const treeBad = new MerkleTree(leavesBad, keccak256, { sort: true });
    const proofBad = treeBad.getProof(leaf);

    const proofBadHex = proofBad.map((x) => buf2hex(x.data));
    const verifiedBad = tree.verify(proofBadHex, leafHex, rootHex);

    if (DUMP_LOG_OUTPUT) {
      console.log('============ Generated #06\n: ' + treeBad.toString());
      const leavesBadHex: string[] = treeBad.getLeaves().map((v) => buf2hex(v));
      console.log(
        '\n\troot: ' +
          rootHex +
          '\n\tBad Leaves (' +
          leavesBadHex.length +
          '): ' +
          JSON.stringify(leavesBadHex) +
          '\n\tLeaf: ' +
          leafHex +
          '\n\tProof Bad (' +
          proofBadHex.length +
          '): ' +
          JSON.stringify(proofBadHex) +
          '\n\t\t' +
          proofBadHex +
          '\n\tVerified: ' +
          verifiedBad,
      );
    }
    assert.equal(
      verifiedBad,
      false,
      '#06 Verification should have failed -odd',
    );
  });
});

export {};

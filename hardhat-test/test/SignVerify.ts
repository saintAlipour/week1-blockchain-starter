import { expect } from "chai";
import hre from "hardhat";

describe("SignVerify", function () {
  let signVerify: any;
  let signer: any;

  before(async function () {
    const { ethers } = await hre.network.connect();
    signer = ethers.Wallet.createRandom();

    const SignVerifyFactory = await ethers.getContractFactory("SignVerify");
    signVerify = await SignVerifyFactory.deploy(signer.address);
    await signVerify.waitForDeployment();

    console.log("Contract deployed to:", await signVerify.getAddress());
    console.log("Expected signer   :", signer.address);
  });

  it("Should verify a valid signature", async function () {
    const { ethers } = await hre.network.connect();
    const message = "Trade: BUY 1.5 BTC @ 92000";

    console.log("\n--- DEBUG INFO ---");
    console.log("Message:", message);

    // روش ۱: استفاده از signMessage (EIP-191)
    const signature = await signer.signMessage(message);
    console.log("Signature:", signature);

    // هش داخلی که signMessage استفاده می‌کنه
    const messageHash = ethers.hashMessage(message);
    console.log("HashMessage (EIP-191):", messageHash);

    // شبیه‌سازی قرارداد: keccak256(message) → اونوقت wrap
    const messageBytes = ethers.toUtf8Bytes(message);
    const contractKeccak = ethers.keccak256(messageBytes);
    console.log("Contract-side keccak256(message):", contractKeccak);

    // بازیابی آدرس امضاکننده سمت کلاینت (برای تست)
    const { r, s, v } = ethers.Signature.from(signature);
    const recoveredOffchain = ethers.recoverAddress(messageHash, { r, s, v });
    console.log("Recovered off-chain:", recoveredOffchain);

    // تست قرارداد
    const isValid = await signVerify.verifySignature(signature);
    console.log("Contract verify result:", isValid);
    console.log("--- END DEBUG ---\n");

    expect(isValid).to.equal(true);
  });

  it("Should reject a tampered message", async function () {
    const originalMessage = "Trade: BUY 1.5 BTC @ 92000";
    const tamperedMessage = "Trade: BUY 1.5 BTC @ 92001";

    const signature = await signer.signMessage(originalMessage);
    const isValid = await signVerify.verifyMessage(tamperedMessage, signature);
    expect(isValid).to.equal(false);

    console.log(" Tampered message rejected:", isValid);
  });

  it("Should recover the correct signer address", async function () {
    const { ethers } = await hre.network.connect();

    const message = "Trade: BUY 1.5 BTC @ 92000";
    const signature = await signer.signMessage(message);

    const { r, s, v } = ethers.Signature.from(signature);
    const recovered = ethers.recoverAddress(
      ethers.hashMessage(message),
      { r, s, v }
    );

    expect(recovered).to.equal(signer.address);
    console.log(" Recovered signer:", recovered);
  });
});
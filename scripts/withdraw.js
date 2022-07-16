const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffe.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    const contractAddress = "0xAAAA062F02c463782890b19a8525F00B7f42Fbe7";
    const contractABI = abi.abi;

    //get the node conection and wallet conection

    const provider = new hre.ethers.providers.AlchemyProvider("rinkeby", process.env.RINKEBY_API_KEY);

    //The signer has to be the same contract that deployed the code else it will fail.

    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY,provider)

    //Instantiate connected contract. 
    const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    //Check starting balance
    console.log("Current balance of owner:", await getBalance(provider, signer.address));
    const contractBalance = await getBalance(provider, buyMeACoffee.address);
    console.log("current balance of contract:", await contractBalance, "ETH")

    //Script to withdraw funds if there are funds to withdraw.
    if (contractBalance !== "0.0") {
        console.log("Withdrawing funds...")
        const withdrawTxn = await buyMeACoffee.withdrawTips();
        await withdrawTxn.wait();
    }   else {
        console.log("no funds to withdraw");
    }

    //Check ending balance to confirm it's empty.
    console.log("Current balance of owner:", await getBalance(provider, signer.address), "ETH");
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }   catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("getBalance");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected";
    console.log(ethers);
  } else {
    connectButton.innerHTML = "Install Metamask";
  }
}

//fund function
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}`);
  if (typeof window.ethereum != "undefined") {
    //provider - connection to blockchain(infura/alchemy)
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //signer/wallet/ someone with some gas/ account
    const signer = provider.getSigner();
    //console.log(signer);
    //contract
    //-- ABI & address
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transResponse = await contract.fundMe({
        value: ethers.utils.parseEther(ethAmount),
      });
      //listen for mined transaction
      await listenForTransactionMine(transResponse, provider);
      fundButton.innerHTML = "Funded!";
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transResponse, provider) {
  console.log(`Mining ${transResponse.hash}........`);
  return new Promise((resolve, reject) => {
    //create a listener for blockachain
    //listen for tranactions to finish
    provider.once(transResponse.hash, (tranactionReceipt) => {
      console.log(
        `Completed with ${tranactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

//withdraw
async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    console.log("Withdrawing..........");
    if (typeof window.ethereum != "undefined") {
      //provider - connection to blockchain(infura/alchemy)
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      //signer/wallet/ someone with some gas/ account
      const signer = provider.getSigner();
      //console.log(signer);
      //contract
      //-- ABI & address
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const transRes = await contract.withdraw();
        await listenForTransactionMine(transRes, provider);
        fundButton.innerHTML = "Funded!";
        console.log("Done!");
      } catch (error) {
        console.log(`This is  ${error}`);
      }
    }
  }
}

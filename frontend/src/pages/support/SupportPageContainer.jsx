import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import AuthService from "../../services/auth/AuthService";
import ApiError from "../../services/ApiError";
import { contractAddress, abi } from "../../constants";

const SupportPageContainer = () => {
  const { initiativeId } = useParams();
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const response=await AuthService.getCurrentUser();
      console.log(response)
      if(response instanceof ApiError){
        console.log(response.errorMessage);
      }else{
        setUserId(response.username);
      }
    }
    fetchUser();
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          setWeb3(web3Instance);
          const contractInstance = new web3Instance.eth.Contract(
            abi,
            contractAddress
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("User denied account access");
        }
      } else if (window.web3) {
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        const contractInstance = new web3Instance.eth.Contract(
          abi,
          contractAddress
        );
        setContract(contractInstance);
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    };

    loadWeb3();
  }, []);

  const handleDonate = async () => {
    if (
      !web3 ||
      !contract ||
      !account ||
      !donationAmount ||
      isNaN(donationAmount) ||
      !initiativeId ||
      !userId
    ) {
      setStatusMessage(
        "Please connect your wallet and enter valid donation details."
      );
      return;
    }

    const value = web3.utils.toWei(donationAmount, "ether");

    try {
      await contract.methods.donate(initiativeId, userId).send({ from: account, value });
      setStatusMessage("Donation successful!");
    } catch (error) {
      console.error("Donation failed:", error);
      setStatusMessage("Donation failed. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-grey shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Donate to Support
      </h2>
      <div className="mb-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount (in ETH):
        </label>
        <input
          type="text"
          id="amount"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
      <button
        onClick={handleDonate}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Donate
      </button>
      {statusMessage && (
        <p className="mt-4 text-center text-red-500">{statusMessage}</p>
      )}
    </div>
  );
};

export default SupportPageContainer;

import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../Constants/index";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
const EnterRaffle = () => {
  /* States of different Lottery Variables */
  const [EntranceFee, setEntranceFee] = useState("0");
  const [PlayerNumber, setPlayerNumber] = useState("0");
  const [RecentWinner, setRecentWinner] = useState("0");
  const dispatch = useNotification();
  const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ContractAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: ContractAddress,
    functionName: "enterRaffle",
    msgValue: EntranceFee,
    params: {},
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: ContractAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getPlayersNumber } = useWeb3Contract({
    abi: abi,
    contractAddress: ContractAddress,
    functionName: "getPlayersNumber",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: ContractAddress,
    functionName: "getRecentWinner",
    params: {},
  });
  
  async function getEntrance() {
    const entranceFee = (await getEntranceFee()).toString();
    const playerNo = (await getPlayersNumber()).toString();
    const recentWiner = (await getRecentWinner()).toString();
    setRecentWinner(recentWiner);
    setEntranceFee(entranceFee);
    setPlayerNumber(playerNo);
  }

  async function participateRaffle() {
    await enterRaffle({
      onSuccess: handleSuccess,
      onError: (error) => handleError(error),
    });
  }
  async function handleSuccess(tx) {
    await tx.wait(1);
    handleNotification();
    getEntrance();
  }
  function handleNotification() {
    dispatch({
      type: "info",
      message: "Transaction Completed",
      title: "Tx Notification",
      position: "topR",
    });
  }
  async function handleError(error) {
    dispatch({
      type: "error",
      message: error,
    });
  }
  useEffect(() => {
    getEntrance();
  }, [isWeb3Enabled]);
  return (
    <div>
      {ContractAddress ? (
        <div>
          <button
            className="btn btn-primary mx-3"
            disabled={isLoading || isFetching}
            onClick={participateRaffle}
          >
            {isLoading || isFetching?"Wait Now":"Enter Raffle"}
          </button>
          <div className="container-fluid p-3">
          <div>
          {EntranceFee === "0"
            ? "Loading Entrance Fee"
            : "The Entrance Fee is " +
              ethers.utils.formatUnits(EntranceFee, "ether") +
              " ETH"}
            </div>
          <div>Total Participants are {PlayerNumber} </div>
          {account===RecentWinner.toLowerCase()?"Congratulations! You Won The Lottery... Have Fun!":<div>The Recent Winner is {RecentWinner} </div>}
        </div>
        </div>
      ) : (
        <div>Not on a supported chain</div>
      )}
    </div>
  );
};

export default EnterRaffle;

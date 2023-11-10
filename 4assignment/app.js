window.addEventListener('load', async () => {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        alert('Please install MetaMask or another Ethereum wallet.');
        return;
    }

    const contractAddress = '0x316808C61411C24c1578E51F356fdC8ebD123649';
    const contractAbi = [
        [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_stakingPeriod",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_totalRewards",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_user",
                        "type": "address"
                    }
                ],
                "name": "calculateRewards",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "distributeRewards",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "stake",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "stakedBalances",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "stakedUsers",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "stakingPeriod",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "stakingStartTimes",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalRewards",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "userBalances",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "withdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    ];

    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    const userBalanceElement = document.getElementById('userBalance');
    const userStakedBalanceElement = document.getElementById('userStakedBalance');
    const userStakingStartTimeElement = document.getElementById('userStakingStartTime');
    const userRewardsElement = document.getElementById('userRewards');

    userAddressElement.textContent = userAddress;

    async function updateUserData() {
        const userBalance = await contract.methods.userBalances(userAddress).call();
        const userStakedBalance = await contract.methods.stakedBalances(userAddress).call();
        const userStakingStartTime = await contract.methods.stakingStartTimes(userAddress).call();
        const userRewards = await contract.methods.calculateRewards(userAddress).call();

        userBalanceElement.textContent = userBalance;
        userStakedBalanceElement.textContent = userStakedBalance;
        userStakingStartTimeElement.textContent = userStakingStartTime;
        userRewardsElement.textContent = userRewards;
    }

    updateUserData();

    document.getElementById('stakeForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const stakeAmount = event.target.elements.stakeAmount.value;
        await contract.methods.stake(stakeAmount).send({ from: userAddress });
        updateUserData();
    });

    document.getElementById('withdrawButton').addEventListener('click', async () => {
        await contract.methods.withdraw().send({ from: userAddress });
        updateUserData();
    });

    document.getElementById('distributeButton').addEventListener('click', async () => {
        await contract.methods.distributeRewards().send({ from: userAddress });
        updateUserData();
    });
});

const { ethers } = require('hardhat');

async function main() {
    // Deploy the Staking contract with constructor arguments
    const Staking = await ethers.getContractFactory('Staking');
    const stakingPeriod = 60 * 60 * 24 * 30; // 30 days in seconds
    const totalRewards = ethers.utils.parseEther('100'); // Assuming 100 Ether as rewards
    const stakingContract = await Staking.deploy(stakingPeriod, totalRewards);
    await stakingContract.deployed();

    console.log('Staking contract deployed to:', stakingContract.address);

    // Interact with the contract
    const [owner, user] = await ethers.getSigners();

   
    const stakeAmount = 100;
    await stakingContract.connect(user).stake(stakeAmount);
    console.log('User staked', stakeAmount, 'tokens.');

    // Example: Calculate rewards
    const userRewards = await stakingContract.calculateRewards(user.address);
    console.log('User rewards:', userRewards.toString(), 'tokens.');

    // Example: Distribute rewards (as the owner)
    if (owner.address === await stakingContract.owner()) {
        await stakingContract.distributeRewards();
        console.log('Rewards distributed.');
    }

    // Example: Withdraw tokens
    await stakingContract.connect(user).withdraw();
    console.log('User withdrew tokens.');

    // Display user balances after actions
    const userBalance = await stakingContract.userBalances(user.address);
    console.log('User balance after actions:', userBalance.toString(), 'tokens.');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

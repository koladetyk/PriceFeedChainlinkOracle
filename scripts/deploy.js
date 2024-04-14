// scripts/deploy.js

async function main() {
  
  const PriceFeedFactory = await ethers.getContractFactory("PriceFeed");
  const priceFeed = await PriceFeedFactory.deploy();
  await priceFeed.deployed();

  console.log("PriceFeed contract deployed to:", priceFeed.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

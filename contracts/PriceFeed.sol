// SPDX-LICENSE-IDENTIFIER: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceFeed is Ownable {

    struct FeedInfo {
        AggregatorV3Interface aggregator;
        string description;
    }

    mapping(uint => FeedInfo) public feeds;
    mapping(uint => int) public lastFetchedPrice;

    event FeedAddressUpdated(uint feedid, address newAddress, string description);
    event PriceRequested(string description, int price);

    constructor() Ownable(msg.sender) {
        feeds[1] = FeedInfo(AggregatorV3Interface(0x31CF013A08c6Ac228C94551d535d5BAfE19c602a), "BTC/USD");
        feeds[2] = FeedInfo(AggregatorV3Interface(0x86d67c3D38D2bCeE722E601025C25a575021c6EA), "ETH/USD");
        feeds[3] = FeedInfo(AggregatorV3Interface(0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470), "LINK/USD");
        feeds[4] = FeedInfo(AggregatorV3Interface(0x378E78509a907B1Ec5c24d9f0243BD39f7A7b007), "BTC/ETH");
    }

    function updatePrice(uint feedid) public {
        FeedInfo storage feed = feeds[feedid];
        require(address(feed.aggregator) != address(0), "Contract address not found.");
        (, int price,,,) = feed.aggregator.latestRoundData();
        lastFetchedPrice[feedid] = price;
        emit PriceRequested(feed.description, price);
    }

    function getLatestFetchedPrice(uint feedid) public view returns (int) {
        require(lastFetchedPrice[feedid] != 0, "Latest price conversion has not been retrieved. ");
        return lastFetchedPrice[feedid];
    }

    function updateFeedPrice(uint feedid, address newAddress) public onlyOwner {
        require(newAddress != address(0), "Updated address is undefined. ");
        require(feedid > 0 && feedid < 5, "Invalid feed ID. ");
        feeds[feedid].aggregator = AggregatorV3Interface(newAddress);
        emit FeedAddressUpdated(feedid,newAddress,feeds[feedid].description);
    }
}


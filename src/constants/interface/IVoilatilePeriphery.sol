// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

interface IVoilatilePeriphery {
    function uniFactory() external view returns (address);
    function uniPool() external view returns (address);
    function voilaFactory() external view returns (address);
    function voilaPool() external view returns (address);
    function principalToken() external view returns (address);
    function quoteToken() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function feeTier() external view returns (uint24);
    function owner() external view returns (address);
    
    function buyPositions(bytes32 key) external view returns (
        int256 tickIndex,
        uint128 nonce,
        uint128 entryCheckpoint,
        uint128 amount
    );

    function nextBuyPositionId(address key) external view returns (
        uint256 positionId
    );

    function lpPositions(bytes32 key) external view returns (
        int256 tickIndex,
        uint256 amount
    );

    function lpTickIndexToPositionId(bytes32 key) external view returns (
        uint256 positionId
    );

    function nextLPPositionId(address key) external view returns (
        uint256 positionId
    );

    function ssPositions(bytes32 key) external view returns (
        int256 tickIndex,
        uint256 amount
    );

    function ssTickIndexToPositionId(bytes32 key) external view returns (
        uint256 positionId
    );

    function nextSSPositionId(address key) external view returns (
        uint256 positionId
    );

    function fetchBuyPosition(address addr, uint256 positionId) external view returns (
        int256 tickIndex,
        uint128 entryBlockNumber,
        uint128 expirationBlockNumber,
        uint128 amount,
        uint128 qTokensEarned
    );

    function fetchLongPrice(int256 tickIndex) external view returns (
        uint256 priceX64
    );
    function fetchATM() external view returns (
        int256 atm
    );
    
    //@notice Change a new Uni pool. Only the owner can call this function
    function changeUniPool(address _token0, address _token1, uint24 _fee_tier) external;
    //@notice create a new Voila pool. Only the owner can call this function
    function createVoilaPool(address _principalToken, address _quoteToken, int256 atm) external;
    //@notice change the Voila pool. Only the owner can call this function
    function changeVoilaPool(address _principalToken, address _quoteToken) external;
    //@notice buy a new position
    function buy(int256 _tickIndex, uint128 _amount) external returns(uint256 positionId);
    //@notice sell the entire position
    function sell(uint256 positionId) external ;
    //@notice extend an existing position
    function extend(bytes32 positionId) external;
    //@notice create a new short-sell position
    function ss(int256 _tickIndex, uint128 _amount) external returns (uint256 positionId);
    //@notice close the entire short-sell position
    function ssClose(int256 _tickIndex) external;
    //@notice create a new LP position
    function LP(int256 _tickIndex, uint128 _amount) external returns (uint256 positionId);
    // @notice close the entire position
    function LPclose(int256 _tickIndex) external;
    // @notice calibrate the ATM tick with Uniswap's tick 
    function atmSwap(uint256 iterations) external;



}
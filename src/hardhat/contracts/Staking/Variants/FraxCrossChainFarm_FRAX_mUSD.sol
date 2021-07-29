// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.6.11;
pragma experimental ABIEncoderV2;

import "../FraxCrossChainFarm.sol";

contract FraxCrossChainFarm_FRAX_mUSD is FraxCrossChainFarm {
    constructor(
        address _owner,
        address _rewardsToken0,
        address _rewardsToken1,
        address _stakingToken, 
        address _frax_address,
        address _timelock_address
    ) 
    FraxCrossChainFarm(_owner, _rewardsToken0, _rewardsToken1, _stakingToken, _frax_address, _timelock_address )
    {}
}

const path = require('path');
const envPath = path.join(__dirname, '../../.env');
require('dotenv').config({ path: envPath });

const constants = require(path.join(__dirname, '../src/types/constants'));

const BigNumber = require('bignumber.js');
require('@openzeppelin/test-helpers/configure')({
	provider: process.env.NETWORK_ENDPOINT,
});

const { expectEvent, send, shouldFail, time } = require('@openzeppelin/test-helpers');
const BIG6 = new BigNumber("1e6");
const BIG18 = new BigNumber("1e18");
const chalk = require('chalk');

const Address = artifacts.require("Utils/Address");
const BlockMiner = artifacts.require("Utils/BlockMiner");
const MigrationHelper = artifacts.require("Utils/MigrationHelper");
const StringHelpers = artifacts.require("Utils/StringHelpers");
const Math = artifacts.require("Math/Math");
const SafeMath = artifacts.require("Math/SafeMath");
const Babylonian = artifacts.require("Math/Babylonian");
const FixedPoint = artifacts.require("Math/FixedPoint");
const UQ112x112 = artifacts.require("Math/UQ112x112");
const Owned = artifacts.require("Staking/Owned");
const ERC20 = artifacts.require("ERC20/ERC20");
const ERC20Custom = artifacts.require("ERC20/ERC20Custom");
const SafeERC20 = artifacts.require("ERC20/SafeERC20");

// Uniswap related
const TransferHelper = artifacts.require("Uniswap/TransferHelper");
const SwapToPrice = artifacts.require("Uniswap/SwapToPrice");
const UniswapV2ERC20 = artifacts.require("Uniswap/UniswapV2ERC20");
const UniswapV2Factory = artifacts.require("Uniswap/UniswapV2Factory");
const UniswapV2Library = artifacts.require("Uniswap/UniswapV2Library");
const UniswapV2OracleLibrary = artifacts.require("Uniswap/UniswapV2OracleLibrary");
const UniswapV2Pair = artifacts.require("Uniswap/UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("Uniswap/UniswapV2Router02");
const UniswapV2Router02_Modified = artifacts.require("Uniswap/UniswapV2Router02_Modified");
const TestSwap = artifacts.require("Uniswap/TestSwap");

// Collateral
const WETH = artifacts.require("ERC20/WETH");
const FakeCollateral_USDC = artifacts.require("FakeCollateral/FakeCollateral_USDC");
const FakeCollateral_USDT = artifacts.require("FakeCollateral/FakeCollateral_USDT");
const FakeCollateral_6DEC = artifacts.require("FakeCollateral/FakeCollateral_6DEC");

// Collateral Pools
const FraxPoolLibrary = artifacts.require("Frax/Pools/FraxPoolLibrary");
const Pool_USDC = artifacts.require("Frax/Pools/Pool_USDC");
const Pool_USDT = artifacts.require("Frax/Pools/Pool_USDT");
const Pool_6DEC = artifacts.require("Frax/Pools/Pool_6DEC");

// Oracles
const UniswapPairOracle_FRAX_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_FRAX_WETH");
const UniswapPairOracle_FRAX_USDC = artifacts.require("Oracle/Variants/UniswapPairOracle_FRAX_USDC");
const UniswapPairOracle_FRAX_USDT = artifacts.require("Oracle/Variants/UniswapPairOracle_FRAX_USDT");
const UniswapPairOracle_FRAX_6DEC = artifacts.require("Oracle/Variants/UniswapPairOracle_FRAX_6DEC");
const UniswapPairOracle_FRAX_FXS = artifacts.require("Oracle/Variants/UniswapPairOracle_FRAX_FXS");
const UniswapPairOracle_FXS_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_FXS_WETH");
const UniswapPairOracle_FXS_USDC = artifacts.require("Oracle/Variants/UniswapPairOracle_FXS_USDC");
const UniswapPairOracle_FXS_USDT = artifacts.require("Oracle/Variants/UniswapPairOracle_FXS_USDT");
const UniswapPairOracle_FXS_6DEC = artifacts.require("Oracle/Variants/UniswapPairOracle_FXS_6DEC");
const UniswapPairOracle_USDC_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_USDC_WETH");
const UniswapPairOracle_USDT_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_USDT_WETH");
const UniswapPairOracle_6DEC_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_6DEC_WETH");

// Chainlink Price Consumer
const ChainlinkETHUSDPriceConsumer = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumer");
const ChainlinkETHUSDPriceConsumerTest = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumerTest");

// FRAX core
const FRAXStablecoin = artifacts.require("Frax/FRAXStablecoin");
const FRAXShares = artifacts.require("FXS/FRAXShares");
const TokenVesting = artifacts.require("FXS/TokenVesting");

// Governance related
const GovernorAlpha = artifacts.require("Governance/GovernorAlpha");
const Timelock = artifacts.require("Governance/Timelock");

// Staking contracts
const StakingRewards_FRAX_WETH = artifacts.require("Staking/Variants/Stake_FRAX_WETH.sol");
const StakingRewards_FRAX_USDC = artifacts.require("Staking/Variants/Stake_FRAX_USDC.sol");
const StakingRewards_FRAX_FXS = artifacts.require("Staking/Variants/Stake_FRAX_FXS.sol");
const StakingRewards_FXS_WETH = artifacts.require("Staking/Variants/Stake_FXS_WETH.sol");

const DUMP_ADDRESS = "0x6666666666666666666666666666666666666666";

// Make sure Ganache is running beforehand
module.exports = async function(deployer, network, accounts) {
	
	// ======== Set the addresses ========
	console.log(chalk.yellow('===== SET THE ADDRESSES ====='));
	const COLLATERAL_FRAX_AND_FXS_OWNER = accounts[1];
	const ORACLE_ADDRESS = accounts[2];
	const POOL_CREATOR = accounts[3];
	const TIMELOCK_ADMIN = accounts[4];
	const GOVERNOR_GUARDIAN_ADDRESS = accounts[5];
	const STAKING_OWNER = accounts[6];
	const STAKING_REWARDS_DISTRIBUTOR = accounts[7];
	// const COLLATERAL_FRAX_AND_FXS_OWNER = accounts[8];

	// ======== Set other constants ========
	console.log(chalk.yellow('===== SET OTHER CONSTANTS ====='));
	const ONE_MILLION_DEC18 = new BigNumber("1000000e18");
	const FIVE_MILLION_DEC18 = new BigNumber("5000000e18");
	const TEN_MILLION_DEC18 = new BigNumber("10000000e18");
	const ONE_HUNDRED_MILLION_DEC18 = new BigNumber("100000000e18");
	const ONE_BILLION_DEC18 = new BigNumber("1000000000e18");
	const COLLATERAL_SEED_DEC18 = new BigNumber(508500e18);
	
	const REDEMPTION_FEE = 400; // 0.04%
	const MINTING_FEE = 300; // 0.03%
	const COLLATERAL_PRICE = 1040000; // $1.04
	const FRAX_PRICE = 980000; // $0.98
	const FXS_PRICE = 210000; // $0.21
	const TIMELOCK_DELAY = 86400 * 2; // 2 days
	const DUMP_ADDRESS = "0x6666666666666666666666666666666666666666";
	const METAMASK_ADDRESS = process.env.METAMASK_ADDRESS;;

	console.log(`====================================================`);

	// Get the necessary instances
	let CONTRACT_ADDRESSES;
	let timelockInstance;
	let migrationHelperInstance;
	let fraxInstance;
	let fxsInstance;
	let tokenVestingInstance;
	let governanceInstance;
	let wethInstance;
	let col_instance_USDC;
	let col_instance_USDT;
	let col_instance_6DEC;
	let routerInstance;
	let uniswapFactoryInstance;
	let swapToPriceInstance;
	let oracle_instance_FRAX_WETH;
	let oracle_instance_FRAX_USDC;
	let oracle_instance_FRAX_USDT;
	let oracle_instance_FRAX_6DEC;
	let oracle_instance_FRAX_FXS;
	let oracle_instance_FXS_WETH;
	let oracle_instance_FXS_USDC; 
	let oracle_instance_FXS_USDT; 
	let oracle_instance_FXS_6DEC; 
	let oracle_instance_USDC_WETH;
	let oracle_instance_USDT_WETH;
	let oracle_instance_6DEC_WETH;
	let stakingInstance_FRAX_WETH;
	let stakingInstance_FRAX_USDC;
	let stakingInstance_FRAX_FXS;
	let stakingInstance_FXS_WETH;
	let pool_instance_USDC;
	let pool_instance_USDT;
	let pool_instance_6DEC;

	// Get the necessary instances
	if (process.env.MIGRATION_MODE == 'ganache'){
		timelockInstance = await Timelock.deployed();
		migrationHelperInstance = await MigrationHelper.deployed()
		governanceInstance = await GovernorAlpha.deployed();
		routerInstance = await UniswapV2Router02_Modified.deployed(); 
		fraxInstance = await FRAXStablecoin.deployed();
		fxsInstance = await FRAXShares.deployed();
		tokenVestingInstance = await TokenVesting.deployed();
		wethInstance = await WETH.deployed();
		col_instance_USDC = await FakeCollateral_USDC.deployed(); 
		col_instance_USDT = await FakeCollateral_USDT.deployed(); 
		col_instance_6DEC = await FakeCollateral_6DEC.deployed(); 
		uniswapFactoryInstance = await UniswapV2Factory.deployed(); 
		oracle_instance_FRAX_WETH = await UniswapPairOracle_FRAX_WETH.deployed();
		oracle_instance_FRAX_USDC = await UniswapPairOracle_FRAX_USDC.deployed(); 
		oracle_instance_FRAX_USDT = await UniswapPairOracle_FRAX_USDT.deployed();
		oracle_instance_FRAX_6DEC = await UniswapPairOracle_FRAX_6DEC.deployed();
		oracle_instance_FRAX_FXS = await UniswapPairOracle_FRAX_FXS.deployed();
		oracle_instance_FXS_WETH = await UniswapPairOracle_FXS_WETH.deployed();
		oracle_instance_FXS_USDC = await UniswapPairOracle_FXS_USDC.deployed(); 
		oracle_instance_FXS_USDT = await UniswapPairOracle_FXS_USDT.deployed(); 
		oracle_instance_FXS_6DEC = await UniswapPairOracle_FXS_6DEC.deployed(); 
		oracle_instance_USDC_WETH = await UniswapPairOracle_USDC_WETH.deployed();
		oracle_instance_USDT_WETH = await UniswapPairOracle_USDT_WETH.deployed();
		oracle_instance_6DEC_WETH = await UniswapPairOracle_6DEC_WETH.deployed();
		stakingInstance_FRAX_WETH = await StakingRewards_FRAX_WETH.deployed();
		stakingInstance_FRAX_USDC = await StakingRewards_FRAX_USDC.deployed();
		stakingInstance_FRAX_FXS = await StakingRewards_FRAX_FXS.deployed();
		stakingInstance_FXS_WETH = await StakingRewards_FXS_WETH.deployed();
		swapToPriceInstance = await SwapToPrice.deployed();
		pool_instance_USDC = await Pool_USDC.deployed();
		pool_instance_USDT = await Pool_USDT.deployed();
		pool_instance_6DEC = await Pool_6DEC.deployed();
	}
	else {
		CONTRACT_ADDRESSES = constants.CONTRACT_ADDRESSES;
		timelockInstance = await Timelock.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].misc.timelock);
		migrationHelperInstance = await MigrationHelper.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].misc.migration_helper);
		fraxInstance = await FRAXStablecoin.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].main.FRAX);
		fxsInstance = await FRAXShares.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].main.FXS);
		tokenVestingInstance = await TokenVesting.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].main.vesting);
		governanceInstance = await GovernorAlpha.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].governance);
		wethInstance = await WETH.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].weth);
		col_instance_USDC = await FakeCollateral_USDC.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].collateral.USDC);
		col_instance_USDT = await FakeCollateral_USDT.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].collateral.USDT); 
		col_instance_6DEC = await FakeCollateral_6DEC.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].collateral['6DEC']); 
		routerInstance = await UniswapV2Router02_Modified.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].uniswap_other.router); 
		uniswapFactoryInstance = await UniswapV2Factory.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].uniswap_other.factory); 
		swapToPriceInstance = await SwapToPrice.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].pricing.swap_to_price); 
		oracle_instance_FRAX_WETH = await UniswapPairOracle_FRAX_WETH.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.FRAX_WETH);
		oracle_instance_FRAX_USDC = await UniswapPairOracle_FRAX_USDC.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.FRAX_USDC); 
		oracle_instance_FRAX_USDT = await UniswapPairOracle_FRAX_USDT.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.FRAX_USDT); 
		oracle_instance_FRAX_6DEC = await UniswapPairOracle_FRAX_6DEC.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.FRAX_6DEC); 
		oracle_instance_FRAX_FXS = await UniswapPairOracle_FRAX_FXS.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.FRAX_FXS);
		oracle_instance_FXS_WETH = await UniswapPairOracle_FXS_WETH.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.FXS_WETH);
		oracle_instance_FXS_USDC = await UniswapPairOracle_FXS_USDC.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.FXS_USDC); 
		oracle_instance_FXS_USDT = await UniswapPairOracle_FXS_USDT.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.FXS_USDT); 
		oracle_instance_FXS_6DEC = await UniswapPairOracle_FXS_6DEC.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.FXS_6DEC); 
		oracle_instance_USDC_WETH = await UniswapPairOracle_USDC_WETH.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.USDC_WETH);
		oracle_instance_USDT_WETH = await UniswapPairOracle_USDT_WETH.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles.USDT_WETH);
		oracle_instance_6DEC_WETH = await UniswapPairOracle_6DEC_WETH.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].oracles['6DEC_WETH']);
		stakingInstance_FRAX_WETH = await StakingRewards_FRAX_WETH.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].staking_contracts_for_tokens["Uniswap FRAX/WETH"]);
		stakingInstance_FRAX_USDC = await StakingRewards_FRAX_USDC.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].staking_contracts_for_tokens["Uniswap FRAX/USDC"]);
		stakingInstance_FRAX_FXS = await StakingRewards_FRAX_FXS.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].staking_contracts_for_tokens["Uniswap FRAX/FXS"]);
		stakingInstance_FXS_WETH = await StakingRewards_FXS_WETH.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].staking_contracts_for_tokens["Uniswap FXS/WETH"]);
		pool_instance_USDC = await Pool_USDC.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].pools.USDC);
		pool_instance_USDT = await Pool_USDT.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].pools.USDT);
		pool_instance_6DEC = await Pool_6DEC.at(CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].pools["6DEC"]);
	}


	const pair_addr_FRAX_WETH = await uniswapFactoryInstance.getPair(fraxInstance.address, wethInstance.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	const pair_addr_FRAX_USDC = await uniswapFactoryInstance.getPair(fraxInstance.address, col_instance_USDC.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	const pair_addr_FRAX_USDT = await uniswapFactoryInstance.getPair(fraxInstance.address, col_instance_USDT.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	const pair_addr_FRAX_6DEC = await uniswapFactoryInstance.getPair(fraxInstance.address, col_instance_6DEC.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
    
	
  const pair_addr_FXS_WETH = await uniswapFactoryInstance.getPair(fxsInstance.address, wethInstance.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	const pair_addr_FXS_USDC = await uniswapFactoryInstance.getPair(fxsInstance.address, col_instance_USDC.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	const pair_addr_FXS_USDT = await uniswapFactoryInstance.getPair(fxsInstance.address, col_instance_USDT.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	const pair_addr_FXS_6DEC = await uniswapFactoryInstance.getPair(fxsInstance.address, col_instance_6DEC.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	

	const pair_addr_FRAX_FXS = await uniswapFactoryInstance.getPair(fraxInstance.address, fxsInstance.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });

	const pair_addr_USDC_WETH = await uniswapFactoryInstance.getPair(col_instance_USDC.address, wethInstance.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	const pair_addr_USDT_WETH = await uniswapFactoryInstance.getPair(col_instance_USDT.address, wethInstance.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });

	// ======== Get various pair instances ======== 
	console.log(chalk.yellow('===== GET VARIOUS PAIR INSTANCES ====='));
	const pair_instance_FRAX_WETH = await UniswapV2Pair.at(pair_addr_FRAX_WETH);
	const pair_instance_FRAX_USDC = await UniswapV2Pair.at(pair_addr_FRAX_USDC);
    const pair_instance_FRAX_FXS = await UniswapV2Pair.at(pair_addr_FRAX_FXS);
	const pair_instance_FXS_WETH = await UniswapV2Pair.at(pair_addr_FXS_WETH);


	// CONTINUE MAIN DEPLOY CODE HERE
	// ====================================================================================================================
	// ====================================================================================================================
	
	// if (process.env.MIGRATION_MODE == 'ganache'){
	// 	// Advance 24 hrs so the period can be computed
	// 	await time.increase(86400 + 1);
	// 	await time.advanceBlock();
	// }
	
	// ======== Set FRAX collateral pools ========
	console.log(chalk.yellow('===== FRAX COLLATERAL POOL ====='));

	// Link the FAKE collateral pool to the FRAX contract
	await fraxInstance.addPool(pool_instance_USDC.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	await fraxInstance.addPool(pool_instance_USDT.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	await fraxInstance.addPool(pool_instance_6DEC.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });

	// ======== Set the FRAX address inside of the FXS contract ========
	console.log(chalk.yellow('===== SET FRAX ADDRESS ====='));
	// Link the FRAX contract to the FXS contract
	await fxsInstance.setFRAXAddress(fraxInstance.address, { from: COLLATERAL_FRAX_AND_FXS_OWNER });

	// ======== Display prices ========
	console.log(chalk.yellow('===== DISPLAY PRICES ====='));

	// Get the prices
	let frax_price_from_FRAX_WETH = (new BigNumber(await oracle_instance_FRAX_WETH.consult.call(wethInstance.address, 1e6))).div(BIG6).toNumber();
	let frax_price_from_FRAX_USDC = (new BigNumber(await oracle_instance_FRAX_USDC.consult.call(col_instance_USDC.address, 1e6))).div(BIG6).toNumber();
	let frax_price_from_FRAX_6DEC = (new BigNumber(await oracle_instance_FRAX_6DEC.consult.call(col_instance_6DEC.address, 1e6))).div(BIG6).toNumber();
	
	let frax_price_from_FRAX_FXS = (new BigNumber(await oracle_instance_FRAX_FXS.consult.call(fxsInstance.address, 1e6))).div(BIG6).toNumber();
	
	let fxs_price_from_FXS_WETH = (new BigNumber(await oracle_instance_FXS_WETH.consult.call(wethInstance.address, 1e6))).div(BIG6).toNumber();


	let USDC_price_from_USDC_WETH = (new BigNumber(await oracle_instance_USDC_WETH.consult.call(wethInstance.address, 1e6))).div(BIG6).toNumber();
	let DEC6_price_from_DEC6_WETH = (new BigNumber(await oracle_instance_6DEC_WETH.consult.call(wethInstance.address, 1e12))).toNumber();
	
	const frax_price_initial = new BigNumber(await fraxInstance.frax_price({ from: COLLATERAL_FRAX_AND_FXS_OWNER })).div(BIG6);
	const fxs_price_initial = new BigNumber(await fraxInstance.fxs_price({ from: COLLATERAL_FRAX_AND_FXS_OWNER })).div(BIG6);

	// Print the new prices
	console.log("frax_price_initial: ", frax_price_initial.toString() , " USD = 1 FRAX");
	console.log("fxs_price_initial: ", fxs_price_initial.toString(), " USD = 1 FXS");
	console.log("frax_price_from_FRAX_WETH: ", frax_price_from_FRAX_WETH.toString(), " FRAX = 1 WETH");
	console.log("frax_price_from_FRAX_USDC: ", frax_price_from_FRAX_USDC.toString(), " FRAX = 1 USDC");
	console.log("frax_price_from_FRAX_6DEC: ", frax_price_from_FRAX_6DEC.toString(), " FRAX = 1 6DEC");
	console.log("frax_price_from_FRAX_FXS: ", frax_price_from_FRAX_FXS.toString(), " FRAX = 1 FXS");
	console.log("fxs_price_from_FXS_WETH: ", fxs_price_from_FXS_WETH.toString(), " FXS = 1 WETH");

	console.log("USDC_price_from_USDC_WETH: ", USDC_price_from_USDC_WETH.toString(), " USDC = 1 WETH");
	console.log("6DEC_price_from_6DEC_WETH: ", DEC6_price_from_DEC6_WETH.toString(), " 6DEC = 1 WETH");

	// ======== Transfer some tokens and ETH to Metamask ========
	console.log(chalk.yellow('===== TRANSFER SOME TOKENS AND ETH TO METAMASK ====='));

	// FRAX and FXS
	await fxsInstance.transfer(METAMASK_ADDRESS, new BigNumber("1000e18"), { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	await fraxInstance.transfer(METAMASK_ADDRESS, new BigNumber("1000e18"), { from: COLLATERAL_FRAX_AND_FXS_OWNER });

	// Collateral 
	if (process.env.MIGRATION_MODE != 'mainnet'){
		await wethInstance.transfer(METAMASK_ADDRESS, new BigNumber("10000e18"), { from: COLLATERAL_FRAX_AND_FXS_OWNER });
		await col_instance_USDC.transfer(METAMASK_ADDRESS, new BigNumber("200000e18"), { from: COLLATERAL_FRAX_AND_FXS_OWNER });
		await col_instance_USDT.transfer(METAMASK_ADDRESS, new BigNumber("200000e18"), { from: COLLATERAL_FRAX_AND_FXS_OWNER });
		await col_instance_6DEC.transfer(METAMASK_ADDRESS, new BigNumber("200000e6"), { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	}

	// Liquidity tokens
	await pair_instance_FRAX_WETH.transfer(METAMASK_ADDRESS, new BigNumber("15e18"), { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	await pair_instance_FRAX_USDC.transfer(METAMASK_ADDRESS, new BigNumber("25e18"), { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	await pair_instance_FRAX_FXS.transfer(METAMASK_ADDRESS, new BigNumber("25e18"), { from: COLLATERAL_FRAX_AND_FXS_OWNER });
	await pair_instance_FXS_WETH.transfer(METAMASK_ADDRESS, new BigNumber("25e18"), { from: COLLATERAL_FRAX_AND_FXS_OWNER });


	// ======== Initialize the staking rewards ========
	await stakingInstance_FRAX_WETH.initializeDefault({ from: STAKING_OWNER });
	await stakingInstance_FRAX_USDC.initializeDefault({ from: STAKING_OWNER });
	await stakingInstance_FRAX_FXS.initializeDefault({ from: STAKING_OWNER });
	await stakingInstance_FXS_WETH.initializeDefault({ from: STAKING_OWNER });

	// ======== Note the addresses ========
	// If you are testing the frontend, you need to copy-paste the output of CONTRACT_ADDRESSES to the frontend src/misc/constants.tsx
	const hasLibraries = CONTRACT_ADDRESSES && CONTRACT_ADDRESSES[process.env.MIGRATION_MODE] && CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].libraries;
	let CONTRACT_ADDRESSES_FINAL = {
		[process.env.MIGRATION_MODE]: {
			main: {
				FRAX: fraxInstance.address,
				FXS: fxsInstance.address,
				vesting: tokenVestingInstance.address
			},
			weth: wethInstance.address,
			oracles: {
				FRAX_WETH: oracle_instance_FRAX_WETH.address,
				FRAX_USDC: oracle_instance_FRAX_USDC.address,
				FRAX_USDT: oracle_instance_FRAX_USDT.address,
				FRAX_6DEC: oracle_instance_FRAX_6DEC.address,
				FRAX_FXS: oracle_instance_FRAX_FXS.address,
				FXS_WETH: oracle_instance_FXS_WETH.address,
				FXS_USDC: oracle_instance_FXS_USDC.address,
				FXS_USDT: oracle_instance_FXS_USDT.address,
				FXS_6DEC: oracle_instance_FXS_6DEC.address,
				USDC_WETH: oracle_instance_USDC_WETH.address,
				USDT_WETH: oracle_instance_USDT_WETH.address,
				"6DEC_WETH": oracle_instance_USDT_WETH.address,
			},
			collateral: {
				USDC: col_instance_USDC.address,
				USDT: col_instance_USDT.address,
				"6DEC": col_instance_6DEC.address,
			},
			governance: governanceInstance.address,
			pools: {
				USDC: pool_instance_USDC.address,
				USDT: pool_instance_USDT.address,
				"6DEC": pool_instance_6DEC.address,
			},
			uniswap_other: {
				router: routerInstance.address,
				factory: uniswapFactoryInstance.address,
			},
			pricing: {
				swap_to_price: swapToPriceInstance.address
			},
			misc: {
				timelock: timelockInstance.address,
				migration_helper: migrationHelperInstance.address
			},
			libraries: {
				UniswapV2OracleLibrary: (hasLibraries && CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].libraries.UniswapV2OracleLibrary) || "",
				UniswapV2Library: (hasLibraries && CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].libraries.UniswapV2Library) || "",
				FraxPoolLibrary: (hasLibraries && CONTRACT_ADDRESSES[process.env.MIGRATION_MODE].libraries.FraxPoolLibrary) || "",
			},
			stake_tokens: {
				'Uniswap FRAX/WETH': pair_instance_FRAX_WETH.address,
				'Uniswap FRAX/USDC': pair_instance_FRAX_USDC.address,
				'Uniswap FRAX/FXS': pair_instance_FRAX_FXS.address,
				'Uniswap FXS/WETH': pair_instance_FXS_WETH.address,
			},
			staking_contracts_for_tokens: {
				'Uniswap FRAX/WETH': stakingInstance_FRAX_WETH.address,
				'Uniswap FRAX/USDC': stakingInstance_FRAX_USDC.address,
				'Uniswap FRAX/FXS': stakingInstance_FRAX_FXS.address,
				'Uniswap FXS/WETH': stakingInstance_FXS_WETH.address,
			}
		}     
	}

	console.log("CONTRACT_ADDRESSES_FINAL: ", CONTRACT_ADDRESSES_FINAL);

	// deployer.deploy(UniswapPairOracle);
	console.log(`==========================================================`);

};

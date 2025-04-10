require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

// getAmountsIn - This function calculates the required input amounts to obtain a specific output amount
// getAmountsOut - This function calculates the expected output amounts for a given input amount  



const BSC_TESTNET_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const TESTNET_ROUTER_ADDRESS = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'; // PancakeSwap Router v2 Testnet

const USDT_TESTNET = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd'; // USDT Testnet
const DAI_TESTNET = '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867';
const WBNB_TESTNET = '0xae13d989dac2f0debff460ac112a837c89baa7cd';
const ETH_TESTNET = '0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378';
const CHAIN_ID = 97; // BSC Testnet


const provider = new ethers.providers.JsonRpcProvider(BSC_TESTNET_RPC);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);


const router = new ethers.Contract(
    TESTNET_ROUTER_ADDRESS,
    [
        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
        'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
        'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable external returns (uint[] memory amounts)'
    ],
    signer
);

const usdtContract = new ethers.Contract(
    USDT_TESTNET,
    [
        'function approve(address spender, uint256 amount) external returns (bool)',
        'function allowance(address owner, address spender) external view returns (uint256)',
        'function balanceOf(address owner) external view returns (uint256)'
    ],
    signer
);

const gasLimit = 128648;

app.post("/swapExactETHForTokens-BNB-USDT", async (req, res) => {
    try {
        const { amountIn, amountOutMin, path, to, deadline } = req.body;
        const swapExactETHForTokens = await router.swapExactETHForTokens(amountOutMin, path, to, deadline, {
            value: amountIn, // Specify the amount of BNB to send
            gasLimit: gasLimit,
        });
        const tx = await swapExactETHForTokens.wait();
        res.json({ message: `Swaping the Token using BNB to USDT with minimum slippage of ${amountOutMin} within the deadline of ${deadline} and sending the Swapped token to the ${to} address. The transaction hash is ${tx.transactionHash}.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/swapExactTokensForTokens-USDT-DAI", async (req, res) => {
    try {
        const { amountIn, amountOutMin, path, to, deadline } = req.body;

        const usdtBalance = await usdtContract.balanceOf(await signer.getAddress());
        console.log(`💰 Your USDT Balance: ${ethers.utils.formatUnits(usdtBalance, 18)} USDT`);

        if (usdtBalance.lt(amountIn)) {
            console.error('❌ Error: Insufficient USDT balance!');
            return;
        }

        const allowance = await usdtContract.allowance(await signer.getAddress(), TESTNET_ROUTER_ADDRESS);

        if (allowance.lt(amountIn)) {
            console.log('🔄 Approving USDT...');
            const approveTx = await usdtContract.approve(TESTNET_ROUTER_ADDRESS, ethers.constants.MaxUint256);
            await approveTx.wait();
            console.log('✅ Approval Confirmed!');
        }
        const swapExactTokensForTokens = await router.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
        const tx = await swapExactTokensForTokens.wait();
        res.json({ message: `Swaping the Token using USDT to DAI with minimum slippage of ${amountOutMin} within the deadline of ${deadline} and sending the Swapped token to the ${to} address. The transaction hash is ${tx.transactionHash}.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(`🔄 Swapping ${ethers.utils.formatUnits(amountIn, 18)} USDT for DAI...`);

    }


});

app.post("/swapExactTokensForToken-USDT-TBNb", async (req, res) => {
    try {
        const { amountIn, amountOutMin, path, to, deadline } = req.body;

        const usdtBalance = await usdtContract.balanceOf(await signer.getAddress());
        console.log(`💰 Your USDT Balance: ${ethers.utils.formatUnits(usdtBalance, 18)} USDT`);

        if (usdtBalance.lt(amountIn)) {
            console.error('❌ Error: Insufficient USDT balance!');
            return;
        }

        const allowance = await usdtContract.allowance(await signer.getAddress(), TESTNET_ROUTER_ADDRESS);

        if (allowance.lt(amountIn)) {
            console.log('🔄 Approving USDT...');
            const approveTx = await usdtContract.approve(TESTNET_ROUTER_ADDRESS, ethers.constants.MaxUint256);
            await approveTx.wait();
            console.log('✅ Approval Confirmed!');
        }
        const swapExactTokensForTokens = await router.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
        const tx = await swapExactTokensForTokens.wait();
        res.json({ message: `Swaping the Token using USDT to tbnb with minimum slippage of ${amountOutMin} within the deadline of ${deadline} and sending the Swapped token to the ${to} address. The transaction hash is ${tx.transactionHash}.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(`🔄 Swapping ${ethers.utils.formatUnits(amountIn, 18)} USDT for TBNB...`);

    }


});

app.post("/swapExactTokensForTokens-USDT-ETH", async (req, res) => {
    try {
        const { amountIn, amountOutMin, path, to, deadline } = req.body;

        const usdtBalance = await usdtContract.balanceOf(await signer.getAddress());
        console.log(`💰 Your USDT Balance: ${ethers.utils.formatUnits(usdtBalance, 18)} USDT`);

        if (usdtBalance.lt(amountIn)) {
            console.error('❌ Error: Insufficient USDT balance!');
            return;
        }

        const allowance = await usdtContract.allowance(await signer.getAddress(), TESTNET_ROUTER_ADDRESS);

        if (allowance.lt(amountIn)) {
            console.log('🔄 Approving USDT...');
            const approveTx = await usdtContract.approve(TESTNET_ROUTER_ADDRESS, ethers.constants.MaxUint256);
            await approveTx.wait();
            console.log('✅ Approval Confirmed!');
        }
        const swapExactTokensForTokens = await router.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
        const tx = await swapExactTokensForTokens.wait();
        res.json({ message: `Swaping the Token using USDT to eth with minimum slippage of ${amountOutMin} within the deadline of ${deadline} and sending the Swapped token to the ${to} address. The transaction hash is ${tx.transactionHash}.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(`🔄 Swapping ${ethers.utils.formatUnits(amountIn, 18)} USDT for ETH...`);

    }


});

// This function calculates the expected output amounts for a given input amount  


app.get("/getAmountsOut", async (req, res) => {
    try {
        const { amountIn, path } = req.body;
        const AmountsOut = await router.getAmountsOut(amountIn, path);
        res.json({ 
            message: `For a given input amount  ${amountIn}, the expected output amounts for the path [${path.join(" -> ")}] are: ${AmountsOut.join(", ")}.` 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const PORT = 5080;
app.listen(PORT, () => {
    console.log(`ERC-20 API running on http://localhost:${PORT}`);
});



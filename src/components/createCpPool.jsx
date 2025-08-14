import { PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Raydium, printSimulate, getCpmmPdaAmmConfigId } from '@raydium-io/raydium-sdk-v2';
import BN from 'bn.js';
import { useState } from "react";

export function CreateCpPool({ token }) {
    const { publicKey, signAllTransactions } = useWallet();
    const { connection } = useConnection();
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    async function createPool() {
        setStatus("");
        setLoading(true);
        try {
            const raydium = await Raydium.load({
                owner: publicKey,
                connection,
                cluster: 'devnet',
                signAllTransactions
            });

            const tokenA = {
                address: token,
                programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                decimals: 9,
            };
            const tokenB = {
                address: 'So11111111111111111111111111111111111111112', // wSOL mint address
                programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                decimals: 9,
            };

            const amountA = new BN(100 * (10 ** 9)); // 100 of your token
            const amountB = new BN(1 * (10 ** 9));   // 1 wSOL

            const startTime = new BN(0);
            const feeConfigs = await raydium.api.getCpmmConfigs();

            if (raydium.cluster === 'devnet') {
                feeConfigs.forEach((config) => {
                    config.id = getCpmmPdaAmmConfigId(
                        new PublicKey("DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb"),
                        config.index
                    ).publicKey.toBase58();
                });
            }

            setStatus("Simulating pool creation...");
            const { execute, transaction } = await raydium.cpmm.createPool({
                programId: new PublicKey('DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb'),
                poolFeeAccount: new PublicKey("3oE58BKVt8KuYkGxx8zBojugnymWmBiyafWgMrnb6eYy"),
                mintA: tokenA,
                mintB: tokenB,
                mintAAmount: amountA,
                mintBAmount: amountB,
                startTime,
                feeConfig: feeConfigs[0],
                ownerInfo: {
                    feePayer: publicKey,
                    useSOLBalance: true
                },
                associatedOnly: false
            });

            printSimulate([transaction]);

            setStatus("Sending transaction...");
            const { txId } = await execute({ sendAndConfirm: true });
            setStatus(
                <>
                    <div>✅ Pool created!</div>
                    <div>
                        <a
                            href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on Solana Explorer
                        </a>
                    </div>
                </>
            );
        } catch (error) {
            setStatus(<span style={{ color: "red" }}>Error: {error.message || error.toString()}</span>);
        }
        setLoading(false);
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            width: "100%"
        }}>
            <h3 style={{ margin: 0 }}>Constant Product Pool</h3>
            <button
                onClick={createPool}
                disabled={loading}
                style={{
                    padding: "10px 24px",
                    fontSize: 16,
                    background: "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: loading ? "not-allowed" : "pointer",
                    marginBottom: 8
                }}
            >
                {loading ? "Creating Pool..." : "Create Pool"}
            </button>
            <div style={{ minHeight: 32 }}>{status}</div>
        </div>
    );
}
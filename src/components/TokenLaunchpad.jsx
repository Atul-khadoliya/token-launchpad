import { Keypair, SystemProgram, Transaction } from '@solana/web3.js'
import { 
    getMinimumBalanceForRentExemptMint, 
    MINT_SIZE, 
    TOKEN_PROGRAM_ID, 
    createInitializeMint2Instruction 
} from '@solana/spl-token';
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

export function TokenLaunchpad({onTokenCreate}) {
    const { connection } = useConnection();
    const wallet = useWallet(); // <-- fix: add parentheses

    async function createToken() {
        const name = document.getElementById('name').value;
        const symbol = document.getElementById('symbol').value;
        const image = document.getElementById('image').value;
        const initialSupply = document.getElementById('initialSupply').value;

        const mintKeypair = Keypair.generate();
        const lamports = await getMinimumBalanceForRentExemptMint(connection);

        const transaction = new Transaction().add( 
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMint2Instruction(
                mintKeypair.publicKey, 
                9, 
                wallet.publicKey,   
                wallet.publicKey, 
                TOKEN_PROGRAM_ID
            )
        );

        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintKeypair);

        await wallet.sendTransaction(transaction, connection); // <-- fix typo
        console.log(`token is created at ${mintKeypair.publicKey.toBase58()}`);
        onTokenCreate(mintKeypair.publicKey) ;
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h1>Solana Token Launchpad</h1>
            <input id="name" className='inputText' type='text' placeholder='Name' /><br />
            <input id="symbol" className='inputText' type='text' placeholder='Symbol' /><br />
            <input id="image" className='inputText' type='text' placeholder='Image URL' /><br />
            <input id="initialSupply" className='inputText' type='text' placeholder='Initial Supply' /><br />
            <button onClick={createToken} className='btn'>Create a token</button>
        </div>
    );
}
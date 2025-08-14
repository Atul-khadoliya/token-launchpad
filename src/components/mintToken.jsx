import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { createMintToInstruction } from '@solana/spl-token';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Transaction } from '@solana/web3.js';
import { createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';


export function MintToken({mintaddress,onDone}) {
    
    const wallet = useWallet();
    const {connection} = useConnection()
     


    async function MintTokenFunc() {
         const ataAdress = getAssociatedTokenAddressSync(
             mintaddress,
             wallet.publicKey,
             false,
             TOKEN_PROGRAM_ID
         )
         
        const transaction1 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
               wallet.publicKey,
               ataAdress,
               wallet.publicKey,
               mintaddress,
             )
        );
        await wallet.sendTransaction(transaction1,connection) ;
        const amountSol = Number(document.getElementById('amount').value) ;
        const amount = amountSol*1_000_000_000 ;
        const mintTransaction = new Transaction().add(
            createMintToInstruction(
                mintaddress,
                ataAdress,
                wallet.publicKey,
                amount
            )
        )
        await wallet.sendTransaction(mintTransaction,connection)   ;
        onDone() ;
        console.log(`minted ${amount} tokens to ${ataAdress}`)   
    }



    return <div>
        <input  id = "amount" type="text" placeholder="enter the amount" />
        <button onClick = {MintTokenFunc}>Mint</button>
    </div>
}
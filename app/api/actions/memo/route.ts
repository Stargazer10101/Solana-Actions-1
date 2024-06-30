import { ACTIONS_CORS_HEADERS, ActionGetRequest, ActionGetResponse, ActionPostRequest, ActionPostResponse, MEMO_PROGRAM_ID, createPostResponse } from "@solana/actions";
import {
    Account,
  ComputeBudgetInstruction,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
} from "@solana/web3.js";

export const GET = (req: Request) => {
  const payload: ActionGetRequest = {
    icon: new URL("/solana-devs.jpg", new URL(req.url).origin).toString(),
    label: "Send Memo",
    description: "This is a super simple action",
    title: "Memo Demo",
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};
//checked till here(line 25)

export const OPTIONS = GET;

export const POST= async(req:Request)=>{
    try{
        const body: ActionPostRequest= await req.json();
        let account: PublicKey;
        try{
            account = new PublicKey(body.account);
        } catch (err){
            return new Response('Invalid "account" provided', {
                status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
        }
//line(42)      
        const transaction = new Transaction();
        transaction.add(

                ComputeBudgetProgram.setComputeUnitPrice({
                  microLamports: 1000,
                }),
            new TransactionInstruction({
                programId: new PublicKey(MEMO_PROGRAM_ID),
                data: Buffer.from("thid is simple memo message", "utf8"),
                keys: [],
            }),
        );
        
        transaction.feePayer= account;
// (line 57)  

const connection= new Connection(clusterApiUrl("devnet"));
transaction.recentBlockhash= (await connection.getLatestBlockhash()).blockhash;
const payload: ActionPostResponse = await createPostResponse({

    fields: {
        transaction,
    },
    //signers:[]
    });

    return Response.json(payload, {headers: ACTIONS_CORS_HEADERS});
    }catch(err){
        return Response.json("An unknown error occured", {status:400});
    }
};

// checked till here(line 79)


//     export const OPTIONS= GET;

//     export const POST= (req: Request)=>{
//     try{
//         const body: ActionPostRequest=await req.json();
//     const transaction = new Transaction();

//     transaction.add(
//       ComputeBudgetProgram.setComputeUnitPrice({
//         microLamports: 1000,
//       }),

//       new TransactionInstruction({
//         programId: new PublicKey(MEMO_PROGRAM_ID),
//         data: Buffer.from("this is a simple memo message", "utf8"),
//         keys: [],
//       }),
//     );
// }catch(err){
//     return Response.json("An unknown error occured", {status:400});
// }
// };


//     transaction.feePayer= account;

//     const connection= new Connection(clusterApiUrl("devnet"));
//     transaction.recentBlockhash= (await connection.getLatestBlockhash()).blockhash;
//     const payload: ActionPostResponse = await createPostResponse({

//         fields: {
//             transaction,
//         },
//         //signers:[]
//     });

//     return Response.json(payload, {headers: ACTIONS_CORS_HEADERS});

//     } catch (err) {
//     return Response.json("An unknown error occured", { status: 400 });
//   }
// };

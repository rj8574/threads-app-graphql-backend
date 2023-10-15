import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { json } from 'body-parser';
import { prismaClient } from './lib/db';

async function init(){
    const app = express()
    const PORT =Number(process.env.port) || 8000;

    app.use(express.json())
// create graphql server 
const gqlServer =new ApolloServer({
    typeDefs :`
        type Query {
            hello : String,
            say(name:String):String,
        }
        type Mutation {
            createUser(firstName: String!,
                 lastName: String! ,
                 email:String!,
                 password:String!): Boolean
        }
    `,
    resolvers :{
        Query :{
            hello:()=>`hey there  i am qraphql server `,
            say :(_,{name}:{name:string})=>`HEY ${name} , how are you ?`
        },
        Mutation :{
            createUser: async (_,{
                firstName,
                lastName ,
                email,
                password
            }:{
                 firstName:string;
                lastName : string;
                email : string ;
                password :string;
            })=>{
                    await prismaClient.user.create ({   
                        
                        data:{
                            email,
                            firstName,
                            lastName,
                            password,
                            salt:"random_value",
                            
                        }                
                    
                })
                return true;
                    
                }     
        }
    },
}
)


app.get("/", (req,res)=>{
    res.json(
        {message:"server is up and running"}
    )
});
await gqlServer.start();
app.use("/graphql", expressMiddleware(gqlServer))


app.listen(PORT,()=>console.log(`Server started at Port : ${PORT}`))


}
init();
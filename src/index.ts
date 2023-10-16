import express from 'express'
import { ApolloServer } from '@apollo/server';
import createApolloGraphqlServer from "./graphql"

import { expressMiddleware } from '@apollo/server/express4';



async function init(){
    const app = express()
    const PORT =Number(process.env.port) || 8000;
    app.use(express.json())
// create graphql server 
    app.get("/", (req,res)=>{
        res.json(
            {message:"server is up and running"}
        )
    });

    app.use("/graphql", expressMiddleware(await createApolloGraphqlServer()))


    app.listen(PORT,()=>console.log(`Server started at Port : ${PORT}`))


}
init();
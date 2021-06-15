const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const path = require('path');
const util = require('util');

const plaid = require('plaid');
const plaidClient = new plaid.Client({
  clientID: process.env.CLIENTID,
  secret: process.env.SECRET,
  env: plaid.environments.sandbox
});


app.post('/token-exchange', async(req,res)=> {
    const {publicToken}=req.body;
    const {access_token:accessToken} = await plaidClient.exchangePublicToken(publicToken);
  
  
    const authResponse = await plaidClient.getAuth(accessToken);
    console.log(util.inspect(authResponse, false,null,true));
  
    const identityResponse = await plaidClient.getIdentity(accessToken);
    console.log(util.inspect(identityResponse, false,null,true));
  
    const balanceResponse = await plaidClient.getBalance(accessToken);
    console.log(util.inspect(balanceResponse, false,null,true));
  
    res.sendStatus(200);
  });
  
app.get('/',async (req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
})
  

app.get('/create-link-token', async(req,res)=>{
  try {
    const {link_token: linkToken} = await plaidClient.createLinkToken({
      user: {
        client_user_id: '1234',
      },
      client_name : 'App of VArun',
      products: ['auth','identity'],
      country_codes: ['US'],
      langauge: 'en',
    });
    res.json({linkToken});
  }
  catch(e) {
    console.log(e);
  }

  
});



app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));





const express=require('express');
const app=express();
const port=3000;
require('dotenv').config()

const https=require('https');


app.use(express.json()); //for parsing json bodies
app.use(express.urlencoded({extended:true})); //for parsing url encoded-bodies
app.use(express.static(`${__dirname}/public`));

app.get('/',(req,res)=>{
    res.sendFile(`${__dirname}/signup.html`);
})

app.post('/',(req,res)=>{
  const firstName=req.body.fName;
  const lastName=req.body.lName;
  const email=req.body.email;

   const data={
       members:[
           {
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName
            }

           }
       ]
   };

   const jsonData=JSON.stringify(data);
   const list_id=process.env.list_id;
   const api_key=process.env.api_key;

   const url=`https://us14.api.mailchimp.com/3.0/lists/${list_id}`;

   const options={
   method:"POST",
   auth:`apiKey:${api_key}`
   }

  const request=https.request(url,options,(response)=>{
      if(response.statusCode===200){
          res.sendFile(`${__dirname}/success.html`);
      }
      else{
        res.sendFile(`${__dirname}/failure.html`);
      }
   })


   request.write(jsonData);
   request.end();
})

app.post("/failure",(req,res)=>{
    res.redirect("/");
})

app.listen(process.env.PORT || port,()=> console.log(`Server is running on port ${port}`)); 

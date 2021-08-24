'use strict';

const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());


const PORT = process.env.PORT;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Flowers', {useNewUrlParser: true, useUnifiedTopology: true});
// ------------------------------ Schemas------------------------------------
const FlowersSchema = new mongoose.Schema({
    name : String,
    instructions : String,
    photo : String

})

const FlowerOnwer = new mongoose.Schema({

    userEmail : String,
    Flowers:[FlowersSchema]
})

const modelOnwer = mongoose.model('FavFlowers', FlowerOnwer );


// ------------------------------ end Points --------------------------------

server.get('/test' , testHandler);
server.get('/getAllFlowers', getAllFlowersHandler);
server.post('/addFlowersToFav', addFlowersToFavHandler);
server.get('/getFavFlowers', getFavFlowersHandler);
server.delete('./deleteFlowers/:idx', deleteFavFlowerHandler);
server.put('./UpdateFlowers/:idx', updateFavFlowerHandler);




// ------------------------------ Handler --------------------------------


function getAllFlowersHandler( req,res){


    const URL = 'https://flowers-api-13.herokuapp.com/getFlowers';
    axios.get(URL)
    .then(result => {

        res.send(result.data.flowerslist);
})
.catch();
}



function addFlowersToFavHandler( req,res){

    const {userEmail , FlowerObj} = req.body;
    modelOnwer.findOne({userEmal: userEmail}, (err,result) => {
     if(!result){

        const newOnwer = new modelOnwer ({
            userEmail:userEmail,
            Flowers:[FlowerObj],

        })
        newOnwer.save();
     } else {
         result.flowerslist.unshift(FlowerObj);
         result.save();
     }




    })




}

function getFavFlowersHandler( req,res){

  const {userEmail} = req.query;

  modelOnwer.findOne({userEmail:userEmail} , (err,result) => {
      if(err){
          console.log(err);
      } else {
          res.send(result.flowerslist)
      }
  })

}


function deleteFavFlowerHandler(req,res){

 const {idx } = req.params;
 const {userEmail} = req.query;

 modelOnwer.findOne({userEmail:userEmail}, (err,result) =>{
   if(err){
       console.log(err);
   }else {
       result.flowerslist.splice(idx,1);
       result.save().then(
           res.send(result.flowerslist)
       )
   }
   

 })

} 

 function updateFavFlowerHandler(req,res){

    const {idx } = req.params;
    const {userEmail,flowerObj} = req.body;
   
    modelOnwer.findOne({userEmail:userEmail}, (err,result) =>{
      if(err){
          console.log(err);
      }else {
           result.flowerslist[idx] = flowerObj;
           result.save().then(
               res.send(result.flowerslist)
          )
      }
      
   
    })

} 






function testHandler( req,res){


res.send('hello from test handler');

}

server.listen(PORT , () => {

    console.log(`Listining on PORT ${PORT}`);
})



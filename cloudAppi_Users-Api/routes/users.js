const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const Address = require('../models/Address')
const ObjectID = require('mongodb').ObjectID;

router.get("/getusers",(req,res)=>{
  User.find()
  .populate('address')
  .then(allUsers=>res.status(200).json({description:'OK',schema:allUsers}))
  .catch(err=>res.json(err))
})

router.post("/createUsers",(req,res)=>{
  const {name,email,birthDate,street,state,city,country,zip} = req.body
  Address.create({
    street,
    state,
    city,
    country,
    zip
  })
  .then(createdAddress=>{
    User.create({
      name,
      email,
      birthDate,
      address : createdAddress._id
    })
    .then(createdUser=>res.status(201).json({confirmation:'CREATED',schema:createdUser}))

  })

  .catch(err=>res.status(405).json({description:"invalid input",err}))
})

router.get("/getusersById/:userId",(req,res)=>{
  if(!ObjectID.isValid(req.params.userId)){
    res.status(400).json({description:'Invalid user Id'})
    return
  }
  User.findById(req.params.userId)
  .populate('address')
  .then(foundUser=>{
    if(!foundUser){
      res.status(404).json({description:'User not found'})
    }else{
      res.status(200).json({description:'OK',schema:foundUser})
    }
  })
  .catch(err=>res.json(err))
  
})

router.put("/updateUsersById/:userId",(req,res)=>{
  const {name,email,birthDate,street,state,city,country,zip} = req.body

  if(!ObjectID.isValid(req.params.userId)){
    res.status(400).json({description:'Invalid user Id'})
    return
  }
  User.findByIdAndUpdate(req.params.userId,{name,email,birthDate},{new:true})
  .then(updatedUser=>{
    if(!updatedUser){
      res.status(404).json({description:'User not found'})
    }else{
      Address.findByIdAndUpdate(updatedUser.address,{street,state,city,country,zip},{new:true})
      .then(updatedUserAddress=>res.status(200).json({description:'OK',schema:updatedUser})
      )
      .catch(err=>res.json(err))
    }
  })
  .catch(err=>res.json(err))
})

router.delete('/deleteUsersById/:userId',(req,res)=>{
  if(!ObjectID.isValid(req.params.userId)){
    res.status(400).json({description:'Invalid user Id'})
    return
  }
  User.findByIdAndDelete(req.params.userId)
  .then(deletedUser=>{
    if(!deletedUser){
      res.status(404).json({description:'User not found'})
    }else{
      res.status(200).json({description:'OK',schema:deletedUser})
    }
  })
  .catch(err=>res.json(err))

})

module.exports = router;

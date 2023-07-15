const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt=require('bcrypt');
const { json } = require('express');
const app = express();
app.use(express.json());
app.use(cors());

app.get('/food-delivery',(req,res)=>{
  res.sendFile(__dirname + '/index.html');
});

app.get('/login-signup',(req,res)=>{
  res.sendFile(__dirname + '/loginSignup.html')
});


app.get('/cart',(req,res)=>{
  res.sendFile(__dirname + "/cart.html");
})

app.get('/order-history',(req,res)=>{
  res.sendFile(__dirname + '/orderHistory.html')
})

app.get('/script.js',(req,res)=>{
  res.sendFile(__dirname + "/script.js")
})


let db;

MongoClient.connect('mongodb+srv://sumit:sumit123@cluster0.p2fwbsz.mongodb.net/?retryWrites=true&w=majority').then((client) => {
  db = client.db('food-delivery-db')
  console.log("DB server is connected");
}).catch((err) => {
  console.log(err);
})


app.post('/signup', async (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;

  if (!fullName || !email || !phoneNumber || !password) {
    res.json({ message: "Please enter valid details" });
    return;
  }
  else {
    const result = await db.collection('user-cred').find({ email }).toArray();
    console.log(result);
    if (result.length) {
      res.json({ message: 'user already present' })
      return;
    }
    const hashedPassword=bcrypt.hash(password,10);
    const user = { fullName, email, phoneNumber, password:hashedPassword };
    await db.collection('user-cred').insertOne(user);
    res.json({ message: "User created successfully" });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const result = await db.collection('user-cred').find({ email }).toArray();
    if (result.length) {
      if (result[0].password == password) {
        res.json({ message: "login successfull", details: result })
      } else {
        res.json({ message: 'Invalid Password' });
      }
    }
    else {
      res.json({ message: 'user doesn\'t exist' })
    }

  }
  else {
    res.json({ message: "Invalid email or password" })
  }
})


app.post('/forgotPassword', async (req, res) => {
  const { email, phoneNumber, newPassword } = req.body;
  if(email && phoneNumber && newPassword ){
    const result = await db.collection('user-cred').find({email}).toArray();
    if (result.length) {
      if (result[0].phoneNumber == phoneNumber) {
        await db.collection('user-cred').updateOne({email},{$set:{password:newPassword} });
        res.json({ message: "password updated successfully", details: result })
      } else {
        res.json({ message: 'Invalid Phone Number' });
      }
    }
  }else{
  res.json({ message: "Invalid Phone number or email" })
  }
})

app.post('/addRestaurant',async (req,res)=>{
  const restoDetails=req.body;
  if(restoDetails){
    await db.collection('restaurant').insertOne(restoDetails);
    res.json({message: 'restaurant details added in DB'});
  }else{
    res.json({message:'restaurant details is Empty'});
  }
 
})
app.get('/getRestaurant',async (req,res)=>{
  const{location,food,id}=req.query;
  const result=await db.collection('restaurant').find({}).toArray();
  let data=[];
  if(result.length){
    if(location){
    result.forEach(eachResto => {
      if(eachResto.details.address==location){
        data.push(eachResto);
      }
    });
    res.json({message:"All the restaurant",data}); 
  } else if(food){
    result.forEach(eachResto=>{
         for(const key in eachResto.foodItems){
           eachResto.foodItems[`${key}`].forEach((foodItem) => {
             if(foodItem.name==food){
               data.push(eachResto);
             }
           });
         }
    });
    res.json({message:"all the resturant ",data});
  }else if(id){
    result.forEach(eachResto => {
      const resto_id=(eachResto._id).toString();
      if(id==resto_id){
        data.push(eachResto);
      }
    });
    res.json({message:"all the resturant",data});
  } else{
    res.json({message:"all the resturant",result});
    }
  }
  else{
    res.json({message:"No any restaurant available"})
  }

})

app.post('/addOrder', async (req,res)=>{
  const orderDetails=req.body;
  let totalPrice=0;
  orderDetails.cart.forEach((order)=>{
    totalPrice+=order.totalPrice;
  })
  if(orderDetails){
  const order={
    ...orderDetails,
    orderedOn: Date.now(),
      orderStatus :"ORDER_PLACED",
      totalPrice
  }
  const result= await db.collection('orders').insertOne(order);
  const orderId=result.insertedId.toString();
  res.json({message:`order is placed. your ordered id is ${orderId}`}) 
}else{
  res.json({message:'please add food in cart'});
}
})

app.get('/getOrders',async (req,res)=>{
  const {email}=req.query;
  const result = await db.collection('orders').find({email}).sort({orderedOn:-1}).toArray();
  res.json({message:result});
})
const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


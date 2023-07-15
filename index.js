const express = require('express');
const cors = require('cors');
const app = express();
const fs=require('fs');
const { json } = require('express');
app.use(cors());

app.use(express.json());

let credList = [];
readFromFile();


let data=[
  {
    "fullName": "Ashok kumar 20 3",
    "email": "bhaiyarajivkumar@gmail.com",
    "phoneNumber": "08789951035",
    "password": "12345"
  },

  {
    "fullName": "Ashok kumar",
    "email": "brajivkumar@gmail.com",
    "phoneNumber": "035",
    "password": "1234"
  }
]
let jsonData=JSON.stringify(data);


app.post('/signup', (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;

  if (!fullName || !email || !phoneNumber || !password) {
    res.json({ message: "Please enter valid details" });
    return;
  }

  for (let i = 0; i < credList.length; i++) {
    if (credList[i].email === email) {
      res.json({ message: "User already exists" });
      return; // Exit the function if user already exists
    }
  }

  credList.push({ fullName, email, phoneNumber, password });
  let jsonData=JSON.stringify(credList);
  WriteToFile(jsonData);
  res.json({ message: "User created successfully" });

  console.log(credList);
});

app.post('/login',(req,res)=>{
  const {email,password}=req.body;
  for(let i=0;i<credList.length;i++){
    if(credList[i].email==email && credList[i].password==password){
        res.json({message:"login successfully"})
        return;   
    }
    
  }
  res.json({message:"Invalid email or password"})
})


app.post('/forgotPassword',(req,res)=>{
  const{email,phoneNumber,newPassword}=req.body;
  for(let i=0; i<credList.length;i++) {
      if(credList[i].email==email && credList[i].phoneNumber==phoneNumber){
        credList[i].password=newPassword;
        const jsonData=JSON.stringify(credList);
        res.json({message:"password changed succesfully"})
         WriteToFile(jsonData)
        return;
      }
      
  }
   res.json({message:"Invalid Phone number or email"})
    return;
})

function readFromFile() {
  fs.readFile('cred.json',(err,data)=>{
  if(err){
    console.log(`error in reading file : ${err}`);
  }
  else{
    console.log(data.toString());
    credList=JSON.parse(data.toString());
  }
})
}

function WriteToFile(jsonData) {
  fs.writeFile('cred.json',jsonData,(err)=>{
    if(err){
      console.log(`error in writing to file : ${err}`);
    }
    else{
      console.log("data inserted into cred.json")
    }
  })
  
}


const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


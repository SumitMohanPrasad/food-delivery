const fullNameElement = document.getElementById('fullName');
const emailElement = document.getElementById('email');
const phoneNumberElement = document.getElementById('phoneNumber');
const passwordElement = document.getElementById('password');
//console.log(fullNameElement.value, "in starting full name is empty");

//Login 
const emailLogin=document.getElementById('emailLogin');
const passwordLogin= document.getElementById('passwordLogin')
// forgot password
const forgotPassEmailIdElement=document.getElementById('forgotPassEmailId');
const newPasswordElement= document.getElementById('newPassword')
const forgotPassPhoneNumberElement = document.getElementById('forgotPassPhoneNumber');


//option 


axios.get('http://localhost:3001/getRestaurant').then((result)=>{
    console.log(result)
   const restoSelectElement= document.getElementById('restoSelect');
   if(restoSelectElement){
   result.data.result.forEach((eachResto)=>{
     const optionTag=document.createElement('option');
     optionTag.text=eachResto.restaurantName+","+eachResto.details.address;
     optionTag.value=eachResto._id;
     restoSelectElement.appendChild(optionTag);
   }) 
}
const locationChoicesElement=document.getElementById('locationChoices');
if(locationChoicesElement){
    result.data.result.forEach((eachResto)=>{
        const optionTag=document.createElement('option');
        optionTag.text=eachResto.details.address;
        optionTag.value=eachResto.details.address;
        locationChoicesElement.appendChild(optionTag);
      }) 
}

const foodChoicesElement = document.getElementById('foodChoices');
if(foodChoicesElement){
    const listofFood=[];
    result.data.result.forEach((eachResto)=>{
        for(const key in eachResto.foodItems){
            eachResto.foodItems[`${key}`].forEach((foodItem)=>{
                
                if(!listofFood.includes(foodItem.name)){
                    listofFood.push(foodItem.name);
                }
            })
        }
    });
    listofFood.forEach(food=>{
       const optionTag=document.createElement('option');
       optionTag.text=food;
       optionTag.value=food;
       foodChoicesElement.appendChild(optionTag);
    })
}

}).catch((err)=>{
    console.log(err);
})

// function getLocationList(list) {
//     const locationList = [];
//     list.forEach((eachResto)=>{
//         locationList.push(eachResto.details.address);
//     })
//     return locationList;
// }



function signup(){
    console.log(fullNameElement.value, emailElement.value, phoneNumberElement.value, passwordElement.value, "on clicking button");

const data={
    fullName:fullNameElement.value,
    email:emailElement.value,
    phoneNumber:phoneNumberElement.value,
    password:passwordElement.value
}

axios.post('http://localhost:3001/signup',data).then((result)=>{
    console.log(result);
    alert(result.data.message);
    document.getElementById('fullName').value='';
    document.getElementById('email').value='';
    document.getElementById('phoneNumber').value='';
    document.getElementById('password').value='';

}).catch((err)=>{
   console.log(err);  
})
}

let email='';
function initializeEmail() {
    email = localStorage.getItem("user_email");
    if(email && email!=''){
      const logoutElement = document.getElementById('logout');
      if(logoutElement){
          const logoutUserElement=document.createElement('div');
          logoutUserElement.innerHTML=`<span>${email}</span><button onClick="logout()">Logout</button>`
          logoutElement.appendChild(logoutUserElement);
      }
      const goToOrderHistoryElement = document.getElementById('goToOrderHistory');
      if(goToOrderHistoryElement){
          const orderHistoryButton= document.createElement('div');
          orderHistoryButton.innerHTML=`<button onClick="goToHistoryButton()">Go To Order History</button>`
          goToOrderHistoryElement.appendChild(orderHistoryButton);
      }
      const  goToCartElement=document.getElementById('goToCart');
      if(goToCartElement){
          const cartElement=document.createElement('div');
          cartElement.innerHTML=`<button onClick="goToCartButton()">Go To Cart</button>`;
          goToCartElement.appendChild(cartElement);
      }
    }
}
initializeEmail();

function logout() {
    localStorage.removeItem('user_email');
    window.location.href='http://localhost:3001/login-signup';
}

function goToHistoryButton() {
    window.location.href='http://localhost:3001/order-history';
}

function goToCartButton() {
    window.location.href='http://localhost:3001/cart';
}


function login(){
    console.log(emailLogin.value , passwordLogin.value)
    const data={
        email: emailLogin.value,
        password: passwordLogin.value
    }
    axios.post('http://localhost:3001/login',data).then((result)=>{
        console.log(result);
        alert(result.data.message);
       
        if(result.data.message=='login successfull'){
        localStorage.setItem("user_email",emailLogin.value);
         window.location.href= 'http://localhost:3001/cart';
        }
       document.getElementById('emailLogin').value='';
        document.getElementById('passwordLogin').value='';

    }).catch((err)=>{
        console.log(err);
    })
}



function forgetPass(){
    console.log(forgotPassEmailIdElement.value ,newPasswordElement.value,forgotPassPhoneNumberElement.value)
    const data={
        email: forgotPassEmailIdElement.value,
        phoneNumber: forgotPassPhoneNumberElement.value,
        newPassword: newPasswordElement.value
    }
    axios.post('http://localhost:3001/forgotPassword',data).then((result)=>{
        console.log(result);
        alert(result.data.message);
        document.getElementById('forgotPassEmailId').value='';
        document.getElementById('forgotPassPhoneNumber').value='';
        document.getElementById('newPassword').value='';

    }).catch((err)=>{
        console.log(err);
    })
}
function displayFood() {
    const restoSelectElement= document.getElementById('restoSelect');
    axios.get(`http://localhost:3001/getRestaurant?id=${restoSelectElement.value}`).then((result)=>{
    console.log(result)
    const foodListContainer = document.getElementById('food-list');
   foodListContainer.innerHTML='';
    const foodItems=result.data.data[0].foodItems;

      for(const key in foodItems){
          foodItems[`${key}`].forEach((foodItem)=>{
            const foodElement= document.createElement('div');
            foodElement.innerHTML=`<span>
               ${foodItem.name} - Rs ${foodItem.price}
              </span> <button onclick="addToCart('${foodItem.name}', ${foodItem.price},${foodItem.id})">Add to Cart</button>`
              foodListContainer.appendChild(foodElement)

          });
      }
   
}).catch((err)=>{
    console.log(err);
})
    
}

let cart=[];

function addToCart(foodName,foodPrice,foodId) {
    
    let updatedIndex=-1;
    for (let i = 0; i < cart.length; i++) {
       if(cart[i].foodId==foodId){
           updatedIndex=i;
       }
   }
   if(updatedIndex!=-1){
      cart[updatedIndex].quantity+=1;
      cart[updatedIndex].totalPrice+=foodPrice;
   }else{
    cart.push({foodName,foodPrice,foodId,quantity:1, totalPrice:foodPrice});
   }
    refreshCart()
}


function removeFromCart(foodId){
//    cart.filter((eachItem=>{
//        eachItem.foodId!=foodId;
let removeIndex=-1;
 for (let i = 0; i < cart.length; i++) {
     if(cart[i].foodId==foodId){
         removeIndex=i;
     }
 }
 if(removeIndex!=-1){
     if(cart[removeIndex].quantity==1){
        cart.splice(removeIndex,1);
     }
     else{
        cart[removeIndex].quantity-=1;
        cart[removeIndex].totalPrice-=cart[removeIndex].foodPrice;
    }
}
refreshCart();
//    }))
}

function refreshCart() {
    const cartContainer=document.getElementById('cart-container');
    cartContainer.innerHTML='';
    let totalCost=0;
    cart.forEach(cartItem=>{
        const cartItemElement=document.createElement('div');
        cartItemElement.innerHTML=`<span>${cartItem.foodName}- Rs ${cartItem.foodPrice}, ${cartItem.quantity} unit</span>
        <button onClick="removeFromCart(${cartItem.foodId})">Remove</button>
        `;
        totalCost+=cartItem.totalPrice;
        cartContainer.appendChild(cartItemElement);
    })
    if(cart.length){
       const totalCostElement= document.createElement('div');
       totalCostElement.innerHTML=`<span>Total Cost - Rs ${totalCost}</span>
       <button onClick="placeOrder()">Order</button>`;
       cartContainer.appendChild(totalCostElement);
    }
}

function placeOrder() {
    if(email!=''){
        let data={
            cart,email
        }
        axios.post('http://localhost:3001/addOrder',data).then((response)=>{
        alert(response.data.message);   
        console.log(response);
        cart=[];
        refreshCart();
        window.location.href='http://localhost:3001/order-history';
        refreshOrder();
        }).catch((err)=>{
           console.log(err);
        });
    }
    else{
        alert("Login First , then you can order")
    }
}

function refreshOrder() {
    const orderContainer=document.getElementById('orderHistoryContanier');
    axios.get(`http://localhost:3001/getOrders?email=${email}`).then((response)=>{
    response.data.message.forEach((order)=>{
       const orderListElement = document.createElement('div');
       order.cart.forEach((cartItem)=>{
           const cartItemElement= document.createElement('div');
           cartItemElement.innerHTML=`<span>${cartItem.foodName} - Rs ${cartItem.foodPrice} -${cartItem.quantity} units -> Rs Total price Rs ${cartItem.totalPrice} <span>`
           orderListElement.appendChild(cartItemElement)
       })
       const dateAndPriceElement = document.createElement('div')
       const date = new Date(order.orderedOn);
       const isTime = date.toLocaleString('en-In',{timeZone:'Asia/Kolkata'})
       dateAndPriceElement.innerHTML=`<span>Total cost- Rs ${order.totalPrice}and  Order Placed On ${isTime}</span>`
       orderListElement.appendChild(dateAndPriceElement);
       orderContainer.appendChild(orderListElement);
       orderContainer.appendChild(document.createElement('br'))
    })
  }).catch((err)=>{
       console.log(err);
    })
}





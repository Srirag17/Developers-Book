const express = require('express');
const mongoose = require('mongoose');
const devuser = require('./devusermodel');
const Education = require('./educationmodel');
const app = express();
const jwt = require('jsonwebtoken')
const middleware = require('./middleware')
const reviewmodel =require('./reviewmodel')
const cors = require('cors');


app.use(express.urlencoded({extended:true}));
app.use(express. json());
app.use(cors({origin:'*'}));


mongoose.connect('mongodb+srv://admin:admin1@mernproject.fiinum9.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(
    () => console.log('DB connected')
)

app.get('/',(_req,res) => {
    return res.send('DB has been connected')
})


app.post('/register', async (req, res) => {
    try{
        const { fullname,email,mobile,skill,password,confirmpassword } = req.body;
        const exist = await devuser.findOne({email});
        if(exist){
            return res.status(400).send('User already Registered')
        }
        if(password != confirmpassword) {
            return res.status(403).send('Password invalid')
        } 
        let newUser = new devuser({
            fullname,email,mobile,skill,password,confirmpassword
        })
        await newUser.save();
        return res.status(200).send('User Registered');
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.post('/login',async (req,res)=>{
    try{
        const {email,password} = req.body;
        const exist = await devuser.findOne({email});
        if(!exist){
            return res.status(400).send('User Not Exist')
        }
        if(exist.password != password){
            return res.status(400).send('Password Invalid')
        }
        let payload = {
            user : {
                id :exist.id
            }
        }
        jwt.sign(payload,'jwtPassword',{expiresIn:360000000},
        (err,token) => {
            if (err) throw err
            return res.json({token})
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

app.get('/allprofiles',middleware,async (req,res)=>{
    try{
        let allprofiles = await devuser.find();
        return res.json(allprofiles);
    }
    catch(err){
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

app.get('/myprofile',middleware,async(req,res)=>{
    try{
        let user = await devuser.findById(req.user.id)
        return res.json(user);
    }
    catch(err){
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

app.post('/addreview',middleware,async(req,res)=>{
    try{
        const {taskworker,rating} = req.body;
        const exist = await devuser.findById(req.user.id)
        const newReview = new reviewmodel({
            taskprovider:exist.fullname,
            taskworker,rating
        })
        newReview.save();
        return res.status(200).send('Review updated successfully')
    }
    catch(err){
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

app.post('/addeducation', middleware,async(req, res) => {
    const { school, degree, field, fromdate, todate, programdescription } = req.body;
    const education = new Education({ school , degree, field, fromdate, todate, programdescription });       
    education.save()
    .then(result => {
        console.log(result);
        res.status(201).json({ message: 'Education added successfully' });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

app.get('/myreview',middleware,async(req,res)=>{
    try{
        let allreviews= await reviewmodel.find();
        let myreviews= allreviews.filter(review => review.taskworker.toString() === req.user.id.toString())
        return res.status(200).json(myreviews);
    }
    catch(err){
        console.log(err)
        return res.status(500).send('Server Error')
    }
})



app.listen(5000,()=>console.log('Server running..'))
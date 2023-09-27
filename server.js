const express = require('express')
const connectDB = require('./utils/connectDB')
const path = require('path')
const app = express()
app.use(express.json())

app.use(express.urlencoded({extended:true}))
// const result = require('./views/data')

const bcrypt = require('bcrypt')
const School = require('./model/registerationSchema')
const Reg = require('./model/adminReg')


const session = require('express-session')
const flash = require('connect-flash')

connectDB()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

app.use(express.static(path.join(__dirname,'public')))



app.use(session({
secret: 'keyboard cat', 
saveUninitialized:true,
resave:true        
}))

app.use(flash());



const rand = Math.floor(Math.random()*10)+1
const username = 'JosephDev'
const allCourses =['WDD','AutoCad','Graphics Design']
const datas = {
    allCourses: allCourses,
    username: username,
    rand:rand
}

const uniqueVoucherNumber = Math.floor(Math.random() * 1000000).toString();



app.get('/register',(req, res)=>{
    res.render('register.ejs',{ messages: req.flash('info')})
})


app.get('/login', (req, res) =>{
    res.render('login.ejs',{ messages: req.flash('info')})
})

app.get('/forgetpassword', (req, res) =>{
    res.render('forgetpassword.ejs',{ messages: req.flash('info')})
})


app.get('/dashboard',(req,res)=>{
    console.log(foundUser)
    res.render('dashboard.ejs',{foundUser})
})

 app.get('/adminReg',(req, res) =>{
  res.render('adminReg.ejs',{ messages: req.flash('info')})
})


app.get('/adminDashboard', async(req, res) =>{
    const allUsers = await School.find({})
    console.log(allUsers)
  
   res.render('adminDashboard.ejs',{allUsers})
 
 })

 app.get('/delete/:id',async(req,res) =>{
    const{id} = req.params

    await School.findByIdAndDelete({_id:id})   // find this person and delete
    res.redirect('/adminDashboard')
})

app.post('/registration',async(req,res) => {
    try{
        const {username, password, fullname, passport, age, course} = req.body
        console.log({username, password, fullname, age,course})

        const foundUser = await School.findOne({username:username})

        if(foundUser){
            req.flash('info', 'user already exist')
            res.redirect('/register')
        } 
        const hashedPassword = await bcrypt.hash(password,12)
        

        const user = new School({
            username:username,
            password:hashedPassword,
            fullname:fullname,
            passport:passport,
            age:age,
            course:course,
            role:'User',
            active:true
        })
        await user.save()
        console.log({username, hashedPassword})
        res.redirect('/login')
    }catch (error) {
        console.log(error)
    }
    }) 



    let foundUser

    app.post('/login', async (req, res) => {
        const {username, password} = req.body
            // console.log({username, password})
             foundUser = await School.findOne({username:username})

         //console.log(foundUser)
    if (foundUser){
        const user = await bcrypt.compare(password, foundUser.password)
        if(user){
            res.redirect('/dashboard')
        }else{
            req.flash('info', 'username or password incorrect')
            res.redirect('/login')
        }
    }else{
    const foundReg = await Reg.findOne({username:username})
     if(foundReg){
        const user = await bcrypt.compare(password, foundReg.password)
        if(user){
            res.redirect('/adminDashboard')
        }else{
            req.flash('info', 'username or password incorrect')
            res.redirect('/login')
        }
     }
    }
    
    })

 

    app.post('/forgetpassword', async (req, res) => {
        const {username, newpassword} = req.body
             console.log({username, newpassword})
            const foundUser = await School.findOne({username:username})
         //console.log(foundUser)
  if(username.length<10 || newpassword.length<10){
    req.flash('info',' username must be greater then 10 and password must be greater than 10')
    res.redirect('/forgetpassword')
  }
  
  else{
    const hashedPassword = await bcrypt.hash(newpassword,10)
       const user = await School.findOneAndUpdate({username:username}, {$set: {password:hashedPassword}})
         console.log(user)
s
    // res.redirect('/dashboard')

    req.flash('info', 'password updateed')
    res.redirect('/login')
  }
}

    )


app.post('/adminregistration',async(req,res) => {
    try{
        const {username, password} = req.body
        console.log({username, password})

        const foundReg = await Reg.findOne({username:username})

        if(foundReg){
            req.flash('info', 'user already exist')
            res.redirect('/register')
        }
    
        
        const hashedPassword = await bcrypt.hash(password,12)


        const user = new Reg({
            username:username,
            password:hashedPassword,
            role:'Admin',
            active:true
        })
        await user.save()
        console.log({username, hashedPassword})
        res.redirect('/login')
    }catch (error) {
        console.log(error)
    }
    }) 







const PORT = 5000
app.listen(PORT,()=>{
    console.log(`listening to port${PORT}`)
})
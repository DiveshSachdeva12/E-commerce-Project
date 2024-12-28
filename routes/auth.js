const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();



router.get('/register',(req,res)=>{
    res.render('auth/signup');
})

// to actually registe a user
router.post('/register',async (req,res)=>{
    try{

        let{username,email,password,role} = req.body;
       let user= new User({email,username,role});
        const newUser = await User.register(user,password);
        // res.redirect('/login')
        req.login(newUser, function(err){
            if(err){
                return next(err);
                
            }
            req.flash('success','welcome, you are registered successfully');
            return res.redirect('/products')
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/signup')
     }
})

// to get login form 

router.get('/login',(req,res)=>{
    res.render('auth/login');
})

// to actually login via the db
router.post('/login',
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureMessage: true,
    }),
    function(req, res) {
        req.flash('success', `Hello ${req.user.username}`);
        res.redirect('/products'); 
    }           
);


// logout
router.get('/logout', (req, res) => {
    ()=>{
        req.logout();
    }
    req.flash('success','Logged out SUCCESSFULLY');
    res.redirect(`/login`);
});


module.exports = router;

const express = require("express");
const router = new express.Router();
const User = require("./user");
const bcrypt= require('bcryptjs');

router.get("/admin/users",(req,res)=>{

    User.findAll().then(users=>{
        res.render("admin/users/index",{user:users});
    })
    
});

router.get("/admin/users/create",(req,res)=>{

    res.render("admin/users/create");
});

router.post("/users/create",(req,res)=>{

    var email = req.body.email;
    var senha = req.body.senha;

    User.findAll({
        where:{email:email}
    }).then(user=>{
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(senha,salt);
        
            User.create({
                email:email,
                senha:hash
            }).then(()=>{
                res.redirect("/");
            }).catch((err)=>{
                res.redirect("/");
            })
        
            
        } else {
            res.redirect("/admin/users/create");
        }
    })

   });


   router.get("/login",(req,res)=>{
        res.render("admin/users/login");
   });



   router.post("/authenticate",(req,res)=>{
    var email = req.body.email;
    var senha = req.body.senha;

    User.findOne({where:{email:email}}).then(user=>{
        if (user != undefined) {// se o email existir
            //validados a senha
            var correct =bcrypt.compareSync(senha, user.senha);
            if (correct) {
                
                req.session.user ={
                    id:user.id,
                    email:user.email
                }
                res.redirect("/admin/categories"); 
            } else {
                res.redirect("/login");    
            }
            
        } else {
            res.redirect("/login");
        }
    })
   });


   router.get("/logout",(req,res)=>{
    req.session.user = undefined;
    res.redirect("/");
   })
module.exports = router;
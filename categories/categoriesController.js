const express = require('express')
const router = express.Router();
const category = require('./Categories');
const slugify = require('slugify');
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories/new",adminAuth,(req,res)=>{
    res.render("admin/categories/new");
    });

    router.post("/categories/save",adminAuth,(req,res)=>{
        var title = req.body.title;        
        if (title != undefined) {// cadastrando categoria
            category.create({
                title:title,
                slug:slugify(title)// transforma String em url
            }).then(()=>{
                res.redirect("/admin/categories");
            })
        }else{
            res.redirect("/admin/categories/new");
        }

    });

 router.get("/admin/categories/",adminAuth,(req,res)=>{
    //listando categorias
    category.findAll().then(categories=>{
        res.render("admin/categories/index",{categories:categories});
    })
    
 });  


 router.post("/categories/delete",adminAuth,(req,res)=>{
    var id = req.body.id;
    if (id != undefined) {// se nao for nulo

        if (!isNaN(id)) {// se for um numero 
            
            category.destroy({// Elimina a categoria onde o id for igual ao id passado
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/categories");
            })

        }else{// se nao for um numero
            res.redirect("/admin/categories");
        }


    }else{ //se for nulo

        res.redirect("/admin/categories");
    }

 });


 router.get("/admin/categories/edit/:id",adminAuth,(req,res)=>{
    var id = req.params.id;//recebi  um id pela rota
    category.findByPk(id)//faz consulta pelo id
    .then(categorie=>{

        if (isNaN(id)) {
            res.redirect("/admin/categories");
        }
        if (categorie != undefined) {
            
            res.render("admin/categories/edit",{categoria:categorie});
        }else{
            res.redirect("/admin/categories");
        }
    }).catch(err=>{
        res.redirect("/admin/categories");
    })
 });


 router.post("/categories/update",adminAuth,(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    category.update({title:title, slug:slugify(title)},{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/categories");
    })
 })
module.exports = router; 
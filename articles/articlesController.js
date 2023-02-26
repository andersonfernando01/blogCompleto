const express = require('express')
const router = express.Router();
const category = require('../categories/Categories');
const articles = require("./Article");
const slugify = require("slugify");
const { render } = require('ejs');
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles",adminAuth,(req,res)=>{

   articles.findAll({
    include:[{model:category}]
   }).then(articles =>{

    res.render("admin/articles/index",{articles:articles});
   })
})

router.get("/admin/articles/new",adminAuth,(req,res)=>{
    category.findAll().then(categories =>{

        res.render("admin/articles/new",{categories:categories});
    })

});

router.post("/articles/save",adminAuth, (req,res)=>{
var title = req.body.title;
var body = req.body.body;
var category = req.body.category;

    articles.create({
            title:title,
            slug:slugify(title),
            body:body,
            categoryId:category
        }).then(()=>{
        res.redirect("/admin/articles")
    })
});


router.post("/articles/delete",adminAuth,(req,res)=>{
    var id = req.body.id;
    if (id != undefined) {// se nao for nulo

        if (!isNaN(id)) {// se for um numero 
            
            articles.destroy({// Elimina a categoria onde o id for igual ao id passado
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/articles");
            })

        }else{// se nao for um numero
            res.redirect("/admin/articles");
        }


    }else{ //se for nulo

        res.redirect("/admin/articles");
    }

 });

 router.get("/admin/articles/edit/:id",adminAuth,(req,res)=>{

    var id =req.params.id;
    articles.findByPk(id).then(article=>{
    if (article != undefined) {
        category.findAll().then(categories=>{
            res.render("admin/articles/edit",{article:article,categories:categories});
        })
        
    }else{
        res.redirect("/");
    }

    }).catch(err=>{
        res.redirect("/");
    })
 });

 router.post("/articles/update",adminAuth,(req,res)=>{

    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    articles.update({title:title, body:body,category:category,slug:slugify(title)},{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles");
    }).catch(err =>{
        res.redirect("/");
    });
 });



 // logica de paginacao
 router.get("/articles/page/:num",(req,res)=>{

var page = req.params.num;
var offset = 0

if (isNaN(page) || page ==1) {
    offset =0
} else {
    offset= (parseInt(page)-1)*4;
}
articles.findAndCountAll({
    limit: 4,
    offset:offset // mostra os elementos apartir de n 
}).then(articles=>{
    var next;
    if (offset+ 4 >= articles.count) {
        next = false
    } else {
    next =true        
    }

    var result ={
        page:parseInt(page),//pagina actual
        next:next,//proxima pagina
        articles:articles
    }

    category.findAll({
        order:[
            ['id','DESC']
        ]
    }).then(categories=>{
        res.render("admin/articles/page",{result:result,categories:categories})
    })

    
})

 });

module.exports = router;
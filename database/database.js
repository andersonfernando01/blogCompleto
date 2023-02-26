const Sequelize = require('sequelize');
                                //databse  //user //password
const  connection = new Sequelize('blogcrud','root','',{
    host:'localhost',
    dialect:'mysql',
    timezone:'+01:00'
})

module.exports =connection;
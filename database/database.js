const Sequelize = require('sequelize')


const connection = new Sequelize('guiaperguntas','root','churrasco71',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection
const express = require('express');
const path = require('path')
//const chalk = require('chalk');
const debug = require('debug') ('app')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const sql = require('mssql');
const recipeRouter = express.Router();



const config = {
    user: 'h.amin.20',
    password: 'Hat01155989838',
    server: 'libproj.database.windows.net',
    database: 'recipeLib',
}
sql.connect(config).catch((err) => debug(err));


const app = express();
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))

nav = [
    {
        link: '/addRecipe', 
        name: 'Add New Recipe'
    },
    {
        link: '/recipeList',
        name: 'Recipe Library'
    },
    

]

app.get('/', function(req, res){
    res.render('index',
    {
        nav
    }
    )
})

app.get('/addRecipe', function(req, res){
    res.render('addRecipe',
    {
        nav
    }
    )
})



app.get('/fullRecipe/:id', function(req, res){
    (async function query() {
        const id = req.params.id;
        const request = new sql.Request();
        const result = await request.input('id', sql.Int, id).query('select * from recipes where id = @id')
        res.render('fullRecipe',
            {
                nav,
                recipes: result.recordset
            }
        )
    })();
})

app.get('/recipeList', function(req, res){
    (async function query() {
        const request = new sql.Request();
        const result = await request.query('select * from recipes');
        res.render('recipeList',
            {
                nav,
                recipes: result.recordset
            }
        )
    })();
})

app.post('/addRecipe', function(req, res){
    console.log(req.body);
    
    (async function query() {
        const request = new sql.Request();
        const result = await request.query(`insert into recipes (recipeName, ingredients, instructions) values ('${req.body.recipeName}', '${req.body.ingredients}', '${req.body.instructions}')`);
    
        res.redirect('/addRecipe');
    })();
})


    
module.exports = recipeRouter;
app.listen(4000);
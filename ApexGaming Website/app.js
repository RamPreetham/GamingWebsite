//require modules
const express = require('express');
const morgan = require('morgan');
const {v4: uuidv4} = require('uuid');
const methodoveride = require('method-override');
const traderoute = require('./routes/traderoute');
const mainroute = require('./routes/mainroute');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const flash = require('connect-flash');
const user = require('./models/user');
//create app
const app = express();

//configure app
const port = 3000;
const host = 'localhost';
app.set('view engine', 'ejs');

//connect to database
mongoose.connect('mongodb://localhost:27017/apex', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
 }, err => {
    if(err) throw err;
    console.log('Connected to MongoDB!!!')
 })

//mount middleware
app.use(express.static('public')); //middleware function to use static files like images and stylesheets.
app.use(express.urlencoded({extended:true})); // middleware fucntion to navigating through url when values are posted.
app.use(morgan('tiny')); //middle ware function to log all requests.
app.use(methodoveride('_method')); //to handle put and delete HTTP requests.


app.use(session({
    secret: 'mknbhvhbkj,mkjhj',
    resave: false, // no need to save session unless it is updated.
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},//lifetime of cookie- 60 mins
    store: new mongoStore({mongoUrl:'mongodb://localhost:27017/apex'}) //stores session in db with default collection name as sessions.
}));

app.use(flash());
app.use((req,res,next)=>{
    console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})
//initial route
app.get('/', (req,res)=> {
    res.render('newindex');
})

// requests of url 
app.use('/items', traderoute);
app.use('/nav',mainroute);

//404 error handler
app.use((req,res,next)=>{
    let error = new Error('Server cannot locate ' + req.url);
    error.status = 404;
    next(error);
    });
    
    
    //error handler
    // app.use((err, req, res, next)=>{
    //   if(!err.status){
    //       err.status = 500;
    //        err.message = ("Internal server error");
    //    }
    //    res.status(err.status);
    //    res.render('error',{error:err});
    //}); 
//start the server
app.listen(port, host, (req,res)=>{
    console.log("server is running on port:"+ port);
})

//express server
require('./models/db');
var express= require('express');
const exphbs = require('express-handlebars');
var app= express();
const employeeController = require('./controller/employeeController');

//schema required
var register = require('./schemas/registration_schema');
var nearby= require('./schemas/donorsnear_schema');
var Event = require('./schemas/event');
const adminRouter = require('./models/admin.router.js');
//mongoose connection
var mongoose= require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });

//node mailer
const mailer = require('nodemailer');
const transport = require('nodemailer-sendgrid-transport');

const transporter = mailer.createTransport(transport({
    auth :{
        api_key : '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'

    }
    
}));

//View Engine
app.set("view engine", "hbs");


//body parser 
var bodyparser= require('body-parser');
app.use(bodyparser.urlencoded({ extended:true }));
app.use('/admin', adminRouter);

//path 
var path= require('path');

//middleware
app.use(express.static(path.join(__dirname,"public")));

//var router= require('./route1');
//app.use(router);

//router yo home page
var home_routes= require('./home_route');
app.use(home_routes);

var login = require('./controller/login');
app.use('/login', login);
//router to donor registration
var reg_routes= require('./registration_route');
app.use(reg_routes);
//router to donors nearby
var donornearby_routes= require('./donors_nearby');
app.use(donornearby_routes);
//router to events//
var event_route = require('./event_route');
app.use('/event',event_route);
//router for admin panel
app.use('/employee', employeeController);
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.get('/event/add',function(req,res){
    res.render('event')
});

app.get('/event/:id', async(req, res)=>{
    let eventid = await Event.findOne({_id:req.params.id});
    eventid.isApproved = true;
    eventid.save();
    email= eventid.organizer;
    transporter.sendMail({
        to: email,
        from: 'youthforblood.com',
        subject: 'from youth for blood',
        html: '<h1>mail message</h1>'
    
    
    
    });
    return res.render('success');

  
});

/*app.get('/registredUsers', (req, res) => {
    register.find({}, (err, data) => {
        //find{ name: req.name}
        // data = data[6];
        console.log(data);
        // res.render("1", { name: data.name,age:data.age,gender:data.gender, fileName: data.imageLocation });
        res.render('1', {data: data})
    });
    
})*/

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});


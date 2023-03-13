const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Setting up express function
const app = express();

// using public, ejs view engine, bodyparser
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// connecting to DB + Creating new DB
mongoose.set('strictQuery', true);
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://admin-moy:admin@cluster0.dwapihe.mongodb.net/?retryWrites=true&w=majority');
};

// mongoose setup schema and shit
const activitySchema = new mongoose.Schema({
    activity: String
});

// Creating Activity model - The class to construct documents
const Activity = mongoose.model('activity', activitySchema);

// Creating document


// let defaultActivities =  [activity1,activity2,activity3];
// Saving to DB
// Activity.insertMany(defaultActivities, function(error, docs) {
//     console.log("Insert many done");
// });

app.get('/', async function(req, res) {
    const activities = await Activity.find();
    // console.log(activities);
    res.render('index', { items: activities });
})

app.post('/', function(req, res){
    const activity = new Activity({
        activity: req.body.itemAdded
    });
    activity.save((err, saveditem) => {
        if (err) return console.error(err);
        console.log("Successfully added new item");
        console.log("Current collections:")
        console.log(Activity.find((err, activitiesData) => {
            if (err) {
                return console.error(err);
            } else {
                console.log(activitiesData);
            }
        }));
    });
    res.redirect('/');
});

app.post('/delete', function(req,res) {
    // console.log(req.body);
    Activity.findByIdAndDelete(req.body.id, function(e){
        if (e) {
            console.log(e);
        } else {
            console.log("success!");
            console.log("Current collections:")
            console.log(Activity.find((err, activitiesData) => {
                if (err) {
                    return console.error(err);
                } else {
                    console.log(activitiesData);
                }
            }));
        }
    });
    res.redirect('/');
    });

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started on port 3000');
})
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3030;


// ============================================================
// Middleware
// ============================================================

app.use(cors());

app.use(
    require('body-parser').urlencoded({
        extended: false
    })
);


// ============================================================
// Load JSON data
// ============================================================

const reviews_data = JSON.parse(
    fs.readFileSync('./data/reviews.json', 'utf8')
);

const dealerships_data = JSON.parse(
    fs.readFileSync('./data/dealerships.json', 'utf8')
);


// ============================================================
// Connect to MongoDB
// ============================================================

mongoose.connect(
    'mongodb://mongo_db:27017/',
    {
        dbName: 'dealershipsDB'
    }
)
.then(() => {
    console.log('Connected to MongoDB');

    // Clear existing data and load the provided data
    return Promise.all([
        Reviews.deleteMany({}),
        Dealerships.deleteMany({})
    ]);
})
.then(() => {

    return Promise.all([
        Reviews.insertMany(reviews_data.reviews),
        Dealerships.insertMany(dealerships_data.dealerships)
    ]);

})
.then(() => {
    console.log('Database data loaded successfully');
})
.catch((error) => {
    console.error('MongoDB error:', error);
});


// ============================================================
// Mongoose Models
// ============================================================

const Reviews = require('./review');
const Dealerships = require('./dealership');


// ============================================================
// Home
// ============================================================

app.get('/', async (req, res) => {

    res.send(
        'Welcome to the Mongoose API'
    );

});


// ============================================================
// Fetch ALL reviews
// ============================================================

app.get('/fetchReviews', async (req, res) => {

    try {

        const documents = await Reviews.find();

        res.json(documents);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error fetching documents'
        });

    }

});


// ============================================================
// Fetch reviews for a particular dealership
// ============================================================

app.get('/fetchReviews/dealer/:id', async (req, res) => {

    try {

        const dealerId = Number(req.params.id);

        const documents = await Reviews.find({
            dealership: dealerId
        });

        res.json(documents);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error fetching documents'
        });

    }

});


// ============================================================
// Fetch ALL dealerships
// ============================================================

app.get('/fetchDealers', async (req, res) => {

    try {

        const documents = await Dealerships.find();

        res.json(documents);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error fetching dealerships'
        });

    }

});


// ============================================================
// Fetch dealerships by state
// ============================================================

app.get('/fetchDealers/:state', async (req, res) => {

    try {

        const state = req.params.state;

        const documents = await Dealerships.find({
            state: state
        });

        res.json(documents);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error fetching dealerships'
        });

    }

});


// ============================================================
// Fetch dealership by ID
// ============================================================

app.get('/fetchDealer/:id', async (req, res) => {

    try {

        const dealerId = Number(req.params.id);

        const document = await Dealerships.findOne({
            id: dealerId
        });

        if (!document) {

            return res.status(404).json({
                error: 'Dealership not found'
            });

        }

        res.json(document);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error fetching dealership'
        });

    }

});


// ============================================================
// Insert a review
// ============================================================

app.post(
    '/insert_review',
    express.raw({
        type: '*/*'
    }),
    async (req, res) => {

        try {

            const data = JSON.parse(req.body);

            // Get the latest review ID
            const documents = await Reviews
                .find()
                .sort({
                    id: -1
                });

            let new_id = 1;

            if (documents.length > 0) {
                new_id = documents[0].id + 1;
            }

            const review = new Reviews({

                id: new_id,

                name: data.name,

                dealership: data.dealership,

                review: data.review,

                purchase: data.purchase,

                purchase_date: data.purchase_date,

                car_make: data.car_make,

                car_model: data.car_model,

                car_year: data.car_year

            });

            const savedReview = await review.save();

            res.json(savedReview);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: 'Error inserting review'
            });

        }

    }
);


// ============================================================
// Start Express server
// ============================================================

app.listen(
    port,
    () => {

        console.log(
            `Server is running on http://localhost:${port}`
        );

    }
);
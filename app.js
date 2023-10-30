const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas connection string
const uri = 'youruri';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/form.html');
});

// Handle form submission
app.post('/process_data', (req, res) => {
    const { income, expenses, electricity, food, other } = req.body;

    // Create a document to insert into the MongoDB collection
    const data = {
        income: parseFloat(income),
        expenses: parseFloat(expenses),
        electricity: parseFloat(electricity),
        food: parseFloat(food),
        other: parseFloat(other),
    };

    // Connect to MongoDB Atlas and insert the document
    const client = new MongoClient(uri);

    client.connect()
        .then(() => {
            const db = client.db('budget');
            const collection = db.collection('budget');

            return collection.insertOne(data);
        })
        .then(() => {
            res.status(200).send('Data inserted successfully');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Database connection or data insertion error');
        })
        .finally(() => {
            client.close();
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

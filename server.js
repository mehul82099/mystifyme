const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load mock data
const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8'));

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Mystify Me — Homepage', currentRoute: '/' });
});

app.get('/story', (req, res) => {
    res.render('story', { title: 'Mystify Me — Our Story', currentRoute: '/story' });
});

app.get('/chocolates', (req, res) => {
    res.render('chocolates', { 
        title: 'Mystify Me — Chocolates', 
        currentRoute: '/chocolates',
        bases: productsData.bases
    });
});

app.get('/mixins', (req, res) => {
    res.render('mixins', { 
        title: 'Mystify Me — Mix-ins', 
        currentRoute: '/mixins',
        mixins: productsData.mixins 
    });
});

app.get('/order', (req, res) => {
    res.render('order', { title: 'Mystify Me — Order Now', currentRoute: '/order' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

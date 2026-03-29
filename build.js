const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const viewsDir = path.join(__dirname, 'views');
const dataFile = path.join(__dirname, 'data', 'products.json');
const outDir = path.join(__dirname, 'docs');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Copy public directory to www
function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        const item = path.join(from, element);
        if (fs.lstatSync(item).isFile()) {
            fs.copyFileSync(item, path.join(to, element));
        } else {
            copyFolderSync(item, path.join(to, element));
        }
    });
}
copyFolderSync(path.join(__dirname, 'public'), outDir);

// Read data
const productsData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// EJS rendering options
const pages = [
    { template: 'index.ejs', output: 'index.html', context: { title: 'Mystify Me', currentRoute: '/' } },
    { template: 'story.ejs', output: 'story.html', context: { title: 'Mystify Me - Story', currentRoute: '/story' } },
    { template: 'chocolates.ejs', output: 'chocolates.html', context: { title: 'Mystify Me - Chocolates', currentRoute: '/chocolates', bases: productsData.bases } },
    { template: 'mixins.ejs', output: 'mixins.html', context: { title: 'Mystify Me - Mix-ins', currentRoute: '/mixins', mixins: productsData.mixins } },
    { template: 'order.ejs', output: 'order.html', context: { title: 'Mystify Me - Order', currentRoute: '/order' } }
];

// Render loop
pages.forEach(page => {
    const templatePath = path.join(viewsDir, page.template);
    ejs.renderFile(templatePath, page.context, (err, str) => {
        if (err) {
            console.error('Error rendering ' + page.template, err);
            return;
        }
        
        let outputStr = str;
        // Fix up static routing for HTML links
        outputStr = outputStr.replace(/href="\/"/g, 'href="index.html"');
        outputStr = outputStr.replace(/href="\/story"/g, 'href="story.html"');
        outputStr = outputStr.replace(/href="\/chocolates"/g, 'href="chocolates.html"');
        outputStr = outputStr.replace(/href="\/mixins"/g, 'href="mixins.html"');
        outputStr = outputStr.replace(/href="\/order"/g, 'href="order.html"');

        // Fix up assets for GitHub Pages root subpaths (HTML attrs)
        outputStr = outputStr.replace(/href="\/css\//g, 'href="./css/');
        outputStr = outputStr.replace(/src="\/images\//g, 'src="./images/');
        outputStr = outputStr.replace(/src="\/js\//g, 'src="./js/');
        outputStr = outputStr.replace(/href="\/favicon.ico"/g, 'href="./favicon.ico"');

        // Catch-all for JS string literal absolute paths
        outputStr = outputStr.replace(/'\/images\//g, "'./images/");
        outputStr = outputStr.replace(/'\/css\//g, "'./css/");
        outputStr = outputStr.replace(/'\/js\//g, "'./js/");
        outputStr = outputStr.replace(/'\/mixins'/g, "'mixins.html'");
        outputStr = outputStr.replace(/'\/chocolates'/g, "'chocolates.html'");
        outputStr = outputStr.replace(/'\/story'/g, "'story.html'");
        outputStr = outputStr.replace(/'\/order'/g, "'order.html'");
        outputStr = outputStr.replace(/"\/mixins"/g, '"mixins.html"');

        // Fix up JS redirects mapping
        outputStr = outputStr.replace("window.location.href = '/order'", "window.location.href = 'order.html'");
        
        fs.writeFileSync(path.join(outDir, page.output), outputStr);
        console.log(`Rendered ${page.output}`);
    });
});

console.log('Static build complete in /docs');

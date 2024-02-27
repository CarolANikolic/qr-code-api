const express = require('express');
const qr = require('qr-image');
const fs = require('fs');
const { fileURLToPath } = require('url');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Set-up Express framework
const app = express();
// Define Port
const port = process.env.PORT || 3000;
app.use(cors());

// Get current file path
const currentProject = __dirname;
// Go up two levels to the project root
const projectRoot = path.resolve(currentProject, '../..');

let URLInput;

// Serve client side static files
app.use(express.static(path.join(projectRoot, '/qr-code-client/public')));

// Define HomePage path
const homePage = path.join(projectRoot, '/qr-code-client/public/index.html');
// Define confirmation page path
const confirmationPage = path.join(projectRoot, "/qr-code-client/public/confirmation.html");

const generateQRCode = (req, res, next) => {

    let qr_png = qr.image(URLInput);
    let outputQR = path.join(projectRoot, "/qr-code-client/public/images/outputQR", "qr-img.png");
    qr_png.pipe(fs.createWriteStream(outputQR));
    
    fs.writeFile("URL.txt", URLInput, (err) => {
        if (err) throw err;
    });
    next();
};

app.get("/", (req, res) => {
    res.sendFile(homePage);
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/submit", (req, res, next) => {
    URLInput = req.body.URL;
    next();
});

app.use(generateQRCode);

app.post("/submit", (req, res) => {
    res.sendFile(confirmationPage);
});

// Set-up localhost
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

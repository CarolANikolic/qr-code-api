const express = require('express');
const qr = require('qr-image');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

// Define the endpoint for generating QR code
app.post('/generate-qrcode', (req, res) => {
    const url = req.body.url;
    try {
        if (url) {
         // Generate the QR code image dynamically
    const qr_png = qr.imageSync(url, { type: 'png' });

    // Convert the image data to base64 due to Vercel read-only file system
    const qrBase64 = qr_png.toString('base64');

    // Respond with data URL of the QR code image
    res.send(`data:image/png;base64,${qrBase64}`);
        }
    } catch (error) {
        console.log('Error generating qr code:', error)
        res.sendStatus(500)
    }
});

// Set up the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

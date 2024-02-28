const express = require('express');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
// Configure CORS to allow requests from all origins
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

const uploadsDirectory = path.join(__dirname, 'uploads');
// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory);
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(uploadsDirectory)));

// Define the endpoint for generating QR code
app.post('/generate-qrcode', (req, res) => {
    const url = req.body.url;

    // Generate the QR code image dynamically
    const qr_png = qr.imageSync(url, { type: 'png' });

    // Convert the image data to base64
    const qrBase64 = qr_png.toString('base64');

    // Respond with the base64 string of the QR code image
    res.send(`data:image/png;base64,${qrBase64}`);
});

// Set up the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

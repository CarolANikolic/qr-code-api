const express = require('express');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// Configure CORS to allow requests from all origins
app.use(cors());
const port = process.env.PORT || 3000;

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
    const qr_png = qr.image(url);
    const qrImgPath = path.join(uploadsDirectory, 'qr-img.png');

    // Pipe the QR code image to a writable stream to save it
    qr_png.pipe(fs.createWriteStream(qrImgPath)).on('finish', () => {
        // Respond with the file path where the client can access the saved QR code image
        res.send('/uploads/qr-img.png'); 
    });
});

// Set up the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

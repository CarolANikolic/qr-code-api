const express = require('express');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
app.use(cors())
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// Define the endpoint for generating QR code
app.post('/generate-qrcode', (req, res) => {
    const url = req.body.url;
    const qr_png = qr.image(url);
    const outputQRPath = path.join(__dirname, '..', 'qr-code-client', 'public', 'images', 'outputQR', 'qr-img.png');

   // Pipe the QR code image to a writable stream to save it
    qr_png.pipe(fs.createWriteStream(outputQRPath)).on('finish', () => {
    // Respond with the file path where the client can access the saved QR code image
    const clientLocalPathToQr = path.join('public', 'images', 'outputQR', 'qr-img.png');
    res.send(clientLocalPathToQr);
});
});

// Set up the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

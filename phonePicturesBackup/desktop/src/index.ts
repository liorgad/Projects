import express from 'express';
import QRCode from 'qrcode';
import { networkInterfaces } from 'os';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3000;

// Add middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize multer for file uploads
const upload = multer({ dest: 'temp_uploads/' });

// Default save directory
let saveDirectory = path.join(process.cwd(), 'uploads');

// Create directories if they don't exist
if (!fs.existsSync('temp_uploads')) {
    fs.mkdirSync('temp_uploads');
}
if (!fs.existsSync(saveDirectory)) {
    fs.mkdirSync(saveDirectory);
}

// Get local IP address
function getLocalIP(): string {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        const interfaces = nets[name];
        if (!interfaces) continue;
        
        for (const net of interfaces) {
            // Skip internal and non-IPv4 addresses
            if (!net.internal && net.family === 'IPv4') {
                return net.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();
const serverUrl = `http://${localIP}:${port}`;

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded');
        return;
    }

    const tempPath = req.file.path;
    const targetPath = path.join(saveDirectory, req.file.originalname);

    fs.rename(tempPath, targetPath, err => {
        if (err) {
            console.error('Error moving file:', err);
            res.status(500).send('Error saving file');
            return;
        }
        res.send('File uploaded successfully');
    });
});

// Handle save directory settings
app.post('/settings', (req, res) => {
    const { directory } = req.body;
    if (!directory) {
        res.status(400).send('No directory specified');
        return;
    }

    try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        saveDirectory = directory;
        res.send('Settings updated successfully');
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).send('Error updating settings');
    }
});

app.get('/', async (req, res) => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(serverUrl);
        
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Local Server QR Code</title>
                <style>
                    body {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    .container {
                        text-align: center;
                        max-width: 800px;
                        width: 100%;
                    }
                    img {
                        max-width: 300px;
                        margin: 20px 0;
                    }
                    .settings {
                        margin-top: 40px;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                    }
                    .upload-form {
                        margin-top: 20px;
                    }
                    input[type="text"] {
                        width: 80%;
                        padding: 8px;
                        margin: 10px 0;
                    }
                    button {
                        padding: 8px 16px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #0056b3;
                    }
                    .current-dir {
                        margin-top: 10px;
                        font-size: 0.9em;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>File Upload Server</h1>
                    <img src="${qrCodeDataUrl}" alt="QR Code">
                    <p>Server URL: ${serverUrl}</p>
                    
                    <div class="upload-form">
                        <h2>Upload File</h2>
                        <form action="/upload" method="post" enctype="multipart/form-data">
                            <input type="file" name="file" required>
                            <button type="submit">Upload</button>
                        </form>
                    </div>

                    <div class="settings">
                        <h2>Settings</h2>
                        <p class="current-dir">Current save directory: ${saveDirectory}</p>
                        <form id="settingsForm">
                            <input type="text" id="directory" placeholder="Enter save directory path">
                            <button type="submit">Update Directory</button>
                        </form>
                    </div>
                </div>

                <script>
                    document.getElementById('settingsForm').addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const directory = document.getElementById('directory').value;
                        try {
                            const response = await fetch('/settings', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ directory }),
                            });
                            if (response.ok) {
                                alert('Settings updated successfully');
                                location.reload();
                            } else {
                                alert('Error updating settings');
                            }
                        } catch (error) {
                            alert('Error updating settings');
                        }
                    });
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error generating QR code');
    }
});

app.listen(port, () => {
    console.log(`Server running at ${serverUrl}`);
    console.log(`Files will be saved to: ${saveDirectory}`);
});

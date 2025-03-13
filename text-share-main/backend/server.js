const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Document Schema
const documentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    text: { type: String, required: true },
});

const Document = mongoose.model('Document', documentSchema);

// Create Document
app.post('/api/documents', async (req, res) => {
    const { name, text } = req.body;
    try {
        const newDocument = new Document({ name, text });
        await newDocument.save();
        res.status(201).json({ message: 'Document created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating document', error });
    }
});

// Get Document by Name
app.get('/api/documents/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const document = await Document.findOne({ name });
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving document', error });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
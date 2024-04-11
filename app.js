const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define schema
const Schema = mongoose.Schema;
const myDataSchema = new Schema({
  name: String,
  project: String,
  url: String,
  build: String
});

const MyData = mongoose.model('MyData', myDataSchema);

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ["GET","POST"]
}));

app.post('/submit-form', async (req, res) => {
  try {
    const { name, project, url, build } = req.body;
    const isExists = await MyData.findOne({ project });

    if (isExists) {
      return res.status(400).json({ error: 'Project name already exists' });
    }

    const myData = new MyData({
      name,
      project,
      url,
      build
    });

    if (!name || !project || !url || !build) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await myData.save();
    res.status(200).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error('Error storing data in MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
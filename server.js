const express = require('express');
const cors = require('cors');
const tf = require('@tensorflow/tfjs-node');
const { createCanvas, Image } = require('canvas');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Global variable to store the loaded model
let model;

// Function to load the model
async function loadModel() {
  try {
    model = await tf.loadLayersModel('file://./model/model.json');
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
  }
}

// Function to process base64 image
async function processImage(base64Image) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64Image;
  });
}

// Function to prepare image for classification
function prepareImage(img) {
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  // Convert to tensor and preprocess to match ml5.js format
  const tensor = tf.browser.fromPixels(canvas)
    .resizeNearestNeighbor([224, 224])
    .div(255.0)
    .expandDims();
  
  return tensor;
}

const labels = ["Hambúrguer", "Pizza", "Food"];

// Classification endpoint
app.post('/classify', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    if (!model) {
      return res.status(500).json({ error: 'Model not loaded' });
    }
    
    // Process the base64 image
    const img = await processImage(image);
    const tensor = prepareImage(img);
    
    // Get prediction
    const predictions = await model.predict(tensor).array();
    const results = predictions[0].map((confidence, index) => ({
      label: labels[index],
      confidence: confidence
    }));
    
    // Sort by confidence and get the top result
    results.sort((a, b) => b.confidence - a.confidence);
    
    // Clean up
    tensor.dispose();
    
    res.json({
      success: true,
      predictions: results
    });
    
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Classification failed' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await loadModel();
});
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');
const Restaurant = require('../models/Restaurant');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/image-search
router.post('/', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;

  try {
    // Call Python script to predict label
    exec(`python3 classify_food.py ${imagePath}`, async (err, stdout, stderr) => {
      if (err) return res.status(500).json({ error: 'Prediction failed' });

      const label = stdout.trim().toLowerCase();
      console.log(`🍝 Predicted label:`, label);

      // Find restaurants matching this cuisine
      const matches = await Restaurant.find({
        cuisines: new RegExp(label, 'i'),
      });

      res.json({ label, matches });
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    fs.unlinkSync(imagePath); // Clean up
  }
});

module.exports = router;

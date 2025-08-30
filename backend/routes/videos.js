const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Mock videos data
let videos = [
  '/Aj_Creativity/vedios/ved-12.mp4',
  '/Aj_Creativity/vedios/WhatsApp Video 2025-07-06 at 16.46.01_93136f2b.mp4',
  '/Aj_Creativity/vedios/WhatsApp Video 2025-07-06 at 16.46.00_c3cb3495.mp4',
  '/Aj_Creativity/vedios/WhatsApp Video 2025-07-06 at 16.46.00_14e6bc6c.mp4',
];

// Get all videos
router.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Add a new video
router.post('/', (req, res) => {
  try {
    const { videoPath } = req.body;
    
    if (!videoPath) {
      return res.status(400).json({
        success: false,
        message: 'Video path is required'
      });
    }
    
    // Check if video already exists
    if (videos.includes(videoPath)) {
      return res.status(400).json({
        success: false,
        message: 'Video already exists'
      });
    }
    
    // Add new video
    videos.push(videoPath);
    
    res.status(201).json({
      success: true,
      message: 'Video added successfully',
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Delete a video
router.delete('/:index', (req, res) => {
  try {
    const index = parseInt(req.params.index);
    
    if (isNaN(index) || index < 0 || index >= videos.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video index'
      });
    }
    
    // Remove video at specified index
    const deletedVideo = videos[index];
    videos = videos.filter((_, i) => i !== index);
    
    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
      deletedVideo,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Update video order
router.put('/reorder', (req, res) => {
  try {
    const { newOrder } = req.body;
    
    if (!newOrder || !Array.isArray(newOrder)) {
      return res.status(400).json({
        success: false,
        message: 'New order array is required'
      });
    }
    
    // Validate that newOrder contains all the same videos
    if (newOrder.length !== videos.length || 
        !newOrder.every(video => videos.includes(video))) {
      return res.status(400).json({
        success: false,
        message: 'New order must contain all the same videos'
      });
    }
    
    // Update videos array with new order
    videos = [...newOrder];
    
    res.status(200).json({
      success: true,
      message: 'Videos reordered successfully',
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;
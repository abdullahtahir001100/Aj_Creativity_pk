import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard-header.scss'; // Import the SCSS file

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dwnnadeb0';
const CLOUDINARY_UPLOAD_PRESET_VIDEOS = 'aj_creativity_video_preset'; 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

// Updated API URL to match your backend's new root path
const API_URL = 'https://server-nine-kappa-75.vercel.app/api/videos';

const VideoDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ title: '', videoFile: null });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const { data } = await response.json(); // Correctly destructure to get the array
      setVideos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVideo(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    setNewVideo(prevState => ({ ...prevState, videoFile: e.target.files[0] }));
  };

  const uploadVideo = async (file) => {
    if (!file) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET_VIDEOS);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Unknown upload error');
      }
      
      const data = await response.json();
      setUploading(false);
      return data.secure_url;
    } catch (err) {
      setError(`Video upload failed: ${err.message}`);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const videoUrl = await uploadVideo(newVideo.videoFile);
    if (!videoUrl) {
      setLoading(false);
      return;
    }

    const videoData = {
      title: newVideo.title,
      videoUrl: videoUrl,
    };
    
    try {
      const apiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData)
      });
      if (!apiResponse.ok) throw new Error('Failed to add video to database');
      
      setNewVideo({ title: '', videoFile: null });
      await fetchVideos();
      alert('Video added successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete video');
      await fetchVideos();
      alert('Video deleted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="video-dashboard-container">
        <h1 className="dashboard-title">Manage Videos</h1>
        
        {/* Navigation buttons */}
        

        {/* Video Upload Form */}
        <div className="upload-form-section">
          <h2>Add New Video</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={newVideo.title}
              onChange={handleChange}
              placeholder="Video Title"
              required
              className="form-input"
            />
            <input
              type="file"
              onChange={handleFileChange}
              accept="video/*"
              required
              className="form-input"
            />
            <button type="submit" disabled={loading || uploading} className="submit-button">
              {loading || uploading ? 'Processing...' : 'Add Video'}
            </button>
          </form>
          {uploading && <p className="loading-text">Uploading video...</p>}
        </div>
        
        {error && <p className="error-text">Error: {error}</p>}

        {/* Video List */}
        <div>
          <h2>Current Videos</h2>
          <div className="video-grid">
            {videos.length > 0 ? (
              videos.map(video => (
                <div key={video._id} className="video-card">
                  <video controls className="video-player">
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="video-details">
                    <h4>{video.title}</h4>
                    <button onClick={() => handleDelete(video._id)} className="delete-button">Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%' }}>No videos available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoDashboard;
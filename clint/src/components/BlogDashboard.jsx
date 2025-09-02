// admin-dashboard/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- MUI Imports ---
import {
  Button, TextField, Container, Typography, Box, Alert, IconButton,
  Card, CardContent, CardActions, CardMedia, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';

// API Base URL
const API_URL = 'http://localhost:5000/api/blogs';

// --- BlogForm Component (for Add/Edit Modal) ---
const BlogForm = ({ blog, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [extraContent, setExtraContent] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // Pre-fill form if editing
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDescription(blog.description);
      setExtraContent(blog.extraContent);
      if (blog.image) {
        setUploadMethod('url');
        setImageUrl(blog.image);
      }
    } else {
      // Reset form when adding new blog
      setTitle('');
      setDescription('');
      setExtraContent('');
      setUploadMethod('file');
      setImageFile(null);
      setImageUrl('');
    }
  }, [blog]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ title, description, extraContent, imageFile, imageUrl, uploadMethod });
  };

  return (
    <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Blog Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <TextField label="Short Description" variant="outlined" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
      <TextField label="Full Content" variant="outlined" multiline rows={6} value={extraContent} onChange={(e) => setExtraContent(e.target.value)} required />

      <ToggleButtonGroup color="primary" value={uploadMethod} exclusive onChange={(e, newMethod) => newMethod && setUploadMethod(newMethod)} fullWidth>
        <ToggleButton value="file">Upload File</ToggleButton>
        <ToggleButton value="url">Use Image URL</ToggleButton>
      </ToggleButtonGroup>

      {uploadMethod === 'file' ? (
        <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
          {imageFile ? imageFile.name : 'Select Image'}
          <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </Button>
      ) : (
        <TextField label="Image URL" variant="outlined" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
      )}
      
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">{blog ? 'Update Blog' : 'Add New Blog'}</Button>
      </DialogActions>
    </Box>
  );
};

// --- Main App Component ---
function App() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setBlogs(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch blogs. Please make sure the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAddClick = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage('Blog deleted successfully!');
        fetchBlogs();
      } catch (err) {
        setError('Failed to delete blog.');
        console.error(err);
      }
    }
  };

  // ✅ THIS FUNCTION IS NOW FIXED
  const handleSave = async (formData) => {
    try {
      if (editingBlog) {
        // --- UPDATE LOGIC ---
        // ✅ FIX: Check if a new file is being uploaded during edit
        if (formData.uploadMethod === 'file' && formData.imageFile) {
          // If new file, send as multipart/form-data
          const postData = new FormData();
          postData.append('title', formData.title);
          postData.append('description', formData.description);
          postData.append('extraContent', formData.extraContent);
          postData.append('image', formData.imageFile);
          await axios.put(`${API_URL}/${editingBlog._id}`, postData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          // If no new file (or only URL is updated), send as JSON
          const payload = {
            title: formData.title,
            description: formData.description,
            extraContent: formData.extraContent,
            imageUrl: formData.imageUrl,
          };
          await axios.put(`${API_URL}/${editingBlog._id}`, payload);
        }
        setMessage(`Blog updated successfully!`);

      } else {
        // --- ADD LOGIC (This was already correct) ---
        if (formData.uploadMethod === 'file') {
          const postData = new FormData();
          postData.append('title', formData.title);
          postData.append('description', formData.description);
          postData.append('extraContent', formData.extraContent);
          postData.append('image', formData.imageFile);
          await axios.post(API_URL, postData, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
           const postData = {
              title: formData.title,
              description: formData.description,
              extraContent: formData.extraContent,
              imageUrl: formData.imageUrl,
           };
           await axios.post(API_URL, postData);
        }
        setMessage('Blog added successfully!');
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      setError('Failed to save blog. Please try again.');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Admin Dashboard
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New Blog
        </Button>
      </Box>
      {message && <Alert severity="success" onClose={() => setMessage('')} sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {blogs.map((blog) => (
            <Card key={blog._id} sx={{ display: 'flex' }}>
              <CardMedia component="img" sx={{ width: 151 }} image={blog.image || 'https://via.placeholder.com/151'} alt={blog.title} />
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent>
                  <Typography component="div" variant="h5">{blog.title}</Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">{blog.description}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton color="primary" onClick={() => handleEditClick(blog)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(blog._id)}><DeleteIcon /></IconButton>
                </CardActions>
              </Box>
            </Card>
          ))}
        </Box>
      )}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBlog ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>
        <DialogContent>
          <BlogForm blog={editingBlog} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import Canvas from './layout/Canvas';
import ControlPanel from './layout/ControlPanel';
import { toast } from "sonner";

const App = () => {
  // State for the app
  const [opacity, setOpacity] = useState(0.4);
  const [noiseAmount, setNoiseAmount] = useState(0);
  const [selectedGradient, setSelectedGradient] = useState('gradient-1');
  const [selectedMagicGradient, setSelectedMagicGradient] = useState('none');
  const [selectedMeshGradient, setSelectedMeshGradient] = useState(null);
  const [selectedRaycastWallpeper, setSelectedRaycastWallpeper] = useState(null);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageScale, setImageScale] = useState(1);
  const [imageRadius, setImageRadius] = useState(8);
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('bg'); // Track active tab



  // get/set theme from/in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle file input
  const handleFileInput = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    };
  };

  // Handle screenshot capture
  const handleScreenshot = () => {
    toast.warning('This would use browser APIs to capture a screenshot of your selected area');
  };

  // Handle download
  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'gradient-background.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success('Image downloaded successfully!');
  };

  // Handle save
  const handleSave = () => {
    const saveData = {
      selectedGradient,
      backgroundColor,
      selectedOverlay,
      selectedMeshGradient,
      selectedRaycastWallpeper,
      opacity,
      noiseAmount,
      uploadedImage,  //because you cant save an image in localStorage wo converting it to some string address thats why 64base dataurl
      imageScale,
      imageRadius,
      timestamp: new Date().toISOString()
    };
    try {
      const savedDesigns = JSON.parse(localStorage.getItem('gradientDesigns') || '[]');
      savedDesigns.push(saveData);
      localStorage.setItem('gradientDesigns', JSON.stringify(savedDesigns));
      toast.success('Design saved in LocalStorage!');
    } catch (err) {
      console.error('Error saving design:', err);
      toast.error('Failed to save in LocalStorage.');
    }
  };

  return (
    <div className="md:flex md:flex-row flex-col h-screen bg-background text-foreground">
      {/* Main canvas area */}
      <Canvas
        selectedMagicGradient={selectedMagicGradient}
        selectedGradient={selectedGradient}
        selectedOverlay={selectedOverlay}
        selectedMeshGradient={selectedMeshGradient}
        selectedRaycastWallpeper={selectedRaycastWallpeper}
        backgroundColor={backgroundColor}
        uploadedImage={uploadedImage}
        imageRadius={imageRadius}
        setImageRadius={setImageRadius}
        opacity={opacity}
        noiseAmount={noiseAmount}
        imageScale={imageScale}
        handleFileInput={handleFileInput}
        handleScreenshot={handleScreenshot}
      />

      {/* Sidebar controls */}
      <ControlPanel
        imageRadius={imageRadius}
        setImageRadius={setImageRadius}
        opacity={opacity}
        setOpacity={setOpacity}
        noiseAmount={noiseAmount}
        setNoiseAmount={setNoiseAmount}
        selectedGradient={selectedGradient}
        setSelectedGradient={setSelectedGradient}
        selectedMagicGradient={selectedMagicGradient}
        setSelectedMagicGradient={setSelectedMagicGradient}
        selectedOverlay={selectedOverlay}
        setSelectedOverlay={setSelectedOverlay}
        selectedMeshGradient={selectedMeshGradient}
        setSelectedMeshGradient={setSelectedMeshGradient}
        selectedRaycastWallpeper={selectedRaycastWallpeper}
        setSelectedRaycastWallpeper={setSelectedRaycastWallpeper}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        imageScale={imageScale}
        setImageScale={setImageScale}
        theme={theme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleSave={handleSave}
        handleDownload={handleDownload}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import Canvas from './layout/Canvas';
import ControlPanel from './layout/ControlPanel';
import { toast } from "sonner";

const App = () => {
  // THEME STATE
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('bg');
  // BACKGROUND SETTINGS
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [selectedGradient, setSelectedGradient] = useState('gradient-1');
  const [selectedMagicGradient, setSelectedMagicGradient] = useState('none');
  const [selectedMeshGradient, setSelectedMeshGradient] = useState(null);
  const [selectedRaycastWallpaper, setSelectedRaycastWallpaper] = useState(null);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [opacity, setOpacity] = useState(0.4);
  const [noiseAmount, setNoiseAmount] = useState(0);
  //  IMAGE SETTINGS 
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageScale, setImageScale] = useState(1);
  const [imageRadius, setImageRadius] = useState(8);
  const [shadowSpread, setShadowSpread] = useState(20);
  const [imageRotation, setImageRotation] = useState(0);
  // ====== IMAGE FILTERS ======
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);

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
    const designData = {
      selectedGradient,
      backgroundColor,
      selectedOverlay,
      selectedMeshGradient,
      selectedRaycastWallpaper,
      opacity,
      noiseAmount,
      uploadedImage,  //because you cant save an image in localStorage wo converting it to some string address thats why 64base dataurl
      imageScale,
      imageRadius,
      timestamp: new Date().toISOString()
    };
    try {
      const savedDesigns = JSON.parse(localStorage.getItem('gradientDesigns') || '[]');
      savedDesigns.push(designData);
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
        // Background settings
        selectedMagicGradient={selectedMagicGradient}
        selectedGradient={selectedGradient}
        selectedOverlay={selectedOverlay}
        selectedMeshGradient={selectedMeshGradient}
        selectedRaycastWallpaper={selectedRaycastWallpaper}
        backgroundColor={backgroundColor}
        opacity={opacity}
        noiseAmount={noiseAmount}
        // Image settings
        uploadedImage={uploadedImage}
        imageRadius={imageRadius}
        shadowSpread={shadowSpread}
        imageRotation={imageRotation}
        imageScale={imageScale}
        // Image filters
        blur={blur}
        brightness={brightness}
        contrast={contrast}
        saturate={saturate}
        hueRotate={hueRotate}
        // Handlers
        handleFileInput={handleFileInput}
        handleScreenshot={handleScreenshot}
      />

      {/* Sidebar controls */}
      <ControlPanel
        // Background settings
        selectedGradient={selectedGradient}
        setSelectedGradient={setSelectedGradient}
        selectedMagicGradient={selectedMagicGradient}
        setSelectedMagicGradient={setSelectedMagicGradient}
        selectedOverlay={selectedOverlay}
        setSelectedOverlay={setSelectedOverlay}
        selectedMeshGradient={selectedMeshGradient}
        setSelectedMeshGradient={setSelectedMeshGradient}
        selectedRaycastWallpaper={selectedRaycastWallpaper}
        setSelectedRaycastWallpaper={setSelectedRaycastWallpaper}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        opacity={opacity}
        setOpacity={setOpacity}
        noiseAmount={noiseAmount}
        setNoiseAmount={setNoiseAmount}
        // Image settings
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        imageScale={imageScale}
        setImageScale={setImageScale}
        imageRadius={imageRadius}
        setImageRadius={setImageRadius}
        shadowSpread={shadowSpread}
        setShadowSpread={setShadowSpread}
        imageRotation={imageRotation}
        setImageRotation={setImageRotation}
        // Image filters
        blur={blur}
        setBlur={setBlur}
        brightness={brightness}
        setBrightness={setBrightness}
        contrast={contrast}
        setContrast={setContrast}
        saturate={saturate}
        setSaturate={setSaturate}
        hueRotate={hueRotate}
        setHueRotate={setHueRotate}
        // UI state
        theme={theme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        // Actions
        handleSave={handleSave}
        handleDownload={handleDownload}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};

export default App;
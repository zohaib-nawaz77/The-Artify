import React, { useRef, useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { gradients, magicGradients, overlays, meshGradients, solidColors, raycastWallpapers } from '../../data/data';

// ====== IMAGE LOADING UTIL ======
const preloadImage = (src) => 
    new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'sync';
        img.loading = 'eager';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

const Canvas = ({
    uploadedImage,
    // Image properties
    imageRadius,
    shadowSpread,
    imageRotation,
    imageScale,
    
    // Background properties
    selectedGradient,
    selectedMagicGradient,
    backgroundColor,
    selectedOverlay,
    selectedMeshGradient,
    selectedRaycastWallpaper,
    opacity,
    noiseAmount,
    
    // Image filters
    blur = 0,
    brightness = 100,
    contrast = 100,
    saturate = 100,
    hueRotate = 0,
    
    // Handlers
    handleFileInput,
    handleScreenshot
}) => {
    // ====== REFS ======
    const canvasRef = useRef(null);
    const bgLayerRef = useRef(null);
    const imgLayerRef = useRef(null);
    const overlayLayerRef = useRef(null);
    const noiseLayerRef = useRef(null);
    const imageObjectRef = useRef(null);
    const meshImageRef = useRef(null);
    const raycastImageRef = useRef(null);
    const overlayImageRef = useRef(null);
    
    // ====== STATE ======
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0, dpr: 1 });
    const [shadowIntensity, setShadowIntensity] = useState(0.6);
    
    // ====== INITIALIZATION ======
    // Initialize canvas and layers
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const width = rect.width;
        const height = rect.height;
        
        // Set canvas dimensions accounting for DPR
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // Store dimensions for later use
        setCanvasDimensions({ width, height, dpr });
        
        // Initialize layers
        bgLayerRef.current = document.createElement('canvas');
        imgLayerRef.current = document.createElement('canvas');
        overlayLayerRef.current = document.createElement('canvas');
        noiseLayerRef.current = document.createElement('canvas');
        
        // Set dimensions for all layers
        [bgLayerRef.current, imgLayerRef.current, overlayLayerRef.current, noiseLayerRef.current].forEach(layer => {
            layer.width = width * dpr;
            layer.height = height * dpr;
            const ctx = layer.getContext('2d', { alpha: true });
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        });
        
        // Preload uploaded image if exists
        if (uploadedImage && !imageObjectRef.current) {
            const img = new Image();
            img.src = uploadedImage;
            imageObjectRef.current = img;
        }
    }, []);
    
    // ====== RESPONSIVE HANDLING ======
    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (!canvasRef.current) return;
            
            const rect = canvasRef.current.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const width = rect.width;
            const height = rect.height;
            
            // Update main canvas
            canvasRef.current.width = width * dpr;
            canvasRef.current.height = height * dpr;
            canvasRef.current.style.width = `${width}px`;
            canvasRef.current.style.height = `${height}px`;
            
            // Update layer canvases
            [bgLayerRef.current, imgLayerRef.current, overlayLayerRef.current, noiseLayerRef.current].forEach(layer => {
                if (layer) {
                    layer.width = width * dpr;
                    layer.height = height * dpr;
                    const ctx = layer.getContext('2d', { alpha: true });
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                }
            });
            
            setCanvasDimensions({ width, height, dpr });
            renderAllLayers();
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [
        selectedGradient,
        backgroundColor,
        uploadedImage,
        selectedOverlay,
        selectedMeshGradient,
        selectedRaycastWallpaper,
        selectedMagicGradient,
        opacity,
        noiseAmount,
        imageScale,
        imageRadius
    ]);
    
    // ====== IMAGE HANDLING ======
    // Handle uploaded image changes
    useEffect(() => {
        if (uploadedImage) {
            const img = new Image();
            img.setAttribute('decoding', 'sync');
            img.setAttribute('loading', 'eager');
            img.src = uploadedImage;
            
            img.onload = () => {
                imageObjectRef.current = img;
                renderImageLayer();
                compositeAllLayers();
            };
        } else {
            imageObjectRef.current = null;
            clearLayer(imgLayerRef.current);
            compositeAllLayers();
        }
    }, [uploadedImage]);
    
    // ====== BACKGROUND HANDLING ======
    // Render background when properties change
    useEffect(() => {
        renderBackgroundLayer();
        compositeAllLayers();
    }, [selectedGradient, backgroundColor, selectedMeshGradient, selectedRaycastWallpaper, selectedMagicGradient]);
    
    // Handle mesh gradient changes
    useEffect(() => {
        if (!selectedMeshGradient || selectedMeshGradient === 'none') {
            meshImageRef.current = null;
            renderBackgroundLayer();
            compositeAllLayers();
            return;
        }
        
        const mesh = meshGradients.find(m => m.id === selectedMeshGradient);
        if (!mesh?.src) return;
        
        preloadImage(mesh.src)
            .then(img => { meshImageRef.current = img; })
            .finally(() => { renderBackgroundLayer(); compositeAllLayers(); });
    }, [selectedMeshGradient]);
    
    // Handle raycast wallpaper changes
    useEffect(() => {
        if (!selectedRaycastWallpaper || selectedRaycastWallpaper === 'none') {
            raycastImageRef.current = null;
            renderBackgroundLayer();
            compositeAllLayers();
            return;
        }
        
        const ray = raycastWallpapers.find(r => r.id === selectedRaycastWallpaper);
        if (!ray?.src) return;
        
        preloadImage(ray.src)
            .then(img => { raycastImageRef.current = img; })
            .finally(() => { renderBackgroundLayer(); compositeAllLayers(); });
    }, [selectedRaycastWallpaper]);
    
    // ====== OVERLAY HANDLING ======
    // Handle overlay changes
    useEffect(() => {
        if (!selectedOverlay || selectedOverlay === 'none') {
            overlayImageRef.current = null;
            clearLayer(overlayLayerRef.current);
            compositeAllLayers();
            return;
        }
        
        const overlay = overlays.find(o => o.id === selectedOverlay);
        if (!overlay?.src) return;
        
        preloadImage(overlay.src)
            .then(img => { overlayImageRef.current = img; })
            .finally(() => { renderOverlayLayer(); compositeAllLayers(); });
    }, [selectedOverlay]);
    
    // ====== EFFECTS HANDLING ======
    // Handle image property changes
    useEffect(() => {
        if (uploadedImage && imageObjectRef.current) {
            renderImageLayer();
            compositeAllLayers();
        }
    }, [imageScale, imageRadius, imageRotation, shadowSpread]);
    
    // Handle overlay opacity changes
    useEffect(() => {
        renderOverlayLayer();
        compositeAllLayers();
    }, [opacity]);
    
    // Handle noise effect changes
    useEffect(() => {
        renderNoiseLayer();
        compositeAllLayers();
    }, [noiseAmount]);
    
    // ====== HELPER FUNCTIONS ======
    // Clear a layer canvas
    const clearLayer = (layer) => {
        if (!layer) return;
        const ctx = layer.getContext('2d');
        ctx.clearRect(0, 0, layer.width, layer.height);
    };
    
    // Parse gradient string to extract type, parameters, and color stops
    const parseGradient = (gradientStr, width, height, dpr) => {
        const linearMatch = gradientStr.match(/linear-gradient\(([^)]+)\)/);
        const radialMatch = gradientStr.match(/radial-gradient\(([^)]+)\)/);
        
        // Physical pixels
        const physW = width * dpr;
        const physH = height * dpr;
        const ctx = bgLayerRef.current.getContext('2d');
        
        if (linearMatch) {
            const params = linearMatch[1].split(',').map(s => s.trim());
            let angle = '0deg';
            let colors = params;
            
            if (params[0].startsWith('to ') || /^\d+deg/.test(params[0])) {
                angle = params.shift();
            }
            
            const colorStops = colors.map(c => {
                const [col, stop] = c.trim().split(' ');
                return { color: col, stop: stop ? parseFloat(stop) / 100 : null };
            });
            
            let g;
            if (angle.startsWith('to ')) {
                const dir = angle.replace('to ', '');
                switch (dir) {
                    case 'bottom': g = ctx.createLinearGradient(0, 0, 0, physH); break;
                    case 'right': g = ctx.createLinearGradient(0, 0, physW, 0); break;
                    case 'top': g = ctx.createLinearGradient(0, physH, 0, 0); break;
                    case 'left': g = ctx.createLinearGradient(physW, 0, 0, 0); break;
                    default: g = ctx.createLinearGradient(0, 0, physW, 0);
                }
            } else {
                const rad = parseFloat(angle) * Math.PI / 180;
                const dx = Math.cos(rad) * physW;
                const dy = Math.sin(rad) * physH;
                g = ctx.createLinearGradient(
                    physW / 2 - dx / 2,
                    physH / 2 - dy / 2,
                    physW / 2 + dx / 2,
                    physH / 2 + dy / 2
                );
            }
            
            colorStops.forEach(({ color, stop }, i) =>
                g.addColorStop(stop ?? i / (colorStops.length - 1), color)
            );
            
            return g;
        }
        
        if (radialMatch) {
            const params = radialMatch[1].split(',').map(s => s.trim());
            const shapePos = params[0];
            const colors = params.slice(1);
            const m = shapePos.match(/(circle|ellipse)\s+at\s+(\d+%)\s+(\d+%)/);
            const cx = m ? (parseFloat(m[2]) / 100) * physW : physW / 2;
            const cy = m ? (parseFloat(m[3]) / 100) * physH : physH / 2;
            
            const g = ctx.createRadialGradient(
                cx, cy, 0,
                cx, cy, Math.max(physW, physH) / 2
            );
            
            const colorStops = colors.map(c => {
                const [col, stop] = c.trim().split(' ');
                return { color: col, stop: stop ? parseFloat(stop) / 100 : null };
            });
            
            colorStops.forEach(({ color, stop }, i) =>
                g.addColorStop(stop ?? i / (colorStops.length - 1), color)
            );
            
            return g;
        }
        
        return null;
    };
    
    // ====== LAYER RENDERING FUNCTIONS ======
    // Render background layer (gradient, magic gradient, mesh, or solid color)
    const renderBackgroundLayer = () => {
        if (!bgLayerRef.current || canvasDimensions.width === 0) return;
        
        const ctx = bgLayerRef.current.getContext('2d');
        const { width, height, dpr } = canvasDimensions;
        
        // Clear previous content
        ctx.clearRect(0, 0, width * dpr, height * dpr);
        
        // Save and scale the context for DPR
        ctx.save();
        ctx.scale(dpr, dpr);
        
        // Draw mesh gradient if selected
        if (selectedMeshGradient && selectedMeshGradient !== 'none' && meshImageRef.current) {
            ctx.drawImage(meshImageRef.current, 0, 0, width, height);
            ctx.restore();
            return;
        }
        
        // Draw raycast wallpaper if selected
        if (selectedRaycastWallpaper && selectedRaycastWallpaper !== 'none' && raycastImageRef.current) {
            ctx.drawImage(raycastImageRef.current, 0, 0, width, height);
            ctx.restore();
            return;
        }
        
        // Draw magic gradient if selected
        if (selectedMagicGradient && magicGradients[selectedMagicGradient]) {
            const gradient = parseGradient(magicGradients[selectedMagicGradient], width, height, dpr);
            if (gradient) {
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }
            ctx.restore();
            return;
        }
        
        // Draw linear gradient
        if (selectedGradient && gradients[selectedGradient]) {
            const gradient = parseGradient(gradients[selectedGradient], width, height, dpr);
            if (gradient) {
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }
            ctx.restore();
            return;
        }
        
        // Draw solid background color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    };
    
    // Render image layer with shadow effect
    const renderImageLayer = () => {
        if (!imgLayerRef.current || !imageObjectRef.current || canvasDimensions.width === 0) return;
        
        const ctx = imgLayerRef.current.getContext('2d');
        const { width, height, dpr } = canvasDimensions;
        
        // Clear previous content
        ctx.clearRect(0, 0, imgLayerRef.current.width, imgLayerRef.current.height);
        
        // Save context and scale for DPR
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        const img = imageObjectRef.current;
        const maxImageScale = 0.8;
        
        // Calculate image size
        const scale = Math.min(width / img.width, height / img.height) * (imageScale || 1) * maxImageScale;
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        
        // Center position
        const cx = width / 2;
        const cy = height / 2;
        
        // Save again for shadow + rotation
        ctx.save();
        
        // Move origin to center for rotation
        ctx.translate(cx, cy);
        ctx.rotate(imageRotation * Math.PI / 180);
        ctx.translate(-imgWidth / 2, -imgHeight / 2);
        
        // Apply shadow
        ctx.shadowColor = `rgba(0, 0, 0, ${shadowIntensity})`;
        ctx.shadowBlur = shadowSpread * dpr;
        ctx.shadowOffsetX = 30;
        ctx.shadowOffsetY = 35;
        
        // Create rounded-rect path for clipping & shadow
        const drawPath = () => {
            ctx.beginPath();
            if (imageRadius > 0) {
                const radius = imageRadius * scale;
                ctx.moveTo(radius, 0);
                ctx.arcTo(imgWidth, 0, imgWidth, imgHeight, radius);
                ctx.arcTo(imgWidth, imgHeight, 0, imgHeight, radius);
                ctx.arcTo(0, imgHeight, 0, 0, radius);
                ctx.arcTo(0, 0, imgWidth, 0, radius);
                ctx.closePath();
            } else {
                ctx.rect(0, 0, imgWidth, imgHeight);
            }
        };
        
        // Draw shadow shape
        drawPath();
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        ctx.fill();
        
        // Reset shadow for actual image
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Clip and draw image
        if (imageRadius > 0) {
            drawPath();
            ctx.clip();
        }
        
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, imgWidth, imgHeight);
        
        // Subtle border
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 1;
        drawPath();
        ctx.stroke();
        
        // Restore transformations
        ctx.restore();
        ctx.restore();
    };
    
    // Render overlay layer
    const renderOverlayLayer = () => {
        if (!overlayLayerRef.current || canvasDimensions.width === 0) return;
        
        const ctx = overlayLayerRef.current.getContext('2d');
        const { width, height, dpr } = canvasDimensions;
        
        // Clear previous content
        ctx.clearRect(0, 0, overlayLayerRef.current.width, overlayLayerRef.current.height);
        
        // Save and scale for DPR
        ctx.save();
        ctx.scale(dpr, dpr);
        
        // Draw overlay if selected
        if (selectedOverlay && selectedOverlay !== 'none' && overlayImageRef.current) {
            ctx.globalAlpha = opacity;
            ctx.drawImage(overlayImageRef.current, 0, 0, width, height);
            ctx.globalAlpha = 1.0;
        }
        
        ctx.restore();
    };
    
    // Render noise layer
    const renderNoiseLayer = () => {
        if (!noiseLayerRef.current || canvasDimensions.width === 0 || noiseAmount <= 0) return;
        
        const ctx = noiseLayerRef.current.getContext('2d');
        const { width, height, dpr } = canvasDimensions;
        
        // Clear previous content
        ctx.clearRect(0, 0, noiseLayerRef.current.width, noiseLayerRef.current.height);
        
        if (noiseAmount > 0) {
            // Create noise with better quality - use dpr-scaled dimensions
            const imageData = ctx.createImageData(width * dpr, height * dpr);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * noiseAmount / 25;
                // Set noise as a semi-transparent overlay
                data[i] = 128 + noise * 128;     // Red
                data[i + 1] = 128 + noise * 128; // Green
                data[i + 2] = 128 + noise * 128; // Blue
                data[i + 3] = Math.abs(noise) * 255 * 0.2; // Alpha - subtle
            }
            
            ctx.putImageData(imageData, 0, 0);
        }
    };
    
    // ====== COMPOSITING ======
    // Composite all layers onto the main canvas
    const compositeAllLayers = () => {
        if (!canvasRef.current || canvasDimensions.width === 0) return;
        
        const ctx = canvasRef.current.getContext('2d');
        const { width, height, dpr } = canvasDimensions;
        
        // Clear main canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Draw layers in order
        if (bgLayerRef.current) {
            ctx.drawImage(bgLayerRef.current, 0, 0);
        }
        
        if (imgLayerRef.current && imageObjectRef.current) {
            ctx.drawImage(imgLayerRef.current, 0, 0);
        }
        
        if (overlayLayerRef.current && overlayImageRef.current) {
            ctx.drawImage(overlayLayerRef.current, 0, 0);
        }
        
        if (noiseLayerRef.current && noiseAmount > 0) {
            ctx.drawImage(noiseLayerRef.current, 0, 0);
        }
    };
    
    // Render all layers at once
    const renderAllLayers = () => {
        renderBackgroundLayer();
        renderImageLayer();
        renderOverlayLayer();
        renderNoiseLayer();
        compositeAllLayers();
    };
    
    // Initial render
    useEffect(() => {
        // Wait for the next frame to ensure dimensions are set
        requestAnimationFrame(() => {
            if (canvasDimensions.width > 0) {
                renderAllLayers();
            }
        });
    }, [canvasDimensions]);
    
    // ====== RENDER ======
    return (
        <div className="flex-1 flex items-center justify-center p-6 relative">
            <canvas
                id="canvas"
                ref={canvasRef}
                className="w-full h-full rounded-lg border border-border shadow-lg overflow-hidden"
                style={{
                    filter: `
                        blur(${blur}px)
                        brightness(${brightness}%)
                        contrast(${contrast}%)
                        saturate(${saturate}%)
                        hue-rotate(${hueRotate}deg)
                    `
                }}
            />
            
            {!uploadedImage && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Card className="w-80 shadow-2xl shadow-black rounded-sm">
                        <CardContent className="pt-6 pb-6">
                            <div className="mb-4 flex justify-center">
                                <div className="p-3 rounded-full bg-muted">
                                    <Camera className="h-6 w-6 text-muted-foreground" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-center">Add Your Image</h3>
                            <Button
                                variant="outline"
                                className="w-full mb-4"
                                onClick={handleFileInput}
                            >
                                Click to Upload or Paste (Ctrl+V)
                            </Button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-card px-2 text-xs text-muted-foreground">
                                        or
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button
                                    variant="secondary"
                                    className="w-full flex items-center gap-2"
                                    onClick={handleScreenshot}
                                >
                                    <Camera size={16} />
                                    Capture Screenshot
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Canvas;
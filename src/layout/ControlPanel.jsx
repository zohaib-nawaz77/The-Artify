import React from 'react';
import { Download, Save, Crop, Moon, Sun, Layout, Palette, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import OptimizedSlider from '../partials/OptimizedSlider';
import { gradients, magicGradients, overlays, meshGradients, solidColors, raycastWallpapers } from '../../data/data';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from "motion/react"
import { toast } from 'sonner';

const ControlPanel = ({
    // Image properties
    imageRadius, setImageRadius,
    shadowSpread, setShadowSpread,
    imageRotation, setImageRotation,
    imageScale, setImageScale,
    // Background properties
    opacity, setOpacity,
    noiseAmount, setNoiseAmount,
    selectedGradient, setSelectedGradient,
    selectedMagicGradient, setSelectedMagicGradient,
    selectedOverlay, setSelectedOverlay,
    selectedMeshGradient, setSelectedMeshGradient,
    selectedRaycastWallpaper, setSelectedRaycastWallpaper,
    backgroundColor, setBackgroundColor,
    // Image filters
    blur, setBlur,
    brightness, setBrightness,
    contrast, setContrast,
    saturate, setSaturate,
    hueRotate, setHueRotate,
    // UI state
    uploadedImage, setUploadedImage,
    theme,
    activeTab, setActiveTab,
    // Actions
    handleSave,
    handleDownload,
    toggleTheme
}) => {
    // Animation for tab text transitions
    const textVariants = {
        hidden: { opacity: 0, x: -4 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    };

    // Reusable panel component for consistent styling
    const Panel = React.memo(({ title, children }) => (
        <div className="mb-6">
            <h3 className="text-xs uppercase font-medium text-muted-foreground mb-3">{title}</h3>
            {children}
        </div>
    ));

    // Handle removing uploaded image
    const handleRemoveImage = () => {
        setUploadedImage(null);
        toast.success('Image removed from canvas.');
    };

    return (
        <div className="md:w-76 w-full border-l border-border bg-muted/40 p-4 overflow-y-auto">
            {/* Top action bar */}
            <div className="flex justify-between mb-6">
                {/* Left actions: Save and Crop */}
                <div className="flex gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={handleSave}>
                                    <Save className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Save Design</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Crop className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Crop Image</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                
                {/* Right actions: Download and Theme Toggle */}
                <div className="flex gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={handleDownload}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Download Image</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={toggleTheme}
                                    className="dark:bg-zinc-700 dark:border-zinc-600 dark:hover:bg-zinc-600"
                                >
                                    {theme === 'light' ? (
                                        <Moon className="h-4 w-4 dark:text-zinc-100" />
                                    ) : (
                                        <Sun className="h-4 w-4 dark:text-zinc-100" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            
            {/* Main tabs for different control sections */}
            <Tabs defaultValue="bg" onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid grid-cols-3 w-full h-10 py-1">
                    {/* Layers Tab */}
                    <TabsTrigger value="layers" className="flex items-center justify-center">
                        {activeTab === "layers" ? (
                            <motion.span 
                                variants={textVariants}
                                initial="hidden"
                                animate="visible" 
                                className="flex items-center gap-1 text-xs"
                            >
                                <Layout className="h-4 w-4" />
                                Layers
                            </motion.span>
                        ) : (
                            <Layout className="h-4 w-4" />
                        )}
                    </TabsTrigger>
                    
                    {/* Background Tab */}
                    <TabsTrigger value="bg" className="flex items-center justify-center">
                        {activeTab === "bg" ? (
                            <motion.span 
                                variants={textVariants}
                                initial="hidden"
                                animate="visible" 
                                className="flex items-center gap-1 text-xs"
                            >
                                <Palette className="h-4 w-4" />
                                BG
                            </motion.span>
                        ) : (
                            <Palette className="h-4 w-4" />
                        )}
                    </TabsTrigger>
                    
                    {/* Effects Tab */}
                    <TabsTrigger value="effects" className="flex items-center justify-center">
                        {activeTab === "effects" ? (
                            <motion.span 
                                variants={textVariants}
                                initial="hidden"
                                animate="visible" 
                                className="flex items-center gap-1 text-xs"
                            >
                                <Sparkles className="h-4 w-4" />
                                Effects
                            </motion.span>
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}
                    </TabsTrigger>
                </TabsList>
                
                {/* Layers Tab Content */}
                <TabsContent value="layers" className="pt-4">
                    <Panel title="Overlays">
                        <div className="grid grid-cols-4 gap-2">
                            {overlays.map(overlay => (
                                <motion.div
                                    key={overlay.id}
                                    className={`h-10 w-full rounded-md cursor-pointer bg-gray-300 dark:bg-zinc-700 ${
                                        selectedOverlay === overlay.id
                                            ? 'border-1 border-primary dark:border-zinc-500'
                                            : 'border border-transparent'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => setSelectedOverlay(
                                        prev => prev === overlay.id ? null : overlay.id
                                    )}
                                >
                                    {overlay.src ? (
                                        <img
                                            src={overlay.src}
                                            alt={overlay.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                            None
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </Panel>
                    
                    <Panel title="Opacity">
                        <OptimizedSlider
                            label="Overlay Opacity"
                            value={opacity}
                            onChange={setOpacity}
                            min={0}
                            max={1}
                            step={0.1}
                        />
                    </Panel>
                    
                    {uploadedImage && (
                        <Panel title="Image Size">
                            <OptimizedSlider
                                label="Image Scale"
                                value={imageScale}
                                onChange={setImageScale}
                                min={0.1}
                                max={2}
                                step={0.05}
                                formatValue={(val) => val.toFixed(2)}
                                unit="x"
                            />
                        </Panel>
                    )}
                </TabsContent>
                
                {/* Background Tab Content */}
                <TabsContent value="bg" className="pt-4">
                    <Panel title="Raycast Wallpapers">
                        <div className="grid grid-cols-4 gap-2">
                            {raycastWallpapers.map(raycast => (
                                <motion.div
                                    key={raycast.id}
                                    className={`h-10 w-full rounded-md cursor-pointer bg-gray-300 dark:bg-zinc-700 ${
                                        selectedRaycastWallpaper === raycast.id
                                            ? 'border-1 border-primary dark:border-zinc-500'
                                            : 'border border-transparent'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => {
                                        setSelectedRaycastWallpaper(
                                            prev => prev === raycast.id ? null : raycast.id
                                        );
                                        setSelectedGradient(null);
                                        setSelectedMeshGradient(null);
                                        setSelectedMagicGradient(null);
                                        setBackgroundColor('#ffffff');
                                    }}
                                >
                                    {raycast.src ? (
                                        <img
                                            src={raycast.src}
                                            alt={raycast.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                            None
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </Panel>

                    <Panel title="Gradients">
                        <div className="grid grid-cols-7 gap-2">
                            {Object.keys(gradients).map(gradientKey => (
                                <motion.div
                                    key={gradientKey}
                                    className={`h-8 w-full rounded-md cursor-pointer ${
                                        selectedGradient === gradientKey
                                            ? 'ring-1 ring-primary ring-offset-1'
                                            : ''
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    style={{ background: gradients[gradientKey] }}
                                    onClick={() => {
                                        setSelectedGradient(
                                            prev => prev === gradientKey ? null : gradientKey
                                        );
                                        setSelectedMagicGradient(null);
                                        setSelectedRaycastWallpaper(null);
                                        setSelectedMeshGradient(null);
                                        setBackgroundColor('#ffffff');
                                    }}
                                />
                            ))}
                        </div>
                    </Panel>
                    
                    <Panel title="Solid Colors">
                        <div className="grid grid-cols-7 gap-2">
                            {solidColors.map(color => (
                                <motion.div
                                    key={color}
                                    className={`h-8 w-full rounded-md cursor-pointer ${
                                        backgroundColor === color && !selectedGradient && !selectedMeshGradient
                                            ? 'border-2 border-primary dark:border-zinc-500'
                                            : 'border border-transparent'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    style={{ background: color }}
                                    onClick={() => {
                                        setBackgroundColor(prev => prev === color ? '#ffffff' : color);
                                        setSelectedMagicGradient(null);
                                        setSelectedGradient(null);
                                        setSelectedMeshGradient(null);
                                    }}
                                />
                            ))}
                        </div>
                    </Panel>
                    
                    <Panel title="Mesh Gradients">
                        <div className="grid grid-cols-4 gap-2">
                            {meshGradients.map(mesh => (
                                <motion.div
                                    key={mesh.id}
                                    className={`h-10 w-full rounded-md cursor-pointer bg-gray-300 dark:bg-zinc-700 ${
                                        selectedMeshGradient === mesh.id
                                            ? 'border-1 border-primary dark:border-zinc-500'
                                            : 'border border-transparent'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => {
                                        setSelectedMeshGradient(
                                            prev => prev === mesh.id ? null : mesh.id
                                        );
                                        setSelectedRaycastWallpaper(null);
                                        setSelectedMagicGradient(null);
                                        setSelectedGradient(null);
                                        setBackgroundColor('#ffffff');
                                    }}
                                >
                                    {mesh.src ? (
                                        <img
                                            src={mesh.src}
                                            alt={mesh.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                            None
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </Panel>

                    <Panel title="Magic Gradients">
                        <div className="grid grid-cols-4 gap-2">
                            {Object.keys(magicGradients).map(magicKey => (
                                <motion.div
                                    key={magicKey}
                                    className={`h-10 w-full rounded-md cursor-pointer ${
                                        selectedMagicGradient === magicKey
                                            ? 'ring-1 ring-primary ring-offset-1'
                                            : ''
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    style={{ background: magicGradients[magicKey] }}
                                    onClick={() => {
                                        setSelectedMagicGradient(
                                            prev => prev === magicKey ? null : magicKey
                                        );
                                        setSelectedGradient(null);
                                        setSelectedMeshGradient(null);
                                        setSelectedRaycastWallpaper(null);
                                        setBackgroundColor('#ffffff');
                                    }}
                                />
                            ))}
                        </div>
                    </Panel>
                </TabsContent>
                
                {/* Effects Tab Content */}
                <TabsContent value="effects" className="pt-4">
                    <Panel title="Noise">
                        <OptimizedSlider
                            label="Noise Amount"
                            value={noiseAmount}
                            onChange={setNoiseAmount}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </Panel>

                    <Panel title="Image Border Radius">
                        <OptimizedSlider
                            label="Border Radius"
                            value={imageRadius}
                            onChange={setImageRadius}
                            min={0}
                            max={100}
                            step={1}
                            formatValue={(val) => val.toFixed(0)}
                            unit="px"
                        />
                    </Panel>
                    
                    <Panel title="Drop Shadow">
                        <OptimizedSlider
                            label="Shadow Spread"
                            value={shadowSpread}
                            onChange={setShadowSpread}
                            min={0}
                            max={100}
                            step={1}
                            unit="px"
                        />
                    </Panel>
                    
                    <Panel title="Image Rotation">
                        <OptimizedSlider
                            label="Rotation"
                            value={imageRotation}
                            onChange={setImageRotation}
                            min={-180}
                            max={180}
                            step={1}
                            unit="°"
                        />
                    </Panel>
                    
                    <Panel title="Blur">
                        <OptimizedSlider
                            label="Amount"
                            value={blur}
                            onChange={setBlur}
                            min={0}
                            max={10}
                            step={0.5}
                            unit="px"
                        />
                    </Panel>
                    
                    <Panel title="Brightness">
                        <OptimizedSlider
                            label="Brightness"
                            value={brightness}
                            onChange={setBrightness}
                            min={0}
                            max={200}
                            step={1}
                            unit="%"
                        />
                    </Panel>
                    
                    <Panel title="Contrast">
                        <OptimizedSlider
                            label="Contrast"
                            value={contrast}
                            onChange={setContrast}
                            min={0}
                            max={200}
                            step={1}
                            unit="%"
                        />
                    </Panel>
                    
                    <Panel title="Saturation">
                        <OptimizedSlider
                            label="Saturation"
                            value={saturate}
                            onChange={setSaturate}
                            min={0}
                            max={200}
                            step={1}
                            unit="%"
                        />
                    </Panel>
                    
                    <Panel title="Hue Shift">
                        <OptimizedSlider
                            label="Angle"
                            value={hueRotate}
                            onChange={setHueRotate}
                            min={-180}
                            max={180}
                            step={1}
                            unit="°"
                        />
                    </Panel>
                </TabsContent>
            </Tabs>
            
            {/* Uploaded image notification */}
            {uploadedImage && (
                <Alert className="mt-6">
                    <AlertDescription className="text-xs flex items-center justify-between">
                        <span>Image uploaded</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={handleRemoveImage}
                        >
                            Remove
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default ControlPanel;
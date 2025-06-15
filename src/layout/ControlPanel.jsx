import React from 'react';
import { Download, Save, Crop, Moon, Sun, Layout, Palette, Droplet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Import the optimized slider component
import OptimizedSlider from '../partials/OptimizedSlider';
import { gradients, magicGradients, overlays, meshGradients, solidColors, raycastWallpepers } from '../../data/data';


import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ControlPanel = ({
    imageRadius,
    setImageRadius,
    opacity,
    setOpacity,
    noiseAmount,
    setNoiseAmount,
    selectedGradient,
    setSelectedGradient,
    selectedMagicGradient,
    setSelectedMagicGradient,
    selectedOverlay,
    setSelectedOverlay,
    selectedMeshGradient,
    setSelectedMeshGradient,
    selectedRaycastWallpeper,
    setSelectedRaycastWallpeper,
    backgroundColor,
    setBackgroundColor,
    uploadedImage,
    setUploadedImage,
    imageScale,
    setImageScale,
    theme,
    activeTab,
    setActiveTab,
    handleSave,
    handleDownload,
    toggleTheme
}) => {




    // Animation variants for tab text
    const textVariants = {
        hidden: { opacity: 0, x: -4 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    };

    const Panel = React.memo(({ title, children }) => (
        <div className="mb-6">
            <h3 className="text-xs uppercase font-medium text-muted-foreground mb-3">{title}</h3>
            {children}
        </div>
    ));

    return (
        <div className="w-76 border-l border-border bg-muted/40 p-4 overflow-y-auto">
            <div className="flex justify-between mb-6">
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

            <Tabs defaultValue="bg" onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid grid-cols-3 w-full h-10 py-1">
                    <TabsTrigger value="layers" className="flex items-center justify-center">
                        {activeTab === "layers" ? (
                            <motion.span variants={textVariants}
                                initial="hidden"
                                animate="visible" className="flex items-center gap-1 text-xs">
                                <Layout className="h-4 w-4" />
                                Layers
                            </motion.span>
                        ) : (
                            <Layout className="h-4 w-4" />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="bg" className="flex items-center justify-center">
                        {activeTab === "bg" ? (
                            <motion.span variants={textVariants}
                                initial="hidden"
                                animate="visible" className="flex items-center gap-1 text-xs">
                                <Palette className="h-4 w-4" />
                                BG
                            </motion.span>
                        ) : (
                            <Palette className="h-4 w-4" />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="flex items-center justify-center">
                        {activeTab === "colors" ? (
                            <motion.span variants={textVariants}
                                initial="hidden"
                                animate="visible" className="flex items-center gap-1 text-xs">
                                <Droplet className="h-4 w-4" />
                                Colors
                            </motion.span>
                        ) : (
                            <Droplet className="h-4 w-4" />
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="layers" className="pt-4">
                    <Panel title="Overlays">
                        <div className="grid grid-cols-4 gap-2">
                            {overlays.map(overlay => (
                                <motion.div
                                    key={overlay.id}
                                    className={`h-10 w-full rounded-md cursor-pointer bg-gray-300 dark:bg-zinc-700 ${selectedOverlay === overlay.id
                                        ? 'border-1 border-primary dark:border-zinc-500'
                                        : 'border border-transparent'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => {
                                        setSelectedOverlay(prev => prev === overlay.id ? null : overlay.id);
                                    }}
                                >
                                    {overlay.src && (
                                        <img
                                            src={overlay.src}
                                            alt={overlay.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    )}
                                    {!overlay.src && (
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

                    <Panel title="Noise">
                        <div className="mb-1 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Noise Amount</span>
                            <Badge variant="outline">{noiseAmount}</Badge>
                        </div>
                        <Slider
                            defaultValue={[noiseAmount]}
                            min={0}
                            max={100}
                            onValueChange={(value) => setNoiseAmount(value[0])}
                            className="py-2"
                        />
                    </Panel>

                    {uploadedImage && (
                        <>
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
                        </>
                    )}


                </TabsContent>

                <TabsContent value="bg" className="pt-4">

                    <Panel title="Raycast Wallpepers">
                        <div className="grid grid-cols-4 gap-2">
                            {raycastWallpepers.map(raycast => (
                                <motion.div
                                    key={raycast.id}
                                    className={`h-10 w-full rounded-md cursor-pointer bg-gray-300 dark:bg-zinc-700 ${selectedRaycastWallpeper === raycast.id
                                        ? 'border-1 border-primary dark:border-zinc-500'
                                        : 'border border-transparent'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => {
                                        setSelectedRaycastWallpeper(prev => prev === raycast.id ? null : raycast.id);
                                        setSelectedGradient(null);
                                        setSelectedMeshGradient(null);
                                        setSelectedMagicGradient(null);
                                        setBackgroundColor('#ffffff');
                                    }}
                                >
                                    {raycast.src && (
                                        <img
                                            src={raycast.src}
                                            alt={raycast.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    )}
                                    {!raycast.src && (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                            None
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </Panel>


                    <Panel title="Gradients" className="">
                        <div className="grid grid-cols-7 gap-2 ">
                            {Object.keys(gradients).map(gradientKey => (
                                <motion.div
                                    key={gradientKey}
                                    className={`h-8 w-full rounded-md cursor-pointer ${selectedGradient === gradientKey
                                        ? 'ring-1 ring-primary ring-offset-1'
                                        : ''
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    style={{ background: gradients[gradientKey] }}
                                    onClick={() => {
                                        setSelectedGradient(prev => prev === gradientKey ? null : gradientKey);
                                        setSelectedMagicGradient(null); // Optional: still allow only one type of gradient active
                                        setSelectedRaycastWallpeper(null); // Optional: still allow only one type of gradient active
                                        setSelectedMeshGradient(null); // Optional: still allow only one type of gradient active
                                        setBackgroundColor('#ffffff'); // Reset background color when gradient is selected
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
                                    className={`h-8 w-full rounded-md cursor-pointer ${backgroundColor === color && !selectedGradient && !selectedMeshGradient
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
                                    className={`h-10 w-full rounded-md cursor-pointer bg-gray-300 dark:bg-zinc-700 ${selectedMeshGradient === mesh.id
                                        ? 'border-1 border-primary dark:border-zinc-500'
                                        : 'border border-transparent'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => {
                                        setSelectedMeshGradient(prev => prev === mesh.id ? null : mesh.id);
                                        setSelectedRaycastWallpeper(null);
                                        setSelectedMagicGradient(null);
                                        setSelectedGradient(null);
                                        setBackgroundColor('#ffffff');
                                    }}
                                >
                                    {mesh.src && (
                                        <img
                                            src={mesh.src}
                                            alt={mesh.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    )}
                                    {!mesh.src && (
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
                                    className={`h-10 w-full rounded-md cursor-pointer ${selectedMagicGradient === magicKey
                                        ? 'ring-1 ring-primary ring-offset-1'
                                        : ''
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    style={{ background: magicGradients[magicKey] }}
                                    onClick={() => {
                                        setSelectedMagicGradient(prev => prev === magicKey ? null : magicKey);
                                        setSelectedGradient(null);
                                        setSelectedMeshGradient(null);
                                        setSelectedRaycastWallpeper(null);
                                        setBackgroundColor('#ffffff');
                                    }}
                                />
                            ))}
                        </div>
                    </Panel>
                </TabsContent>

                <TabsContent value="colors" className="pt-4">
                    <Panel title="Marble Textures">
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div
                                    key={`marble-${i}`}
                                    className="h-16 w-full rounded-md bg-muted cursor-pointer hover:bg-muted/70"
                                    style={{ background: `url(/api/placeholder/50/50)` }}
                                />
                            ))}
                        </div>
                    </Panel>
                </TabsContent>
            </Tabs>

            {uploadedImage && (
                <Alert className="mt-6">
                    <AlertDescription className="text-xs flex items-center justify-between">
                        <span>Image uploaded</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => {
                                setUploadedImage(null)
                                toast.success('Image removed from canvas.')
                            }}
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
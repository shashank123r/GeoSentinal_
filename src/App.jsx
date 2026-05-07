import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';

// Components
import Navbar from './components/Navigation/Navbar';
import LoadingScreen from './components/UI/LoadingScreen';
import ScrollProgress from './components/UI/ScrollProgress';
import Hero from './components/Sections/Hero';
import DisasterSelection from './components/Sections/DisasterSelection';
import BrowseSection from './components/Sections/BrowseSection';
import Comparison from './components/Sections/Comparison';
import AIAnalysis from './components/Sections/AIAnalysis';
import InteractiveMapSection from './components/Sections/InteractiveMapSection';
import Statistics from './components/Sections/Statistics';

import About from './components/Sections/About';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDisasterData, setSelectedDisasterData] = useState(null);
    const [disasterTypeFilter, setDisasterTypeFilter] = useState(null);

    // Section refs for smooth scroll navigation
    const heroRef = useRef(null);
    const disastersRef = useRef(null);
    const browseRef = useRef(null);
    const comparisonRef = useRef(null);
    const analysisRef = useRef(null);
    const mapRef = useRef(null);
    const statsRef = useRef(null);

    const aboutRef = useRef(null);

    const sectionRefs = {
        hero: heroRef,
        disasters: disastersRef,
        browse: browseRef,
        comparison: comparisonRef,
        analysis: analysisRef,
        map: mapRef,
        statistics: statsRef,

        about: aboutRef,
    };

    const scrollToSection = (sectionName) => {
        const ref = sectionRefs[sectionName];
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleDisasterSelect = (disaster) => {
        setSelectedDisasterData(disaster);
        scrollToSection('comparison');
    };

    const handleDisasterTypeSelect = (disasterType) => {
        setDisasterTypeFilter(disasterType);
        scrollToSection('browse');
    };

    const clearDisasterTypeFilter = () => {
        setDisasterTypeFilter(null);
    };

    return (
        <AppProvider>
            <div className="bg-slate-900 text-white overflow-x-hidden">
                {/* Loading Screen */}
                <AnimatePresence>
                    {isLoading && (
                        <LoadingScreen onComplete={() => setIsLoading(false)} />
                    )}
                </AnimatePresence>

                {/* Main Content */}
                {!isLoading && (
                    <>
                        {/* Fixed Navigation */}
                        <Navbar scrollToSection={scrollToSection} />

                        {/* Scroll Progress Indicator */}
                        <ScrollProgress />

                        {/* Hero Section */}
                        <section ref={heroRef} id="hero" className="min-h-screen snap-section">
                            <Hero scrollToSection={scrollToSection} />
                        </section>

                        {/* Disaster Selection Section */}
                        <section ref={disastersRef} id="disasters" className="min-h-screen snap-section">
                            <DisasterSelection
                                scrollToSection={scrollToSection}
                                onDisasterTypeSelect={handleDisasterTypeSelect}
                            />
                        </section>

                        {/* Browse All Disasters Section */}
                        <section ref={browseRef} id="browse" className="min-h-screen snap-section">
                            <BrowseSection
                                onDisasterSelect={handleDisasterSelect}
                                disasterTypeFilter={disasterTypeFilter}
                                onClearFilter={clearDisasterTypeFilter}
                            />
                        </section>

                        {/* Comparison Section */}
                        <section ref={comparisonRef} id="comparison" className="min-h-screen snap-section">
                            <Comparison
                                scrollToSection={scrollToSection}
                                selectedDisasterData={selectedDisasterData}
                            />
                        </section>

                        {/* AI Analysis Section */}
                        <section ref={analysisRef} id="analysis" className="min-h-screen snap-section">
                            <AIAnalysis />
                        </section>

                        {/* Interactive Map Section */}
                        <section ref={mapRef} id="map" className="min-h-screen snap-section">
                            <InteractiveMapSection onDisasterSelect={handleDisasterSelect} />
                        </section>

                        {/* Statistics Section */}
                        <section ref={statsRef} id="statistics" className="min-h-screen snap-section">
                            <Statistics />
                        </section>



                        {/* About Section */}
                        <section ref={aboutRef} id="about" className="min-h-[50vh] snap-section">
                            <About />
                        </section>
                    </>
                )}
            </div>
        </AppProvider>
    );
}

export default App;


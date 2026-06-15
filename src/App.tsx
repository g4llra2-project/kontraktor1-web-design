/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ViewPath, RabEstimateInput, RabEstimateResult, RoomLayoutResult, LeadInput } from './types';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { motion, AnimatePresence } from 'motion/react';
import HomeView from './components/views/HomeView';
import WorksView from './components/views/WorksView';
import StudioView from './components/views/StudioView';
import ProcessView from './components/views/ProcessView';
import KalkulatorRabView from './components/views/KalkulatorRabView';
import KonsultasiView from './components/views/KonsultasiView';
import EnquiryDrawer from './components/layout/EnquiryDrawer';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewPath>('home');

  // Carried form states between views
  const [rabData, setRabData] = useState<{ input: RabEstimateInput; result: RabEstimateResult } | null>(null);
  const [floorPlanData, setFloorPlanData] = useState<{
    landAreaSqm: number;
    floors: number;
    roomsConfig: Record<string, number>;
    layoutResult: RoomLayoutResult[];
  } | null>(null);
  const [aiRenderData, setAiRenderData] = useState<{ imageUrl: string; styleName: string; promptUsed: string } | null>(null);
  const [isEnquiryDrawerOpen, setIsEnquiryDrawerOpen] = useState(false);

  // Reset scroll index to zero upon active screen transitions (fixes iframe scrolling offsets)
  useEffect(() => {
    if (currentView === 'generator-denah') {
      setCurrentView('kalkulator-rab');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Handle estimate persistence
  const handleCompleteEstimate = (input: RabEstimateInput, result: RabEstimateResult) => {
    setRabData({ input, result });
  };

  // Handle floor layout persistence
  const handleCompleteFloorPlan = (
    fpData: {
      landAreaSqm: number;
      floors: number;
      roomsConfig: Record<string, number>;
      layoutResult: RoomLayoutResult[];
    },
    aiData?: { imageUrl: string; styleName: string; promptUsed: string } | null
  ) => {
    setFloorPlanData(fpData);
    if (aiData) {
      setAiRenderData(aiData);
    }
  };

  // Submit Lead Submission mock (Phase 1 local simulation)
  const handleSubmitLead = async (lead: LeadInput): Promise<boolean> => {
    // Simulate API round-trip delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log lead to console for dev validation
    console.log('Lead submitted successfully to database payload:', lead);
    
    // Store in localStorage for complete local durability in preview iframe across reloads!
    try {
      const persistedLeads = JSON.parse(localStorage.getItem('oh_leads') || '[]');
      persistedLeads.push({
        ...lead,
        submittedAt: new Date().toISOString(),
        id: crypto.randomUUID(),
      });
      localStorage.setItem('oh_leads', JSON.stringify(persistedLeads));
    } catch (e) {
      console.warn('Storage failed or is untrusted within isolated sandbox iframe.');
    }

    return true;
  };

  // Navigation controller helper
  const handleNavigate = (view: ViewPath) => {
    setCurrentView(view);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-white text-brand-black selection:bg-brand-orange selection:text-brand-white">
      {/* GLOBAL ARCHITECTURE NAVBAR */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} onOpenEnquiry={() => setIsEnquiryDrawerOpen(true)} />

      {/* CORE CONTENT LAYOUT SWITCHER */}
      <main className={`flex-grow ${currentView !== 'home' ? 'pt-16 xl:pt-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentView === 'home' && (
              <HomeView onNavigate={handleNavigate} onOpenEnquiry={() => setIsEnquiryDrawerOpen(true)} />
            )}

            {currentView === 'works' && (
              <WorksView onNavigate={handleNavigate} onOpenEnquiry={() => setIsEnquiryDrawerOpen(true)} />
            )}

            {currentView === 'studio' && (
              <StudioView onNavigate={handleNavigate} onOpenEnquiry={() => setIsEnquiryDrawerOpen(true)} />
            )}

            {currentView === 'process' && (
              <ProcessView onNavigate={handleNavigate} onOpenEnquiry={() => setIsEnquiryDrawerOpen(true)} />
            )}

            {currentView === 'kalkulator-rab' && (
              <KalkulatorRabView
                onCompleteEstimate={handleCompleteEstimate}
                onCompleteFloorPlan={handleCompleteFloorPlan}
                onNavigate={handleNavigate}
                initialInput={rabData?.input}
              />
            )}

            {currentView === 'konsultasi' && (
              <KonsultasiView
                rabData={rabData}
                floorPlanData={floorPlanData}
                aiRenderData={aiRenderData}
                onNavigate={handleNavigate}
                onSubmitLead={handleSubmitLead}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* GLOBAL STUDIO FOOTER */}
      <Footer onNavigate={handleNavigate} onOpenEnquiry={() => setIsEnquiryDrawerOpen(true)} />

      {/* GLOBAL 8-STEP ENQUIRY FORM DRAWER OVERLAY */}
      <EnquiryDrawer
        isOpen={isEnquiryDrawerOpen}
        onClose={() => setIsEnquiryDrawerOpen(false)}
        onSubmitLead={handleSubmitLead}
        initialRabData={rabData}
        initialFloorPlanData={floorPlanData}
      />
    </div>
  );
}

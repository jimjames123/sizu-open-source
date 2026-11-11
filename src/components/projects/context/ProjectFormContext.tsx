
import React, { createContext, useContext, useState } from 'react';

type TabType = 'basic' | 'details' | 'location';

interface ProjectFormContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  goToNextTab: () => void;
  goToPreviousTab: () => void;
}

const ProjectFormContext = createContext<ProjectFormContextType | undefined>(undefined);

export const ProjectFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');

  const goToNextTab = () => {
    if (activeTab === 'basic') {
      setActiveTab('details');
    } else if (activeTab === 'details') {
      setActiveTab('location');
    }
  };

  const goToPreviousTab = () => {
    if (activeTab === 'details') {
      setActiveTab('basic');
    } else if (activeTab === 'location') {
      setActiveTab('details');
    }
  };

  return (
    <ProjectFormContext.Provider 
      value={{ activeTab, setActiveTab, goToNextTab, goToPreviousTab }}
    >
      {children}
    </ProjectFormContext.Provider>
  );
};

export const useProjectFormContext = () => {
  const context = useContext(ProjectFormContext);
  if (context === undefined) {
    throw new Error('useProjectFormContext must be used within a ProjectFormProvider');
  }
  return context;
};

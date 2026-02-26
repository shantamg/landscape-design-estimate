import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import {
  loadSettings,
  initializeCatalog,
  getNextEstimateNumber,
  incrementEstimateNumber,
  loadEstimate,
} from "@/lib/storage";
import {
  EstimateProvider,
  createBlankEstimate,
} from "@/context/EstimateContext";
import { EstimateForm } from "@/components/estimate-form/EstimateForm";
import { EstimateList } from "@/components/estimate-list/EstimateList";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { sampleEstimate } from "@/data/sample-estimate";
import type { CatalogItem, Estimate } from "@/types";
import defaultCatalog from "@/data/default-catalog.json";
import { ContractForm } from "@/components/contract/ContractForm";

function App() {
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState("new");
  const [currentEstimate, setCurrentEstimate] = useState<Estimate>(() =>
    createBlankEstimate("NL-2026-001")
  );
  // Key to force re-mount EstimateProvider when loading a different estimate
  const [estimateKey, setEstimateKey] = useState(0);

  useEffect(() => {
    // Initialize catalog and settings on first load
    initializeCatalog(defaultCatalog as CatalogItem[]);

    // Load sample estimate for demo
    setCurrentEstimate(sampleEstimate);
    setInitialized(true);
  }, []);

  const handleNewEstimate = useCallback(() => {
    const settings = loadSettings();
    const estimateNumber = getNextEstimateNumber();
    incrementEstimateNumber();
    const blank = createBlankEstimate(estimateNumber, {
      taxRate: settings.defaults.taxRate,
      validDays: settings.defaults.validDays,
      terms: settings.defaults.terms,
      warranty: settings.defaults.warranty,
      exclusions: settings.defaults.exclusions,
    });
    setCurrentEstimate(blank);
    setEstimateKey((k) => k + 1);
    setActiveTab("new");
  }, []);

  const handleOpenEstimate = useCallback((id: string) => {
    const est = loadEstimate(id);
    if (est) {
      setCurrentEstimate(est);
      setEstimateKey((k) => k + 1);
      setActiveTab("new");
    }
  }, []);

  if (!initialized) return null;

  return (
    <EstimateProvider key={estimateKey} initialEstimate={currentEstimate}>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-forest">
                Nancy Lyons Garden Designs
              </h1>
              <p className="text-sm text-muted-foreground">Estimate Tool</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="new">New Estimate</TabsTrigger>
              <TabsTrigger value="saved">Saved Estimates</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              <EstimateForm />
            </TabsContent>

            <TabsContent value="saved">
              <EstimateList
                onOpenEstimate={handleOpenEstimate}
                onNewEstimate={handleNewEstimate}
              />
            </TabsContent>

            <TabsContent value="contracts">
              <div className="rounded-lg border border-border bg-card p-6">
                <ContractForm />
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <SettingsPage />
            </TabsContent>
          </Tabs>
        </main>

        <Toaster />
      </div>
    </EstimateProvider>
  );
}

export default App;

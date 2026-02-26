import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import {
  loadSettings,
  initializeCatalog,
  getNextEstimateNumber,
  incrementEstimateNumber,
  loadEstimate,
  duplicateEstimate,
} from "@/lib/storage";
import {
  EstimateProvider,
  createBlankEstimate,
} from "@/context/EstimateContext";
import { EstimateForm } from "@/components/estimate-form/EstimateForm";
import { EstimateList } from "@/components/estimate-list/EstimateList";
import { SettingsPage } from "@/components/settings/SettingsPage";
import type { CatalogItem, Estimate } from "@/types";
import defaultCatalog from "@/data/default-catalog.json";
import { ContractForm } from "@/components/contract/ContractForm";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { toast } from "sonner";

function App() {
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState("new");
  const [currentEstimate, setCurrentEstimate] = useState<Estimate | null>(null);
  // Key to force re-mount EstimateProvider when loading a different estimate
  const [estimateKey, setEstimateKey] = useState(0);
  // Pre-selected estimate ID for contract creation
  const [contractEstimateId, setContractEstimateId] = useState<string>("");

  useEffect(() => {
    // Initialize catalog and settings on first load
    initializeCatalog(defaultCatalog as CatalogItem[]);

    // Start with a blank estimate using settings defaults
    const settings = loadSettings();
    const estimateNumber = getNextEstimateNumber();
    const blank = createBlankEstimate(estimateNumber, {
      taxRate: settings.defaults.taxRate,
      validDays: settings.defaults.validDays,
      terms: settings.defaults.terms,
      warranty: settings.defaults.warranty,
      exclusions: settings.defaults.exclusions,
    });
    setCurrentEstimate(blank);
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

  const handleCreateContract = useCallback((estimateId: string) => {
    setContractEstimateId(estimateId);
    setActiveTab("contracts");
  }, []);

  const handleRevisionCreated = useCallback((id: string) => {
    const est = loadEstimate(id);
    if (est) {
      setCurrentEstimate(est);
      setEstimateKey((k) => k + 1);
      toast.info("Editing new revision.");
    }
  }, []);

  const handleDuplicate = useCallback((id: string) => {
    const dup = duplicateEstimate(id);
    if (dup) {
      toast.success(`Duplicated as ${dup.estimateNumber}`);
    }
  }, []);

  if (!initialized || !currentEstimate) return null;

  return (
    <EstimateProvider key={estimateKey} initialEstimate={currentEstimate}>
      <div className="min-h-screen bg-background">
        <header className="border-b-2 border-sage/30 bg-card px-6 py-5 print:hidden">
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage/15 flex items-center justify-center text-sage-dark font-heading text-lg font-bold shrink-0">
                NL
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-forest tracking-wide">
                  Nancy Lyons Garden Design
                </h1>
                <p className="text-xs text-stone tracking-wider uppercase">Estimate Builder</p>
              </div>
            </div>
            <AuthStatus />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 bg-sage/10 p-1 rounded-lg print:hidden">
              <TabsTrigger value="new" className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-md px-4">New Estimate</TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-md px-4">Saved Estimates</TabsTrigger>
              <TabsTrigger value="contracts" className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-md px-4">Contracts</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-md px-4">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              <EstimateForm onRevisionCreated={handleRevisionCreated} />
            </TabsContent>

            <TabsContent value="saved">
              <EstimateList
                onOpenEstimate={handleOpenEstimate}
                onNewEstimate={handleNewEstimate}
                onCreateContract={handleCreateContract}
                onDuplicate={handleDuplicate}
              />
            </TabsContent>

            <TabsContent value="contracts">
              <div className="rounded-lg border border-border bg-card p-6">
                <ContractForm preSelectedEstimateId={contractEstimateId} />
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

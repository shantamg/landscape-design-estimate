import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { loadSettings, initializeCatalog, getNextEstimateNumber } from "@/lib/storage";
import {
  EstimateProvider,
  createBlankEstimate,
} from "@/context/EstimateContext";
import { EstimateForm } from "@/components/estimate-form/EstimateForm";
import { sampleEstimate } from "@/data/sample-estimate";
import type { CatalogItem } from "@/types";
import defaultCatalog from "@/data/default-catalog.json";

function App() {
  const [initialized, setInitialized] = useState(false);
  const [initialEstimate, setInitialEstimate] = useState(() =>
    createBlankEstimate("NL-2026-001")
  );

  useEffect(() => {
    // Initialize catalog and settings on first load
    initializeCatalog(defaultCatalog as CatalogItem[]);
    const settings = loadSettings();
    const estimateNumber = getNextEstimateNumber();

    // Load sample estimate for demo, or create blank
    const useSample = true; // Toggle for demo mode
    if (useSample) {
      setInitialEstimate(sampleEstimate);
    } else {
      setInitialEstimate(
        createBlankEstimate(estimateNumber, {
          taxRate: settings.defaults.taxRate,
          validDays: settings.defaults.validDays,
          terms: settings.defaults.terms,
          warranty: settings.defaults.warranty,
          exclusions: settings.defaults.exclusions,
        })
      );
    }
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  return (
    <EstimateProvider initialEstimate={initialEstimate}>
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
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="new">New Estimate</TabsTrigger>
              <TabsTrigger value="saved">Saved Estimates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              <EstimateForm />
            </TabsContent>

            <TabsContent value="saved">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-xl font-heading font-bold mb-4">
                  Saved Estimates
                </h2>
                <p className="text-muted-foreground">
                  Estimate list will be built here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-xl font-heading font-bold mb-4">
                  Settings
                </h2>
                <p className="text-muted-foreground">
                  Settings page will be built here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <Toaster />
      </div>
    </EstimateProvider>
  );
}

export default App;

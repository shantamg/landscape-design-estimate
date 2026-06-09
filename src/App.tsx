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
  listEstimates,
  listContracts,
  listInvoices,
  loadCatalog,
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
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoiceList } from "@/components/invoice/InvoiceList";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { LoginPage } from "@/components/auth/LoginPage";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { pushAllToCloud, getSyncStatus, onSyncStatusChange } from "@/lib/sync";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { Cloud, CloudOff, Loader2, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

function App() {
  const { isAuthenticated, supabaseUnavailable } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <UpdateBanner />
      {supabaseUnavailable && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 print:hidden">
          <div className="mx-auto max-w-6xl flex items-center gap-2 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Cloud backup is currently unavailable — your work is saved locally but not being backed up.
            </span>
          </div>
        </div>
      )}
      <AppContent />
    </>
  );
}

function UpdateBanner() {
  const updateAvailable = useVersionCheck();
  if (!updateAvailable) return null;

  return (
    <div className="bg-sage text-white px-4 py-3 print:hidden">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <span className="text-sm font-medium">
          A newer version of the Estimate Builder is ready.
        </span>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-sage-dark hover:bg-white/90 transition-colors shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
          Update now
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState("new");
  const [currentEstimate, setCurrentEstimate] = useState<Estimate | null>(null);
  // Key to force re-mount EstimateProvider when loading a different estimate
  const [estimateKey, setEstimateKey] = useState(0);
  // Pre-selected estimate ID for contract/invoice creation
  const [contractEstimateId, setContractEstimateId] = useState<string>("");
  const [invoiceEstimateId, setInvoiceEstimateId] = useState<string>("");
  const [editInvoiceId, setEditInvoiceId] = useState<string>("");
  const [invoiceView, setInvoiceView] = useState<"form" | "list">("form");
  const [syncStatus, setSyncStatus] = useState(getSyncStatus());

  // Push all local data to cloud on mount (user just authenticated)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    pushAllToCloud({
      estimates: listEstimates(),
      contracts: listContracts(),
      invoices: listInvoices(),
      settings: loadSettings(),
      catalogs: {
        plant: loadCatalog("plant"),
        service: loadCatalog("service"),
        material: loadCatalog("material"),
      },
    });
  }, []);

  // Track sync status for header indicator
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const unsubscribe = onSyncStatusChange(setSyncStatus);
    return unsubscribe;
  }, []);

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
      designFeeDescription: settings.defaults.designFeeDescription,
      designFeePrice: settings.defaults.designFeePrice,
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
      designFeeDescription: settings.defaults.designFeeDescription,
      designFeePrice: settings.defaults.designFeePrice,
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

  const handleCreateInvoice = useCallback((estimateId: string) => {
    setEditInvoiceId("");
    setInvoiceEstimateId(estimateId);
    setInvoiceView("form");
    setActiveTab("invoices");
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
              <img src="/logo.png" alt="Nancy Lyons Garden Design" className="w-10 h-10 shrink-0" />
              <div>
                <h1 className="text-xl font-heading font-bold text-forest tracking-wide">
                  Nancy Lyons Garden Design
                </h1>
                <p className="text-xs text-stone tracking-wider uppercase">Estimate Builder</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone/60 font-mono" title="Build version">
                {__BUILD_STAMP__}
              </span>
              {isSupabaseConfigured() && (
                <span className="text-stone" title={`Sync: ${syncStatus}`}>
                  {syncStatus === "syncing" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {syncStatus === "synced" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                  {syncStatus === "error" && <CloudOff className="h-4 w-4 text-red-500" />}
                  {syncStatus === "idle" && <Cloud className="h-4 w-4 opacity-40" />}
                </span>
              )}
              <AuthStatus />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 bg-sage/10 p-1 rounded-lg print:hidden">
              <TabsTrigger value="new" className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-md px-4">New Estimate</TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-md px-4">Saved Estimates</TabsTrigger>
              <TabsTrigger value="contracts" className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-md px-4">Contracts</TabsTrigger>
              <TabsTrigger value="invoices" className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-md px-4">Invoices</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-md px-4">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              <EstimateForm />
            </TabsContent>

            <TabsContent value="saved">
              <EstimateList
                onOpenEstimate={handleOpenEstimate}
                onNewEstimate={handleNewEstimate}
                onCreateContract={handleCreateContract}
                onCreateInvoice={handleCreateInvoice}
                onDuplicate={handleDuplicate}
              />
            </TabsContent>

            <TabsContent value="contracts">
              <div className="rounded-lg border border-border bg-card p-6">
                <ContractForm preSelectedEstimateId={contractEstimateId} />
              </div>
            </TabsContent>

            <TabsContent value="invoices">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditInvoiceId("");
                      setInvoiceEstimateId("");
                      setInvoiceView("form");
                    }}
                    className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                      invoiceView === "form"
                        ? "bg-sage text-white"
                        : "text-stone hover:bg-sage/10"
                    }`}
                  >
                    {editInvoiceId ? "Edit Invoice" : "New Invoice"}
                  </button>
                  <button
                    onClick={() => setInvoiceView("list")}
                    className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                      invoiceView === "list"
                        ? "bg-sage text-white"
                        : "text-stone hover:bg-sage/10"
                    }`}
                  >
                    Saved Invoices
                  </button>
                </div>
                {invoiceView === "form" ? (
                  <div className="rounded-lg border border-border bg-card p-6">
                    <InvoiceForm
                      key={editInvoiceId || "new"}
                      preSelectedEstimateId={invoiceEstimateId}
                      editInvoiceId={editInvoiceId}
                    />
                  </div>
                ) : (
                  <InvoiceList
                    onOpenInvoice={(id) => {
                      setEditInvoiceId(id);
                      setInvoiceEstimateId("");
                      setInvoiceView("form");
                    }}
                    onNewInvoice={() => {
                      setEditInvoiceId("");
                      setInvoiceEstimateId("");
                      setInvoiceView("form");
                    }}
                  />
                )}
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

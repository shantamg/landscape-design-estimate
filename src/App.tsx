import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
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
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-xl font-heading font-bold mb-4">
                New Estimate
              </h2>
              <p className="text-muted-foreground">
                Estimate form will be built here.
              </p>
            </div>
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
              <h2 className="text-xl font-heading font-bold mb-4">Settings</h2>
              <p className="text-muted-foreground">
                Settings page will be built here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  );
}

export default App;

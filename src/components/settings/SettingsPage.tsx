import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LogoUpload } from "./LogoUpload";
import { loadSettings, saveSettings, exportAllData, importData, type ExportData } from "@/lib/storage";
import type { Settings } from "@/types";
import { toast } from "sonner";

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  // Reload settings when component mounts
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function updateCompany(field: string, value: string) {
    setSettings((prev) => ({
      ...prev,
      company: { ...prev.company, [field]: value },
    }));
  }

  function updateDefaults(field: string, value: string | number) {
    setSettings((prev) => ({
      ...prev,
      defaults: { ...prev.defaults, [field]: value },
    }));
  }

  function handleSave() {
    saveSettings(settings);
    toast.success("Settings saved");
  }

  function handleExport() {
    const data = exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nlgd-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported");
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as ExportData;
        importData(data);
        setSettings(loadSettings());
        toast.success("Data imported successfully");
      } catch {
        toast.error("Invalid backup file");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = "";
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Company Information */}
      <section className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="text-base font-heading font-bold text-forest tracking-wide">
          Company Information
        </h3>

        <LogoUpload
          logo={settings.company.logo}
          onChange={(base64) => updateCompany("logo", base64)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={settings.company.name}
              onChange={(e) => updateCompany("name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="companyAddress">Address</Label>
            <Input
              id="companyAddress"
              value={settings.company.address}
              onChange={(e) => updateCompany("address", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyCity">City</Label>
            <Input
              id="companyCity"
              value={settings.company.city}
              onChange={(e) => updateCompany("city", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="companyState">State</Label>
              <Input
                id="companyState"
                value={settings.company.state}
                onChange={(e) => updateCompany("state", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="companyZip">ZIP</Label>
              <Input
                id="companyZip"
                value={settings.company.zip}
                onChange={(e) => updateCompany("zip", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyPhone">Phone</Label>
            <Input
              id="companyPhone"
              value={settings.company.phone}
              onChange={(e) => updateCompany("phone", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyEmail">Email</Label>
            <Input
              id="companyEmail"
              type="email"
              value={settings.company.email}
              onChange={(e) => updateCompany("email", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyWebsite">Website</Label>
            <Input
              id="companyWebsite"
              value={settings.company.website}
              onChange={(e) => updateCompany("website", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Defaults */}
      <section className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="text-base font-heading font-bold text-forest tracking-wide">
          Estimate Defaults
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              step={0.1}
              min={0}
              max={25}
              value={settings.defaults.taxRate}
              onChange={(e) =>
                updateDefaults("taxRate", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="validDays">Estimate Valid (days)</Label>
            <Input
              id="validDays"
              type="number"
              min={1}
              value={settings.defaults.validDays}
              onChange={(e) =>
                updateDefaults("validDays", parseInt(e.target.value) || 30)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="estimatePrefix">Estimate # Prefix</Label>
            <Input
              id="estimatePrefix"
              value={settings.estimateNumberPrefix}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  estimateNumberPrefix: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="designFeeDescription">Default Design Fee Description</Label>
            <Input
              id="designFeeDescription"
              value={settings.defaults.designFeeDescription}
              onChange={(e) => updateDefaults("designFeeDescription", e.target.value)}
              placeholder="Design Fee — Property design"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="designFeePrice">Default Design Fee ($)</Label>
            <Input
              id="designFeePrice"
              type="number"
              min={0}
              step={100}
              value={settings.defaults.designFeePrice}
              onChange={(e) =>
                updateDefaults("designFeePrice", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-3">
            New estimates will include this design fee automatically. Set price to $0 to start without one.
          </p>
        </div>
      </section>

      {/* Default Terms */}
      <section className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="text-base font-heading font-bold text-forest tracking-wide">
          Default Terms & Conditions
        </h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="defaultTerms">Payment Terms</Label>
            <Textarea
              id="defaultTerms"
              value={settings.defaults.terms}
              onChange={(e) => updateDefaults("terms", e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="defaultWarranty">Warranty</Label>
            <Textarea
              id="defaultWarranty"
              value={settings.defaults.warranty}
              onChange={(e) => updateDefaults("warranty", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="defaultExclusions">Exclusions</Label>
            <Textarea
              id="defaultExclusions"
              value={settings.defaults.exclusions}
              onChange={(e) => updateDefaults("exclusions", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="text-base font-heading font-bold text-forest tracking-wide">
          Data Management
        </h3>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            Export All Data
          </Button>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              id="importFile"
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("importFile")?.click()}
            >
              Import Data
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Export creates a JSON backup of all estimates, settings, and catalog
          data. Import restores from a previously exported file.
        </p>
      </section>

      {/* Save Button */}
      <div className="sticky bottom-0 py-4 bg-background/95 backdrop-blur-sm border-t-2 border-sage/20 -mx-6 px-6">
        <Button onClick={handleSave} className="bg-sage hover:bg-sage-dark">
          Save Settings
        </Button>
      </div>
    </div>
  );
}

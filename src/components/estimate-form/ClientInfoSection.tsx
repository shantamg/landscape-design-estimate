import { useEstimate } from "@/context/EstimateContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClientInfo } from "@/types";

export function ClientInfoSection() {
  const { estimate, dispatch } = useEstimate();
  const { client } = estimate;

  function update(field: keyof ClientInfo, value: string) {
    dispatch({ type: "SET_CLIENT_FIELD", field, value });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-forest uppercase tracking-wide mb-4">
        Client Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="client-name">Client Name</Label>
          <Input
            id="client-name"
            value={client.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Full name"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="client-address">Address</Label>
          <Input
            id="client-address"
            value={client.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Street address"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-city">City</Label>
          <Input
            id="client-city"
            value={client.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="City"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="client-state">State</Label>
            <Input
              id="client-state"
              value={client.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder="CA"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client-zip">ZIP</Label>
            <Input
              id="client-zip"
              value={client.zip}
              onChange={(e) => update("zip", e.target.value)}
              placeholder="90000"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-phone">Phone</Label>
          <Input
            id="client-phone"
            value={client.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(310) 555-0000"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-email">Email</Label>
          <Input
            id="client-email"
            type="email"
            value={client.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="email@example.com"
          />
        </div>
      </div>
    </div>
  );
}

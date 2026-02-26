import { useEstimate } from "@/context/EstimateContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-stone/15 text-stone-dark border-stone/30",
  sent: "bg-sage/15 text-sage-dark border-sage/30",
  accepted: "bg-sage/25 text-forest border-sage/40",
  declined: "bg-terracotta/15 text-terracotta border-terracotta/30",
};

export function EstimateMetadata() {
  const { estimate, dispatch } = useEstimate();

  const today = new Date().toISOString().split("T")[0];
  const dateValue = estimate.createdAt
    ? estimate.createdAt.split("T")[0]
    : today;

  const statusStyle = STATUS_STYLES[estimate.status] ?? "bg-muted text-muted-foreground border-border";

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="space-y-1.5">
        <Label htmlFor="estimate-number">Estimate #</Label>
        <Input
          id="estimate-number"
          value={estimate.estimateNumber}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "estimateNumber",
              value: e.target.value,
            })
          }
          className="w-44"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="estimate-date">Date</Label>
        <Input
          id="estimate-date"
          type="date"
          value={dateValue}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "createdAt",
              value: new Date(e.target.value).toISOString(),
            })
          }
          className="w-44"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="estimate-status">Status</Label>
        <div className={`h-9 flex items-center px-3 text-sm font-medium rounded-md border capitalize w-28 ${statusStyle}`}>
          {estimate.status}
        </div>
      </div>
    </div>
  );
}

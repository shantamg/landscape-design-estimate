import { useEstimate } from "@/context/EstimateContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EstimateMetadata() {
  const { estimate, dispatch } = useEstimate();

  const today = new Date().toISOString().split("T")[0];
  const dateValue = estimate.createdAt
    ? estimate.createdAt.split("T")[0]
    : today;

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
        <div className="h-9 flex items-center px-3 text-sm rounded-md border border-input bg-muted/50 text-muted-foreground capitalize w-28">
          {estimate.status}
        </div>
      </div>
    </div>
  );
}

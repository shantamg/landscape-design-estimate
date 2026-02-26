import { loadSettings } from "@/lib/storage";

export function CompanyHeader() {
  const settings = loadSettings();
  const { name, phone, email } = settings.company;

  return (
    <div className="flex items-center gap-4 pb-4 border-b border-border">
      <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center text-sage-dark font-heading text-xl font-bold shrink-0">
        NL
      </div>
      <div>
        <h2 className="text-lg font-heading font-bold text-forest">{name}</h2>
        <div className="flex gap-4 text-sm text-muted-foreground">
          {phone && <span>{phone}</span>}
          {email && <span>{email}</span>}
        </div>
      </div>
    </div>
  );
}

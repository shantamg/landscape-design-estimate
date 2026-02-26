import { loadSettings } from "@/lib/storage";

export function CompanyHeader() {
  const settings = loadSettings();
  const { name, phone, email, logo } = settings.company;

  return (
    <div className="flex items-center gap-4 pb-4 border-b-2 border-sage/20">
      {logo ? (
        <img
          src={logo}
          alt={name}
          className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-sage/10"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-sage/15 flex items-center justify-center text-sage-dark font-heading text-2xl font-bold shrink-0 ring-2 ring-sage/10">
          NL
        </div>
      )}
      <div>
        <h2 className="text-lg font-heading font-bold text-forest tracking-wide">{name}</h2>
        <div className="flex gap-3 text-sm text-stone">
          {phone && <span>{phone}</span>}
          {phone && email && <span className="text-stone-light">|</span>}
          {email && <span>{email}</span>}
        </div>
      </div>
    </div>
  );
}

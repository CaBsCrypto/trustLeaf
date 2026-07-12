// Copyright © 2026 Browns Studio

interface PricingFeature {
  text: string;
}

interface PricingTierProps {
  badge: string;
  name: string;
  price: string;
  priceNote?: string;
  features: PricingFeature[];
  cta: { label: string; href: string };
  highlighted?: boolean;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 shrink-0 text-[#10B981]"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PricingCard({
  badge,
  name,
  price,
  priceNote,
  features,
  cta,
  highlighted = false,
}: PricingTierProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-7 transition-all ${
        highlighted
          ? "bg-[#1E293B] border-2 border-[#10B981] shadow-2xl shadow-[#10B981]/10 scale-[1.03] z-10"
          : "bg-[#1E293B] border border-[#334155] hover:border-[#475569]"
      }`}
    >
      {/* Badge */}
      <div className="mb-5">
        <span
          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase ${
            highlighted
              ? "bg-[#10B981] text-[#0F172A]"
              : "bg-[#334155] text-[#94A3B8]"
          }`}
        >
          {badge}
        </span>
      </div>

      {/* Name & price */}
      <h3 className="text-white font-extrabold text-xl mb-1">{name}</h3>
      <div className="mb-6">
        <span className="text-3xl font-extrabold text-white">{price}</span>
        {priceNote && (
          <span className="text-[#64748B] text-sm ml-2">{priceNote}</span>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#94A3B8]">
            <CheckIcon />
            {f.text}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={cta.href}
        className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition-all ${
          highlighted
            ? "bg-[#10B981] hover:bg-[#059669] text-[#0F172A] shadow-lg shadow-[#10B981]/20 hover:scale-105 active:scale-95"
            : "border border-[#334155] hover:border-[#475569] text-[#94A3B8] hover:text-white"
        }`}
      >
        {cta.label}
      </a>
    </div>
  );
}

export default function Pricing() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[#10B981] text-xs font-semibold uppercase tracking-widest">
            Precios
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-3">
            Pacientes gratis, siempre.
            <br />
            <span className="text-[#10B981]">Las clínicas pagan por el valor.</span>
          </h2>
          <p className="text-[#64748B] text-base max-w-lg mx-auto">
            Modelo B2B SaaS: clínicas y cadenas de farmacias pagan por acceso a la API.
            El paciente nunca paga nada.
          </p>

          {/* Annual discount note */}
          <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-[#10B981] text-sm font-semibold">
              Descuento del 20% pagando anual
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <PricingCard
            badge="GRATIS"
            name="Paciente"
            price="$0"
            priceNote="para siempre"
            features={[
              { text: "Historial clínico completo" },
              { text: "QR para compartir con médicos" },
              { text: "Recetas verificadas en blockchain" },
              { text: "Control de acceso total" },
              { text: "QR de emergencia" },
            ]}
            cta={{ label: "Únete a la lista de espera", href: "#cta" }}
          />

          <PricingCard
            badge="MÁS POPULAR"
            name="Clínica / Médico"
            price="$29 USD"
            priceNote="/mes por médico"
            features={[
              { text: "Todo lo del plan Paciente" },
              { text: "Hasta 500 recetas/mes por médico" },
              { text: "Panel de gestión de pacientes" },
              { text: "Integración con HIS existente (HL7/FHIR)" },
              { text: "Soporte prioritario" },
              { text: "Verificación de credenciales MINSAL incluida" },
            ]}
            cta={{ label: "Hablar con ventas", href: "mailto:hola@trustleaf.app" }}
            highlighted
          />

          <PricingCard
            badge="ENTERPRISE"
            name="Red / Hospital"
            price="A convenir"
            features={[
              { text: "Todo lo del plan Clínica" },
              { text: "Recetas ilimitadas" },
              { text: "API acceso completo" },
              { text: "SLA 99.9% uptime" },
              { text: "Onboarding dedicado" },
              { text: "Compliance Ley 21.719 certificado" },
              { text: "Branding personalizado" },
            ]}
            cta={{ label: "Contactar equipo", href: "mailto:enterprise@trustleaf.app" }}
          />
        </div>

        {/* Footer note */}
        <p className="text-center text-[#64748B] text-sm mt-10">
          ¿Tienes preguntas?{" "}
          <a
            href="mailto:hola@trustleaf.app"
            className="text-[#10B981] hover:underline"
          >
            Escríbenos a hola@trustleaf.app
          </a>
        </p>
      </div>
    </section>
  );
}

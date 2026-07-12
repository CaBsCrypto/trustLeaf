// Copyright © 2026 Browns Studio
// Translations for TrustLeaf landing page

export type Locale = "es" | "en";

const translations = {
  es: {
    howItWorks: {
      title: "Cómo funciona",
      step1: {
        icon: "🩺",
        title: "El médico firma",
        desc: "Receta o ficha clínica con Face ID. Sin contraseñas ni wallets.",
      },
      step2: {
        icon: "⛓️",
        title: "Blockchain la ancla",
        desc: "Stellar registra el documento. Inmutable, verificable, permanente.",
      },
      step3: {
        icon: "📱",
        title: "El paciente controla",
        desc: "Un QR. Comparte con quien quiera, cuando quiera.",
      },
    },
    faq: {
      label: "Preguntas frecuentes",
      title: "Resolvemos tus dudas",
      subtitle: "Todo lo que necesitas saber antes de unirte.",
      items: [
        {
          q: "¿Mis datos médicos están seguros?",
          a: "Sí. Datos cifrados, solo tú decides quién los ve. Face ID para autenticación — sin contraseñas. El registro en blockchain es inmutable.",
        },
        {
          q: "¿Necesito saber de crypto?",
          a: "No. TrustLeaf funciona como cualquier app — con Face ID. La blockchain trabaja en el fondo.",
        },
        {
          q: "¿Pueden los médicos acceder sin mi permiso?",
          a: "Nunca. Solo quien tú autorices puede ver tu ficha. Puedes revocar el acceso cuando quieras.",
        },
        {
          q: "¿Qué pasa si pierdo el teléfono?",
          a: "Tu historial está en blockchain, no en el teléfono. Recuperas acceso desde cualquier dispositivo.",
        },
        {
          q: "¿Cumple con la ley chilena?",
          a: "Sí. Cumple con la Ley 21.719 de protección de datos y estándares MINSAL.",
        },
      ],
    },
  },
  en: {
    howItWorks: {
      title: "How it works",
      step1: {
        icon: "🩺",
        title: "Doctor signs",
        desc: "Prescription or clinical record with Face ID. No passwords, no wallets.",
      },
      step2: {
        icon: "⛓️",
        title: "Blockchain anchors it",
        desc: "Stellar registers the document. Immutable, verifiable, permanent.",
      },
      step3: {
        icon: "📱",
        title: "Patient controls it",
        desc: "One QR code. Share with anyone, anytime.",
      },
    },
    faq: {
      label: "FAQ",
      title: "Your questions, answered",
      subtitle: "Everything you need to know before joining.",
      items: [
        {
          q: "Is my medical data safe?",
          a: "Yes. Data is encrypted and only you decide who sees it. Face ID for authentication — no passwords. The blockchain record is immutable.",
        },
        {
          q: "Do I need to know about crypto?",
          a: "No. TrustLeaf works like any app — with Face ID. The blockchain works in the background.",
        },
        {
          q: "Can doctors access my records without my permission?",
          a: "Never. Only those you explicitly authorize can view your record. You can revoke access at any time.",
        },
        {
          q: "What if I lose my phone?",
          a: "Your history is on blockchain, not the phone. Recover access from any device with your verified identity.",
        },
        {
          q: "Does it comply with Chilean law?",
          a: "Yes. Complies with Law 21.719 on personal data protection and MINSAL medical privacy standards.",
        },
      ],
    },
  },
} as const;

export type Translations = typeof translations.es;

export function getTranslations(locale: Locale = "es"): Translations {
  return translations[locale] ?? translations.es;
}

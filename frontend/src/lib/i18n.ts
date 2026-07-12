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
      step4: {
        icon: "📓",
        title: "Registra tu progreso diario",
        desc: "El Diario de Dolor convierte tu experiencia cotidiana en datos médicos verificados. Tu médico ve patrones que de otra forma nunca detectaría.",
      },
    },
    faq: {
      label: "Preguntas frecuentes",
      title: "Resolvemos tus dudas",
      subtitle: "Todo lo que necesitas saber antes de unirte.",
      groups: [
        {
          categoryLabel: "Para médicos",
          questions: [
            {
              q: "¿Cómo sé que una receta no puede ser falsificada?",
              a: "Cada receta es firmada digitalmente con tu Face ID y registrada en Stellar Blockchain. Para falsificarla, alguien necesitaría acceso físico a tu teléfono desbloqueado y a tu cara. Es más seguro que cualquier receta en papel o PDF.",
            },
            {
              q: "¿Qué pasa si un paciente revoca mi acceso?",
              a: "Solo dejas de ver sus registros futuros. Los datos que ya firmaste quedan en blockchain permanentemente — son parte del historial verificable del paciente. La revocación no borra tu trabajo clínico.",
            },
            {
              q: "¿Cómo me registro como médico verificado?",
              a: "Ingresas tu RUT y número de registro MINSAL. TrustLeaf verifica tu credencial contra el registro público de profesionales de salud de Chile. El proceso toma minutos, no días.",
            },
          ],
        },
        {
          categoryLabel: "Para pacientes",
          questions: [
            {
              q: "¿Mi seguro o empleador puede ver mis datos?",
              a: "No. TrustLeaf nunca comparte tu información con terceros sin tu autorización explícita. Tú eliges quién tiene acceso — y puedes revocar ese acceso en cualquier momento desde tu celular.",
            },
            {
              q: "¿Qué pasa si cambio de teléfono o lo pierdo?",
              a: "Tu historial está en blockchain, no en el dispositivo. Al instalar TrustLeaf en un nuevo teléfono, recuperas acceso completo con tu identidad verificada (Face ID + passkey). Nada se pierde.",
            },
            {
              q: "¿TrustLeaf tiene costo para los pacientes?",
              a: "Gratis durante toda la beta. El modelo de negocio es B2B — las clínicas y farmacias pagan por acceso API. Para los pacientes, siempre será gratuito.",
            },
          ],
        },
        {
          categoryLabel: "Para inversores",
          questions: [
            {
              q: "¿Por qué blockchain en vez de una base de datos tradicional?",
              a: "Una base de datos la controla quien la opera — puede ser hackeada, modificada, o cerrada. Un registro en Stellar Blockchain es inmutable y no requiere confiar en TrustLeaf como empresa. Si TrustLeaf desaparece mañana, los registros del paciente siguen existiendo y son verificables.",
            },
            {
              q: "¿Cómo hace dinero TrustLeaf?",
              a: "SaaS B2B: clínicas y redes de farmacias pagan una suscripción mensual por acceso a la API de verificación. También licenciamos el SDK a sistemas HIS (Hospital Information Systems). El paciente siempre gratis.",
            },
            {
              q: "¿Por qué Chile primero?",
              a: "Chile tiene la infraestructura digital más avanzada de Latinoamérica (RUT universal, ClaveÚnica), una nueva ley de protección de datos (Ley 21.719) que crea urgencia regulatoria, y una red de clínicas privadas donde el dolor crónico es el diagnóstico más frecuente. Es el mercado ideal para demostrar el modelo antes de expandir a México, Colombia y Brasil.",
            },
          ],
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
      step4: {
        icon: "📓",
        title: "Track your daily progress",
        desc: "The Pain Diary turns your daily experience into verified medical data. Your doctor sees patterns they would never otherwise detect.",
      },
    },
    faq: {
      label: "FAQ",
      title: "Your questions, answered",
      subtitle: "Everything you need to know before joining.",
      groups: [
        {
          categoryLabel: "For doctors",
          questions: [
            {
              q: "How do I know a prescription can't be forged?",
              a: "Every prescription is digitally signed with your Face ID and recorded on Stellar Blockchain. To forge it, someone would need physical access to your unlocked phone and your face. It's more secure than any paper or PDF prescription.",
            },
            {
              q: "What happens if a patient revokes my access?",
              a: "You simply stop seeing their future records. The data you already signed stays on blockchain permanently — it's part of the patient's verifiable history. Revocation doesn't erase your clinical work.",
            },
            {
              q: "How do I register as a verified doctor?",
              a: "Enter your RUT and MINSAL registration number. TrustLeaf verifies your credential against Chile's public health professional registry. The process takes minutes, not days.",
            },
          ],
        },
        {
          categoryLabel: "For patients",
          questions: [
            {
              q: "Can my insurer or employer see my data?",
              a: "No. TrustLeaf never shares your information with third parties without your explicit authorization. You choose who has access — and you can revoke that access at any time from your phone.",
            },
            {
              q: "What if I change phones or lose mine?",
              a: "Your history is on blockchain, not the device. When you install TrustLeaf on a new phone, you regain full access with your verified identity (Face ID + passkey). Nothing is lost.",
            },
            {
              q: "Is TrustLeaf free for patients?",
              a: "Free throughout the entire beta. The business model is B2B — clinics and pharmacies pay for API access. For patients, it will always be free.",
            },
          ],
        },
        {
          categoryLabel: "For investors",
          questions: [
            {
              q: "Why blockchain instead of a traditional database?",
              a: "A database is controlled by whoever operates it — it can be hacked, modified, or shut down. A record on Stellar Blockchain is immutable and requires no trust in TrustLeaf as a company. If TrustLeaf disappears tomorrow, the patient's records still exist and are verifiable.",
            },
            {
              q: "How does TrustLeaf make money?",
              a: "B2B SaaS: clinics and pharmacy networks pay a monthly subscription for access to the verification API. We also license the SDK to HIS (Hospital Information Systems). Patients always free.",
            },
            {
              q: "Why Chile first?",
              a: "Chile has the most advanced digital infrastructure in Latin America (universal RUT, ClaveÚnica), a new data protection law (Law 21.719) creating regulatory urgency, and a private clinic network where chronic pain is the most frequent diagnosis. It's the ideal market to prove the model before expanding to Mexico, Colombia, and Brazil.",
            },
          ],
        },
      ],
    },
  },
} as const;

export type Translations = typeof translations.es;

export function getTranslations(locale: Locale = "es"): Translations {
  return translations[locale] ?? translations.es;
}

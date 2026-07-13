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
              a: "Cada receta se firma con tu Face ID y queda anclada en Stellar Blockchain. El hash criptográfico en la cadena es verificable por cualquier farmacia escaneando el QR — si alguien modifica un solo carácter, la verificación falla. Es más seguro que cualquier receta en papel o PDF, donde basta un escáner y Photoshop.",
            },
            {
              q: "¿Qué datos del paciente veo como médico?",
              a: "Ves todo lo que el paciente te autorizó: historial de consultas previas, medicamentos activos, el Diario de Dolor (patrones de síntomas día a día), notas del cuidador si aplica, y alertas de alergias. La vista del médico está diseñada para la consulta: la información crítica aparece primero, sin scroll innecesario.",
            },
            {
              q: "¿Qué pasa si un paciente revoca mi acceso?",
              a: "Dejas de ver sus registros futuros. Los documentos que ya firmaste quedan en blockchain permanentemente como parte del historial del paciente — la revocación no borra tu trabajo clínico pasado. Tú también puedes ver en tu panel qué pacientes tienes activos y cuáles revocaron.",
            },
            {
              q: "¿Cómo me registro como médico verificado?",
              a: "Ingresas tu RUT y número de registro MINSAL. TrustLeaf lo verifica automáticamente contra el registro público de profesionales de salud. En minutos tienes tu perfil verificado y puedes empezar a firmar documentos. Sin formularios en papel ni esperar aprobación manual.",
            },
          ],
        },
        {
          categoryLabel: "Para pacientes y cuidadores",
          questions: [
            {
              q: "¿Cómo funciona el Diario de Dolor o el Diario de Episodios?",
              a: "Es un registro diario estructurado — zona de dolor, intensidad del 1 al 10, qué lo desencadenó, qué ayudó. Para cuidadores hay 8 tipos de síntoma cognitivo (confusión, agitación, caídas, etc.). Cada entrada queda verificada en blockchain con timestamp. El médico lo ve antes de la consulta y llega sabiendo qué pasó en casa — sin que tengas que explicar todo de cero.",
            },
            {
              q: "¿Para qué sirve el QR de emergencia?",
              a: "Es un código QR que cualquier médico de urgencias puede escanear sin app ni login. Muestra alergias, medicamentos activos, diagnóstico y contactos de emergencia. Para pacientes con Alzheimer u otras condiciones, está disponible en español e inglés. Si el paciente no puede comunicarse, el QR habla por él.",
            },
            {
              q: "¿Mi seguro o empleador puede ver mis datos?",
              a: "No. Tú decides quién tiene acceso — y puedes revocar ese acceso desde tu celular en cualquier momento. TrustLeaf nunca comparte datos con terceros sin tu autorización explícita, incluidos aseguradoras, empleadores o farmacias que no elegiste tú.",
            },
            {
              q: "¿TrustLeaf tiene costo para pacientes y cuidadores?",
              a: "Gratis — siempre. El portal de pacientes, el Diario de Dolor, el QR de emergencia y el portal de cuidadores son gratuitos. TrustLeaf cobra a médicos y clínicas, no a quienes más lo necesitan.",
            },
          ],
        },
        {
          categoryLabel: "Para inversores",
          questions: [
            {
              q: "¿Por qué blockchain en vez de una base de datos tradicional?",
              a: "Una base de datos la controla quien la opera — puede ser hackeada, modificada o cerrada. Un hash en Stellar Blockchain es inmutable y verificable por cualquier parte sin pasar por TrustLeaf. Si TrustLeaf desaparece mañana, los registros del paciente siguen existiendo y son verificables. La confianza no depende de nosotros.",
            },
            {
              q: "¿Cómo hace dinero TrustLeaf?",
              a: "Modelo mixto: médicos independientes pagan un porcentaje por consulta gestionada a través de TrustLeaf (sin fee fijo — solo pagan cuando ganan). Clínicas y redes de farmacias pagan suscripción mensual por acceso API. Las familias y pacientes siempre gratis. El modelo por consulta alinea incentivos: TrustLeaf crece cuando el médico crece.",
            },
            {
              q: "¿Por qué Chile primero?",
              a: "Chile tiene la infraestructura digital más avanzada de Latinoamérica (RUT universal, ClaveÚnica), una nueva ley de protección de datos (Ley 21.719) que crea urgencia regulatoria, y una red de clínicas privadas donde el dolor crónico es el diagnóstico más frecuente. Es el mercado ideal para validar el modelo antes de expandir a México, Colombia y Brasil.",
            },
            {
              q: "¿Qué pasa con el mandato de receta electrónica del Minsal?",
              a: "El Reglamento Minsal está eliminando la receta en papel para medicamentos de mayor control. TrustLeaf no compite con eso — lo implementa con una capa de verificación blockchain encima. Las farmacias que ya deben aceptar recetas digitales integran TrustLeaf escaneando el QR, sin cambiar su sistema POS.",
            },
            {
              q: "¿Por qué el portal de cuidadores no es scope creep?",
              a: "El cuidador de un adulto mayor con Alzheimer visita al neurólogo 6–8 veces por año. Cada consulta necesita exactamente lo que TrustLeaf provee: historial de episodios, medicamentos activos, y un resumen clínico verificado. Es el mismo producto, aplicado al mismo problema, para un segmento de 53 millones de cuidadores globales que no tiene ninguna herramienta para esto. No es un feature extra — es el segundo mercado principal.",
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
};

export type Translations = typeof translations.es;

export function getTranslations(locale: Locale = "es"): Translations {
  return (translations[locale] ?? translations.es) as Translations;
}

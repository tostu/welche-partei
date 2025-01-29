import type { FullCategory } from "$lib/categories";

export interface Question {
  id: number;
  text: string;
  answers: { text: string; category: FullCategory }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "Wie ist Ihre Wohnsituation?",
    answers: [
      { text: "Zur Miete", category: "wohnen_miete" },
      { text: "Eigentümer", category: "wohnen_eigentum" },
    ],
  },
  {
    id: 2,
    text: "Wie hoch ist Ihr monatliches Nettoeinkommen?",
    answers: [
      { text: "Unter 2.000 €", category: "einkommen_niedrig" },
      { text: "2.000–4.000 €", category: "einkommen_mittel" },
      { text: "Über 4.000 €", category: "einkommen_hoch" },
    ],
  },
  {
    id: 3,
    text: "Welche Lebenssituation beschreibt Sie am besten?",
    answers: [
      { text: "Alleinerziehend", category: "lebenssituation_alleinerziehend" },
      { text: "Wohnungslos", category: "lebenssituation_wohnungslos" },
      { text: "Studierend", category: "lebenssituation_studierend" },
      { text: "In Ausbildung", category: "lebenssituation_auszubildend" },
    ],
  },
  {
    id:4,
    text: "Wo leben Sie überwiegend?",
    answers: [
      { text: "In einer Großstadt", category: "urbanisierung_grossstadt" },
      { text: "In einem ländlichen Gebiet", category: "urbanisierung_laendlich" },
    ],
  },
  {
    id: 5,
    text: "Welche politische Priorität ist Ihnen am wichtigsten?",
    answers: [
      { text: "Soziale Gerechtigkeit", category: "prioritaet_soziale_gerechtigkeit" },
      { text: "Klimapolitik", category: "prioritaet_klimapolitik" },
      { text: "Steuerentlastung", category: "prioritaet_steuerentlastung" },
      { text: "Infrastruktur", category: "prioritaet_infrastruktur" },
      { text: "Eigentumsförderung", category: "prioritaet_eigentumsfoerderung" },
      { text: "Marktlösungen", category: "prioritaet_marktloesungen" },
    ],
  },
];
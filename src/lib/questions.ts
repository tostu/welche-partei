import type { FullCategory } from "$lib/categories";

export interface Question {
  id: number;
  text: string;
  answers: { text: string; category: FullCategory, icon: string }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "Wie ist Ihre Wohnsituation?",
    answers: [
      { text: "Zur Miete", category: "wohnen_miete", icon: "home" },
      { text: "Eigentümer", category: "wohnen_eigentum", icon: "key" },
    ],
  },
  {
    id: 2,
    text: "Wie hoch ist Ihr monatliches Nettoeinkommen?",
    answers: [
      { text: "Unter 2.000 €", category: "einkommen_niedrig", icon: "currency-euro" },
      { text: "2.000–4.000 €", category: "einkommen_mittel", icon: "wallet" },
      { text: "Über 4.000 €", category: "einkommen_hoch", icon: "chart-bar" },
    ],
  },
  {
    id: 3,
    text: "Welche Lebenssituation beschreibt Sie am besten?",
    answers: [
      { text: "Alleinerziehend", category: "lebenssituation_alleinerziehend", icon: "user" },
      { text: "Wohnungslos", category: "lebenssituation_wohnungslos", icon: "home-off" },
      { text: "Studierend", category: "lebenssituation_studierend", icon: "school" },
      { text: "In Ausbildung", category: "lebenssituation_auszubildend", icon: "briefcase" },
    ],
  },
  {
    id: 4,
    text: "Wo leben Sie überwiegend?",
    answers: [
      { text: "In einer Großstadt", category: "urbanisierung_grossstadt", icon: "building-skyscraper" },
      { text: "In einem ländlichen Gebiet", category: "urbanisierung_laendlich", icon: "trees" },
    ],
  },
  {
    id: 5,
    text: "Welche politische Priorität ist Ihnen am wichtigsten?",
    answers: [
      { text: "Soziale Gerechtigkeit", category: "prioritaet_soziale_gerechtigkeit", icon: "scale" },
      { text: "Klimapolitik", category: "prioritaet_klimapolitik", icon: "leaf" },
      { text: "Steuerentlastung", category: "prioritaet_steuerentlastung", icon: "percentage" },
      { text: "Infrastruktur", category: "prioritaet_infrastruktur", icon: "road" },
      { text: "Eigentumsförderung", category: "prioritaet_eigentumsfoerderung", icon: "home" },
      { text: "Marktlösungen", category: "prioritaet_marktloesungen", icon: "chart-line" },
    ],
  },
];

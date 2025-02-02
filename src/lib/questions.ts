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
      { text: "Zur Miete", category: "wohnen_miete", icon: "tabler--home" },
      { text: "Eigentümer", category: "wohnen_eigentum", icon: "tabler--key" },
    ],
  },
  {
    id: 2,
    text: "Wie hoch ist Ihr monatliches Nettoeinkommen?",
    answers: [
      { text: "Unter 2.000 €", category: "einkommen_niedrig", icon: "tabler--currency-euro" },
      { text: "2.000–4.000 €", category: "einkommen_mittel", icon: "tabler--wallet" },
      { text: "Über 4.000 €", category: "einkommen_hoch", icon: "tabler--chart-bar" },
    ],
  },
  {
    id: 3,
    text: "Welche Lebenssituation beschreibt Sie am besten?",
    answers: [
      { text: "Alleinerziehend", category: "lebenssituation_alleinerziehend", icon: "tabler--user" },
      { text: "Wohnungslos", category: "lebenssituation_wohnungslos", icon: "tabler--home-off" },
      { text: "Studierend", category: "lebenssituation_studierend", icon: "tabler--school" },
      { text: "In Ausbildung", category: "lebenssituation_auszubildend", icon: "tabler--briefcase" },
    ],
  },
  {
    id: 4,
    text: "Wo leben Sie überwiegend?",
    answers: [
      { text: "In einer Großstadt", category: "urbanisierung_grossstadt", icon: "tabler--building-skyscraper" },
      { text: "In einem ländlichen Gebiet", category: "urbanisierung_laendlich", icon: "tabler--trees" },
    ],
  },
  {
    id: 5,
    text: "Welche politische Priorität ist Ihnen am wichtigsten?",
    answers: [
      { text: "Soziale Gerechtigkeit", category: "prioritaet_soziale_gerechtigkeit", icon: "tabler--scale" },
      { text: "Klimapolitik", category: "prioritaet_klimapolitik", icon: "tabler--leaf" },
      { text: "Steuerentlastung", category: "prioritaet_steuerentlastung", icon: "tabler--percentage" },
      { text: "Infrastruktur", category: "prioritaet_infrastruktur", icon: "tabler--road" },
      { text: "Eigentumsförderung", category: "prioritaet_eigentumsfoerderung", icon: "tabler--home" },
      { text: "Marktlösungen", category: "prioritaet_marktloesungen", icon: "tabler--chart-line" },
    ],
  },
];

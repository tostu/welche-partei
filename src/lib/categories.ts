export const categories = {
    wohnen: ["miete", "eigentum"] as const,
    einkommen: ["niedrig", "mittel", "hoch"] as const,
    lebenssituation: [
      "alleinerziehend",
      "wohnungslos",
      "studierend",
      "auszubildend",
    ] as const,
    urbanisierung: ["grossstadt", "laendlich"] as const,
    prioritaet: [
      "soziale_gerechtigkeit",
      "klimapolitik",
      "steuerentlastung",
      "infrastruktur",
      "eigentumsfoerderung",
      "marktloesungen",
    ] as const,
} as const;
  

export type MainCategory = keyof typeof categories;
export type SubCategory<C extends MainCategory> = typeof categories[C][number];
export type FullCategory = `${MainCategory}_${SubCategory<MainCategory>}`;
  


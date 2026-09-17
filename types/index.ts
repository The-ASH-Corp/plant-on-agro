export type Section = "home" | "how-it-works" | "trees" | "impact" | "plant";

export type TreeCategory =
  | "All"
  | "Fruit Trees"
  | "Native Trees"
  | "Timber Trees"
  | "Medicinal"
  | "Shade Trees"
  | "Occasion";

export type PlantStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Tree {
  id: number;
  name: string;
  sci: string;
  category: TreeCategory;
  price: number;
  location: string;
  growth: string;
  img: string;
  desc: string;
}

export interface Plan {
  id: string;
  label: string;
  icon: string;
  desc: string;
  price: number;
}

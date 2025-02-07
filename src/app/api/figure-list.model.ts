import { Figure } from "./figure.model";

export interface UserFigurineLists {
    liked: Figure[];
    wanted: Figure[];
    [key: string]: Figure[];
}
  
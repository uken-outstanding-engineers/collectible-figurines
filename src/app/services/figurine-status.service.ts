import { Figure } from '../api/figure.model';
import { UserFigurineLists } from '../api/figure-list.model';

export function toggleListActiveFigurine(figure: Figure, userId: number | null, listName: string, toggleService: any): void {
  if (!userId || !figure.id) return;

  toggleService.toggleFigurine(userId, figure.id, listName).subscribe(() => {
    const property = `is${listName}`;

    if (figure.hasOwnProperty(property)) {
      figure[property] = !figure[property];

      if (listName === 'Owned' && figure.isOwned) {
        figure.isWanted = false;
      } else if (listName === 'Wanted' && figure.isWanted) {
        figure.isOwned = false;
      }
    }
  });
}

// export function loadFiguresPropertyFigurine(
//     userId: number | null, 
//     figureListService: any, 
//     figures: Figure[], 
//     property: string, 
//     listKey: string
//   ): void {
//     if (!userId) return;
//     console.log("in")
//     figureListService.getUserFigurineLists(userId).subscribe((lists: UserFigurineLists) => {
//       if (lists[listKey]) {
//         const figureIds = lists[listKey]
//           .map((figurine: Figure) => figurine.id)
//           .filter((id: number | null) => id !== null) as number[];
  
//         figures.forEach((figure: Figure) => {
//           if (figure.id !== null) {
//             figure[property] = figureIds.includes(figure.id);
//           }
//         });
//       }
//     });
// }
  
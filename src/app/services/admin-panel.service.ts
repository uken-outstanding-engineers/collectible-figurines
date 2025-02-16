import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AdminPanelService {
    openDialog(): void {
        document.body.classList.add('dialog-open');
    }

    closeDialog(): void {
        document.body.classList.remove('dialog-open');
    }
}
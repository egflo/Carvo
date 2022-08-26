import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ResultsService} from "../results/results.service";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../auth.service";
import {DialogService} from "./dialog.service";

export interface DialogData {
  description: string;
  query: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    protected dialogService: DialogService,
    protected auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {

    this.dialogService.saveSearch(this.data.query, this.data.description).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error : (error) => {
        console.log(error);
      }
    });
  }
}

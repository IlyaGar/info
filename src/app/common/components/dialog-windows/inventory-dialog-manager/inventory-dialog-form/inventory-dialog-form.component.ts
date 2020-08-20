import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StillageItem } from 'src/app/wms-map/models/stillage-item';
import { InventoryItem } from 'src/app/wms-map/models/inventory-item';

export interface DialogData {
  list: Array<InventoryItem>;
}

@Component({
  selector: 'app-inventory-dialog-form',
  templateUrl: './inventory-dialog-form.component.html',
  styleUrls: ['./inventory-dialog-form.component.css']
})
export class InventoryDialogFormComponent implements OnInit {

  list = [];

  constructor(
    public dialogRef: MatDialogRef<InventoryDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit() {
    let list = this.data;
  }

  onOkClick() {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(true);
  }
}

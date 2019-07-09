import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmaSaldo } from '../../../../../core/models/confirmaSaldo';

@Component({
  selector: 'm-dialogo-venta',
  templateUrl: './dialogo-venta.component.html'
})
export class DialogoVentaComponent implements OnInit {

  compra: ConfirmaSaldo;
  vacio : string = "";
  constructor(
    private dialogRef: MatDialogRef<DialogoVentaComponent>,
    @Inject(MAT_DIALOG_DATA) data
    ) { 
      this.compra = data;
    }

  ngOnInit() {
  }

  save(){
    this.dialogRef.close({
      action: 'save'
    })
  }

  cancel(){
    this.dialogRef.close({
      action: 'cancel'
    })
  }

}

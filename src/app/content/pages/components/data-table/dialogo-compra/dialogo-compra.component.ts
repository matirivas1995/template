import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ComprasLog } from '../../../../../core/models/comprasLog';

@Component({
  selector: 'm-dialogo-compra',
  templateUrl: './dialogo-compra.component.html',
  styleUrls: ['./dialogo-compra.component.scss']
})
export class DialogoCompraComponent implements OnInit {

  compra: ComprasLog;
  vacio : string = "";
  constructor(
    private dialogRef: MatDialogRef<DialogoCompraComponent>,
    @Inject(MAT_DIALOG_DATA) data
    ) { 
      this.compra = data;
    }

  ngOnInit() {
  }

}

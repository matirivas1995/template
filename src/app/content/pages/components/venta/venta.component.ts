import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { tap } from 'rxjs/operators';
import { Banco } from '../../../../core/models/banco';
import { CompraSaldoRequest } from '../../../../core/models/compraSaldoRequest';
import { ConfirmaSaldo } from '../../../../core/models/confirmaSaldo';
import { ConfirmaSaldoResponse } from '../../../../core/models/confirmaSaldoResponse';
import { Dealer } from '../../../../core/models/dealer';
import { Msisdn } from '../../../../core/models/msisdn';
import { DataTableService } from '../../../../core/services/datatable.service';
import { SpinnerButtonOptions } from '../general/spinner-button/button-options.interface';
import { DialogoVentaComponent } from './dialogo-venta/dialogo-venta.component';



@Component({
  selector: 'm-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VentaComponent implements OnInit {

  tipoValue: string = 'con';
  form: FormGroup;
  agentes: Dealer[];
  selectedAgent: Dealer = new Dealer();
  codigos: Msisdn [];
  msiRequest: Msisdn = new Msisdn();
  numeros: Msisdn [];
  codigoSelected: boolean = true;
  tipoSelected: boolean = false;
  vacio : string = "";
  code: Msisdn;
  bancos: Banco [];
  exito: boolean;
  fracaso: boolean;
  importe: number;
  importeSelected: boolean = true;
  compraRequest: CompraSaldoRequest = new CompraSaldoRequest();
  confirmaSaldoResponse: ConfirmaSaldoResponse = new ConfirmaSaldoResponse();


  spinner: SpinnerButtonOptions = {
		active: false,
		spinnerSize: 18,
		raised: true,
		buttonColor: 'accent',
		spinnerColor: 'accent',
		fullWidth: false
	};

  tipos = [
    { value: 'con', viewValue: 'Contado' },
		{ value: 'cre', viewValue: 'Credito' }
  ];

  formas = [
    { value: 'che', viewValue: 'Cheque' },
		{ value: 'tra', viewValue: 'Transferencia' }
  ];
  choice: boolean;

  constructor(private fb: FormBuilder, 
    private dataTableService: DataTableService, 
    public dialog: MatDialog) { }



  ngOnInit() {
    this.dataTableService.getDealers().pipe(
			tap(res => {
        this.agentes = res.entidad.lista;
			})
    ).subscribe();
    this.dataTableService.getBancos().pipe(
			tap(res => {
        this.bancos = res.entidad.lista;
			})
		).subscribe();
    this.createForm();
    this.exito = false;
    this.fracaso = false;
  }


  createForm(): any {
    this.form = new FormGroup({
      Agente: new FormControl(''),
      Tipo: new FormControl(''),
      ImportePagar: new FormControl({value: '', disabled: true}),
      Msisdn: new FormControl({value: '' , disabled: this.codigoSelected }),
      Banco: new FormControl(''),
      Transaccion: new FormControl(''),
      Cheque: new FormControl(''),
      Cuenta: new FormControl(''),
      Boleta: new FormControl(''),
    });
  }

  change(event: any) {
    if(event.source.selected === true){
      this.selectedAgent.id = event.source.value;
      this.msiRequest.dealer = this.selectedAgent;
      this.dataTableService.getMsisdnData(this.msiRequest).pipe(
        tap(res => {
          this.codigoSelected = false;
          this.codigos = res.entidad.lista;
        })
      ).subscribe();
    }
  }

  changeTipo(event: any) {
    if(event.source.selected === true){
      if(event.source.value === "con"){
        this.tipoSelected = true;
      } else {
        this.tipoSelected = false;
      }
    }
  }

  changeForma(event: any){
    if(event.source.selected === true){
      if(event.source.value === "che"){
        this.choice = true;
      } else {
        this.choice = false;
      }
    }
  }

  changeMsisdn(event: any){
    if(event.source.selected === true){
      this.dataTableService.getEpinData(event.source.value).pipe(
        tap(res => {
          this.form.controls['ImportePagar'].enable();
          this.code = res.entidad.lista[0];
        })
      ).subscribe();
    }
  }

  clean(){
    this.code = new Msisdn();
    this.form.reset();
    this.importe = 0;
  }

  modelChanged(event: any){
    if(event!=null){
      this.importe = +((event * 100)/(100 - this.code.descuento.valueOf())).toFixed(2);

      /*var incremento = (event * (this.code.descuento.valueOf()/100));
      this.importe = Number(event.valueOf()) + Number(incremento);*/
    }
  }

  submit() {
    this.spinner.active = true;
    this.compraRequest.codAccion = "SOL_CPREPN";
    this.compraRequest.msisdn = this.code.msisdn;
    this.compraRequest.codEpin = this.code.epin_code;
    this.compraRequest.montoCobrar = this.form.value.ImportePagar.toString();
	this.compraRequest.condicion = this.tipoSelected ? 'CONTADO' : 'CREDITO';
	if (this.compraRequest.condicion === 'CONTADO') {
		this.compraRequest.formaPago = this.choice ? 'CHEQUE' : 'TRANSFERENCIA';
		this.compraRequest.codBanco = this.form.value.Banco;
		this.compraRequest.nroTransaccion = this.choice ? '' : this.form.value.Transaccion.toString();
		this.compraRequest.cuenta = this.form.value.Cuenta.toString();
		this.compraRequest.nroCheque = this.choice ? this.form.value.Cheque.toString() : '';
		this.compraRequest.nroBoleta = this.choice ? this.form.value.Boleta.toString() : '';
	}
    this.dataTableService.buy(this.compraRequest).pipe(
      tap(res => {
        this.spinner.active = false;
        this.confirmaSaldoResponse = res.entidad;
        this.createDialog(this.confirmaSaldoResponse);
        }, err => {
        this.spinner.active = false;
        this.fracaso = true;
        this.exito = false;
        this.clean();
        window.scroll(0,0);
      })
    ).subscribe();
  }

  createDialog(response: ConfirmaSaldoResponse){
    var confirmacion: ConfirmaSaldo = new ConfirmaSaldo();
    confirmacion.mensaje = response.Texto_Mensaje;
    confirmacion.codigo_mensaje = response.Cod_mensaje;
    confirmacion.agente = this.form.value.Agente;
    confirmacion.cod_epin = this.compraRequest.codEpin;
    confirmacion.monto_acreditado = response.Monto_acreditacion;
    confirmacion.monto_cobrado = this.compraRequest.montoCobrar;
    confirmacion.msisdn =this.compraRequest.msisdn;
    confirmacion.tipo = this.compraRequest.condicion;
    this.viewData(confirmacion);
  }


  viewData(compra: ConfirmaSaldo): void {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.autoFocus = false;
		dialogConfig.width = '500px';
		dialogConfig.data = compra;
    const dialogRef = this.dialog.open(DialogoVentaComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(
      data =>{
        if(data.action === 'save'){
          this.compraRequest.codAccion = "CONF_CPREP"
          this.dataTableService.buy(this.compraRequest).subscribe(res =>{
              if(res.entidad.Cod_mensaje === 0){
                this.exito = true;
                this.fracaso = false;
                this.clean();
                window.scroll(0,0);
              } else {
                this.fracaso = true;
                this.exito = false;
                this.clean();
                window.scroll(0,0)
              }
            }, err => {
              this.fracaso = true;
              this.exito = false;
              this.clean();
              window.scroll(0,0);
              this.spinner.active = false;
            });
        } else {
          this.clean();
          this.spinner.active = false;
          console.log('Operacion Cancelada')
        }
      }
    )
  
	}
  
}

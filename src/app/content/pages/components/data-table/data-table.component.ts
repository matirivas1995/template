import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort } from '@angular/material';
import { merge } from 'rxjs';
// RXJS
import { tap } from 'rxjs/operators';
import { ComprasLog } from '../../../../core/models/comprasLog';
import { GeneralResponse } from '../../../../core/models/generalResponse';
// Models
import { QueryParamsModel } from '../../../../core/models/query-params.model';
// Services
import { DataTableService } from '../../../../core/services/datatable.service';
import { SpinnerButtonOptions } from '../general/spinner-button/button-options.interface';
import { DataTableDataSource } from './data-table.data-source';
import { DialogoCompraComponent } from './dialogo-compra/dialogo-compra.component';

@Component({
	selector: 'm-data-table',
	templateUrl: './data-table.component.html'
})
export class DataTableComponent implements OnInit {
	public model: any = { fecha1: "", fecha2: "", msisdn:"" , epin_code:""};
	enabled: boolean = false;
	dataSource: DataTableDataSource;
	pdf: boolean  = false;
	date = new FormControl(new Date());
	vacio : string = "";
	serializedDate = new FormControl((new Date()).toISOString());
	displayedColumns = ['banco', 'cod_resp', 'tipo',
		'agente', 'msisdn', 'monto', 'fecha', 'hora','nro_trx', 'estado','plataforma', 'pdf','detalles'];

	@ViewChild('f') f: NgForm;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	selection = new SelectionModel<GeneralResponse>(true, []);


	spinner: SpinnerButtonOptions = {
		active: false,
		spinnerSize: 18,
		raised: true,
		buttonColor: 'primary',
		spinnerColor: 'accent',
		fullWidth: false
	};
	form: FormGroup;

	constructor(private dataTableService: DataTableService,  
		public dialog: MatDialog,
		private fb: FormBuilder,
		private datePipe: DatePipe) {}

	ngOnInit() {
		this.createForm();
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(() => {
					if(!this.enabled){
						this.loadItems();
					}else{
						this.submit();
					}
				})
			)
			.subscribe();

		// Init DataSource
		this.dataSource = new DataTableDataSource(this.dataTableService);
		// First load
		this.loadItems(true);
  }

	createForm(): any {
		this.form = new FormGroup({
			date1: new FormControl(''),
			date2: new FormControl(''),
			numero: new FormControl(''),
			codigo: new FormControl('')
		  });
	}

  loadItems(firstLoad: boolean = false) {
		const queryParams = new QueryParamsModel(
			{},
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			firstLoad ? 6 : this.paginator.pageSize
		);
		this.dataSource.loadItems(queryParams);
		this.selection.clear();
  }

  	validate(f: NgForm) {
		return true;
	}

	habilitar(){
		this.enabled= true;
	}
	deshabilitar(){
		this.enabled= false;
		this.loadItems();
	}

	submit(firstLoad: boolean = false) {
		this.model.fecha1 = this.datePipe.transform(this.form.value.date1, 'yyyy-MM-dd');
		this.model.fecha2 = this.datePipe.transform(this.form.value.date2, 'yyyy-MM-dd');
		this.model.msisdn = this.form.value.numero;
		this.model.epin_code = this.form.value.codigo;
		this.spinner.active = true
		if (this.validate(this.f)) {
			const queryParams = new QueryParamsModel(
				{},
				this.sort.direction,
				this.sort.active,
				this.paginator.pageIndex,
				firstLoad ? 6 : this.paginator.pageSize
			);
			this.dataSource.loadItemsByDate(queryParams,this.model);
			this.spinner.active = false;
		}
	}


	downloadPdf(compra: ComprasLog){
		this.pdf = true;
		this.dataTableService.getPdf(compra).pipe(
			tap(res => {
				this.pdf= false;
				var doc =  document.createElement("doc");
				var file = new Blob([res], {type: 'application/pdf'});
				var fileUrl = URL.createObjectURL(file);
				window.open(fileUrl,"print");
			})
		).subscribe();
	}

	viewData(compra: ComprasLog): void {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.autoFocus = false;
		dialogConfig.width = '500px';
		dialogConfig.data = compra;
		const dialogRef = this.dialog.open(DialogoCompraComponent,dialogConfig);
	}

}

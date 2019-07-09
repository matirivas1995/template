import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppConfigService } from '../../../AppConfigService';
import { CompraSaldoRequest } from '../models/compraSaldoRequest';
import { ComprasLog } from '../models/comprasLog';
import { GeneralResponse } from '../models/generalResponse';
import { Msisdn } from '../models/msisdn';
import { QueryParamsModel } from '../models/query-params.model';

const API_DATATABLE_URL = 'api/cars';

@Injectable()
export class DataTableService {

	context: string;
	url: string;
	data: any;
	headers: any;

	constructor(private http: HttpClient , private enviroment: AppConfigService) {
			this.context = this.enviroment.config.serviceBaseUrl;
			console.log(this.context);
	}

	getAllItems(queryParams: QueryParamsModel): Observable<GeneralResponse> {
		var from = queryParams.pageNumber * queryParams.pageSize;
		this.url = this.context + '/compras/log/list?from=' +
					from + '&cant=' + queryParams.pageSize + '&sortField=' +
					queryParams.sortField + '&sortDir=' + queryParams.sortOrder;
		return this.http.post<any>(this.url,null).pipe(
			tap( respuesta => {
			  return respuesta;
			})
		  );
	}

	getAllItemsByfecha(queryParams: QueryParamsModel, model: any): Observable<GeneralResponse> {
		var from = queryParams.pageNumber*queryParams.pageSize;
		this.data = new HttpParams()
										.set('date1',model.fecha1)
										.set('date2',model.fecha2)
										.set('msisdn',model.msisdn)
										.set('epin_code',model.epin_code)
										.set('from',from.toString())
										.set('cant',queryParams.pageSize.toString())
										.set('sortField',queryParams.sortField)
										.set('sortDir',queryParams.sortOrder);
		this.url = this.context + '/compras/listLogByDate';
		let options = { headers: this.headers }
		this.headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}) ;
		return this.http.post<any>(this.url,this.data,options).pipe(
			tap( respuesta => {
			  return respuesta;
			})
		  );
	}

	getPdf(compra: ComprasLog): Observable<any> {
		this.url = this.context + '/compras/print';
		return this.http.post<any>(this.url,compra,{responseType:  'arraybuffer' as 'json'}).pipe(
			tap(respuesta => {
				return respuesta;
			})
		)
	}

	getDealers(): Observable<any> {
		this.url = this.context + '/dealers/list';
		return this.http.post<any>(this.url,null).pipe(
			tap(
				respuesta=> {
					return respuesta;
				}
			)
		)
	}


	getMsisdnData(dealer: Msisdn): Observable<any> {
		this.url = this.context + '/msisdn/list';
		return this.http.post<any>(this.url,dealer).pipe(
			tap(
				respuesta=>{
					return respuesta;
				}
			)
		)
	}

	getEpinData(msisdn: string): Observable<any> {
		var obj = JSON.parse('{"msisdn": "'+ msisdn + '"}');
		this.url = this.context + '/msisdn/list';
		return this.http.post<any>(this.url,obj).pipe(
			tap(
				respuesta=>{
					return respuesta;
				}
			)
		)
	}

	getBancos(): Observable<any> {
		this.url = this.context + '/banco/list';
		return this.http.post<any>(this.url,null).pipe(
			tap(
				respuesta=>{
					return respuesta;
				}
			)
		)
	}

	buy(compra: CompraSaldoRequest): Observable<any> {
		this.url = this.context + '/compras/new';
		return this.http.post<any>(this.url,compra).pipe(
			tap(
				respuesta=>{
					return respuesta;
				}
			),
			catchError(this.handleError)
		)
	}

	handleError(error) {
		let errorMessage = '';
		if (error.error instanceof ErrorEvent) {
		  // client-side error
		  errorMessage = `Error: ${error.error.message}`;
		} else {
		  // server-side error
		  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
		}
		
		return throwError(errorMessage); ;
	  }
}

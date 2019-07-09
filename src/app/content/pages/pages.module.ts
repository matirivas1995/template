import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from '../../core/core.module';
import { MaterialModule } from '../../material.module';
import { LayoutModule } from '../layout/layout.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DialogoCompraComponent } from './components/data-table/dialogo-compra/dialogo-compra.component';
import { NoticeComponent } from './components/general/notice/notice.component';
import { PortletModule } from './components/general/portlet/portlet.module';
import { SpinnerButtonModule } from './components/general/spinner-button/spinner-button.module';
import { DialogoVentaComponent } from './components/venta/dialogo-venta/dialogo-venta.component';
import { VentaComponent } from './components/venta/venta.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ErrorPageComponent } from './error/error-page/error-page.component';

@NgModule({
	declarations: [
		PagesComponent,
		ErrorPageComponent,
		NoticeComponent,
		DataTableComponent,
		DialogoCompraComponent,
		VentaComponent,
		DialogoVentaComponent,
		DashboardComponent
	],
	exports: [
		ReactiveFormsModule,
		NoticeComponent,
		DataTableComponent,
		PortletModule,
		SpinnerButtonModule,
	],
	imports: [
		ToastrModule.forRoot(),
		ReactiveFormsModule,
		CommonModule,
		HttpClientModule,
		FormsModule,
		PagesRoutingModule,
		CoreModule,
		LayoutModule,
		AngularEditorModule,
		MaterialModule,
		RouterModule,
		NgbModule,
		PerfectScrollbarModule,
		PortletModule,
		SpinnerButtonModule,
		LayoutModule,
	],
	entryComponents: [
		DialogoCompraComponent,
		DialogoVentaComponent
	],
	providers: [
		{provide: MatDialogModule, useValue: {hasBackdrop: false}}
	]
})
export class PagesModule {
}

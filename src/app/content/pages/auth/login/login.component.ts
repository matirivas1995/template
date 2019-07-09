import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as objectPath from 'object-path';
import { Subject } from 'rxjs';
import { AuthNoticeService } from '../../../../core/auth/auth-notice.service';
import { AuthenticationService } from '../../../../core/auth/authentication.service';
import { SpinnerButtonOptions } from '../../components/general/spinner-button/button-options.interface';

@Component({
	selector: 'm-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
	public model: any = { email: '', password: '' };
	@HostBinding('class') classes: string = 'm-login__signin';
	@Output() actionChange = new Subject<string>();
	public loading = false;

	@Input() action: string;

	@ViewChild('f') f: NgForm;
	errors: any = [];

	spinner: SpinnerButtonOptions = {
		active: false,
		spinnerSize: 18,
		raised: true,
		buttonColor: 'primary',
		spinnerColor: 'accent',
		fullWidth: false
	};

	constructor(
		private authService: AuthenticationService,
		private router: Router,
		public authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private cdr: ChangeDetectorRef
	) {}

	submit() {
		this.spinner.active = true;
		if (this.validate(this.f)) {
			this.authService.login(this.model).subscribe(response => {
				if (response.success === true) {
					this.router.navigate(['/']);
				} else {
					this.authNoticeService.setNotice( 'Usuario o Contraseña incorrecto' , 'error');
				}
				this.spinner.active = false;
				this.cdr.detectChanges();
			}, err => {
				this.spinner.active = false;
				this.authNoticeService.setNotice( 'El servicio no esta disponible' , 'error');
			});
		}
	}

	ngOnInit(): void {
		// demo message to show
		if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = `Use su cuenta de
			<strong>Usuario LDAP</strong> y su password
			para continuar.`;
			this.authNoticeService.setNotice(initialNotice, 'success');
		}
	}

	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
	}

	validate(f: NgForm) {
		if (f.form.status === 'VALID') {
			return true;
		}
		this.errors = [];
		if (objectPath.get(f, 'form.controls.email.errors.required')) {
			this.errors.push('Ingrese un Usuario valido');
		}
		if (objectPath.get(f, 'form.controls.password.errors.required')) {
			this.errors.push('Ingrese una Contraseña valida');
		}

		if (this.errors.length > 0) {
			this.authNoticeService.setNotice(this.errors.join('<br/>'), 'error');
			this.spinner.active = false;
			return false;
		}
		return true;
	}

	forgotPasswordPage(event: Event) {
		this.action = 'forgot-password';
		this.actionChange.next(this.action);
	}

	register(event: Event) {
		this.action = 'register';
		this.actionChange.next(this.action);
	}
}

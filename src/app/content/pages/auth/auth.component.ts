import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { LayoutConfig } from '../../../config/layout';
import { AuthNoticeService } from '../../../core/auth/auth-notice.service';
import { LayoutConfigService } from '../../../core/services/layout-config.service';

@Component({
	selector: 'm-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
	@HostBinding('id') id = 'm_login';
	@HostBinding('class')
	// tslint:disable-next-line:max-line-length
	classses: any = 'm-grid m-grid--hor m-grid--root m-page';

	@Input() action = 'login';
	today: number = Date.now();

	constructor(
		private layoutConfigService: LayoutConfigService,
		public authNoticeService: AuthNoticeService,
	) {}

	ngOnInit(): void {
		// set login layout to blank
		this.layoutConfigService.setModel(new LayoutConfig({ content: { skin: '' } }), true);
		

	}

	ngOnDestroy(): void {
		// reset back to fluid
		this.layoutConfigService.reloadSavedConfig();
	}

	register() {
		this.action = 'register';
	}
}

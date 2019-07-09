import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppConfigService } from '../../AppConfigService';
import { HeaderDirective } from './directives/header.directive';
import { MenuHorizontalOffcanvasDirective } from './directives/menu-horizontal-offcanvas.directive';
import { MenuHorizontalDirective } from './directives/menu-horizontal.directive';
import { PortletDirective } from './directives/portlet.directive';

const appInitializerFn = (appConfig: AppConfigService) => {
    return () => {
        return appConfig.loadAppConfig();
    }
};

@NgModule({
	imports: [CommonModule],
	declarations: [
		// directives
		MenuHorizontalOffcanvasDirective,
		MenuHorizontalDirective,
		HeaderDirective,
		PortletDirective,
	],
	exports: [
		// directives
		MenuHorizontalOffcanvasDirective,
		MenuHorizontalDirective,
		HeaderDirective,
		PortletDirective,
	],
	providers: [
		AppConfigService,
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializerFn,
			multi: true,
			deps: [AppConfigService]
		}
	]
})
export class CoreModule {}

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthModule, AUTH_SERVICE, PROTECTED_FALLBACK_PAGE_URI, PUBLIC_FALLBACK_PAGE_URI } from 'ngx-auth';
import { AppConfigService } from '../../../AppConfigService';
import { AuthenticationService } from './authentication.service';
import { TokenStorage } from './token-storage.service';


export function factory(authenticationService: AuthenticationService) {
	return authenticationService;
}

const appInitializerFn = (appConfig: AppConfigService) => {
    return () => {
        return appConfig.loadAppConfig();
    };
};


@NgModule({
	imports: [AuthModule],
	providers: [
		AppConfigService,
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializerFn,
			multi: true,
			deps: [AppConfigService]
		},
		TokenStorage,
		AuthenticationService,
		{ provide: PROTECTED_FALLBACK_PAGE_URI, useValue: '/' },
		{ provide: PUBLIC_FALLBACK_PAGE_URI, useValue: '/login' },
		{
			provide: AUTH_SERVICE,
			deps: [AuthenticationService],
			useFactory: factory
		}
	]
})
export class AuthenticationModule {}

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { async } from 'q';

@Injectable()
export class AppConfigService {
    private appConfig = null;

    constructor (private injector: Injector) { }

    loadAppConfig() {
        let http = this.injector.get(HttpClient);
        return http.get('/assets/config/app-config.json')
        .toPromise()
        .then(data => {
            this.appConfig = data;
        });
    }

    get config()  {
        return this.appConfig;
    }
}
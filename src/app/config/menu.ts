// tslint:disable-next-line:no-shadowed-variable
import {ConfigModel} from '../core/interfaces/config';

// tslint:disable-next-line:no-shadowed-variable
export class MenuConfig implements ConfigModel {
	public config: any = {};

	constructor() {
		this.config = {
			header: {
				self: {},
				items: [
					{
						title: 'Venta Manual',
						page: '/venta',
					},
					{
						title: 'Logs',
						root: true,
						page: '/',
					}
				]
			},
		};
	}
}

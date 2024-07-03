/* global BX24 */
import './bitrix24-rest'

if (BX24 && typeof BX24.initAuth == 'function') {
	const auth = {
		access_token: '',
		refresh_token: '',
		expires_in: 0,
		domain: '',
		member_id: ''
	}
	
	const app_option = {
		client_id: 'local.6684f4457fd3f8.75218833',
		client_secret: 'LES4cmjVzQatqJ48gKpGvJrVY3DZE7VxDKND72bchhKy4BlxS8',
		lang: 'ru'
	}
	
	BX24.initAuth({
		...app_option,
		...auth,
		placement: "CRM_DEAL_DETAIL_TAB",
		placement_option: {"ID": "31"}
	})
}
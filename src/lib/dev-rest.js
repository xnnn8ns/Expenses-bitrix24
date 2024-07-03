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
		client_id: '',
		client_secret: '',
		lang: 'ru'
	}
	
	BX24.initAuth({
		...app_option,
		...auth,
		placement: "CRM_DEAL_DETAIL_TAB",
		placement_option: {"ID": "31"}
	})
}
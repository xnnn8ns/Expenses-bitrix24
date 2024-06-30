/* global BX24 */
import React from 'react'

class CRMIntegration extends React.Component {
	componentDidMount() {
		if (!window.BX24) {
			console.error('BX24 is not available')
			return
		}
		
		this.initBX24()
		this.bindPlacement()
		
		// if (!localStorage.getItem('placementBound')) {
		//
		// }
	}
	
	initBX24() {
		BX24.init(() => {
			BX24.getAuth((authData) => {
				if (authData.error) {
					console.error('Error getting auth data:', authData.error)
					return
				}
				
				console.log(authData)
			})
		})
	}
	
	bindPlacement() {
		BX24.callMethod('placement.bind', {
			PLACEMENT: 'CRM_DEAL_DETAIL_TAB',
			HANDLER: window.location.href,
			TITLE: 'Расходы по сделкам'
		}, (result) => {
			if (result.error()) {
				console.error('Error binding placement:', result.error())
				return
			}
			
			console.log(result)
			if (result.answer.result) {
				localStorage.setItem('placementBound', 'true')
			}
		})
	}
	
	render() {
		return null // Этот компонент не рендерит ничего на экран
	}
}

export default CRMIntegration
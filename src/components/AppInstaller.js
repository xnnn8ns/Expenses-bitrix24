/* global BX24 */
import { useEffect } from 'react'

const AppInstaller = ({ onInstall }) => {
	useEffect(() => {
		BX24.init(() => {
			BX24.callMethod('placement.get', {}, (result) => {
				if (result.error()) {
					console.error('Error getting placements:', result.error());
				} else {
					const placements = result.data();
					const isBound = placements.some(placement =>
						placement.PLACEMENT === 'CRM_DEAL_DETAIL_TAB' &&
						placement.HANDLER === window.location.href
					);
					
					if (!isBound) {
						BX24.callMethod('placement.bind', {
							PLACEMENT: 'CRM_DEAL_DETAIL_TAB',
							HANDLER: window.location.href,
							TITLE: 'Расходы'
						}, (result) => {
							if (result.error()) {
								console.error('Error binding placement:', result.error());
							} else {
								console.log('Placement bound successfully:', result);
								if (typeof onInstall === 'function') {
									onInstall();
								}
							}
						});
					}
				}
			});
		});
	}, [onInstall]);
	
	return null; // Этот компонент не рендерит ничего на экран
};

export default AppInstaller;

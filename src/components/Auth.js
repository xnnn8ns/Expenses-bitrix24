/* global BX24 */
import React from 'react';

class CRMIntegration extends React.Component {
  componentDidMount() {
    this.initBX24();
    if (!localStorage.getItem('placementBound')) {
      this.bindPlacement();
    }
  }

  initBX24() {
    if (window.BX24) {
      BX24.init(() => {
        BX24.getAuth((authData) => {
          console.log(authData);
        });
      });
    }
  }

  bindPlacement() {
    if (window.BX24) {
      BX24.callMethod('placement.bind', {
        PLACEMENT:'CRM_DEAL_DETAIL_TAB',
        HANDLER: window.location.href,
        TITLE: 'Custom tab'
      }, (result) => {
        console.log(result);
        if (result.answer.result) {
          localStorage.setItem('placementBound', 'true');
        }
      });
    }
  }

  render() {
    return null; // Этот компонент не рендерит ничего на экран
  }
}

export default CRMIntegration;
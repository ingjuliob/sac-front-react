const BaseService = {

    URL() {
        return 'https://gleaming-glass-313320.uc.r.appspot.com';
    },

    _call_get(url) {
        return fetch(url)
            .then(res => res.json())
            .catch(err => console.log(err))
    },

    _call_post(url, body) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .catch(err => console.log(err))
    },

    getAlert(operationId, productCode, causeCode, reasonCode, companyCode) {
        return this._call_get(this.URL() + '/transaccional/parametros/ayuda?operationId=' + operationId + '&productCode=' + productCode + '&causeCode=' + causeCode + '&reasonCode=' + reasonCode + '&companyCode=' + companyCode);
    },

    saveData(operationId, productCode, causeCode, companyCode, documentType, documentNumber, productNumber, origin,
        user, option, contactMode, reasoncode, responsibleSector, registerSector, initContact, closeContact, embozo,
        category, domicilio, sucursal) {

        let body = {};
        body.operationId = operationId;
        body.documentType = documentType;
        body.documentNumber = documentNumber;
        body.productNumber = productNumber;
        body.user = user;
        body.origin = origin;
        body.option = option;
        body.contactMode = contactMode;
        body.productCode = productCode;
        body.causeCode = causeCode;
        body.reasoncode = reasoncode;
        body.companyCode = companyCode;
        body.responsibleSector = responsibleSector;
        body.registerSector = registerSector;
        body.initContact = initContact;
        body.closeContact = closeContact;
        body.embozo = embozo;
        body.category = category;
        body.domicilio = domicilio;
        body.sucursal = sucursal;
        return this._call_post(this.URL() + '/transaccional/grabar', body);
    }

}

export default BaseService;
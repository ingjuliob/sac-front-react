import BaseService from "./baseService";

const ReprintService = {

    _call_get(url) {
        return fetch(url)
            .then(res => res.json())
            .catch(err => console.log(err))
    },

    getEmbozos(operationId, code) {
        return this._call_get(BaseService.URL() + '/reimpresion/tarjetas/embozos?operationId=' + operationId + '&codigo=' + code);
    },

    getCardDetails(operationId, cardNumber) {
        return this._call_get(BaseService.URL() + '/reimpresion/tarjetas/detalle?operationId=' + operationId + '&numero=' + cardNumber);
    },

    getBranchDetails(operationId) {
        return this._call_get(BaseService.URL() + '/transaccional/sucursales?operationId=' + operationId);
    }

}

export default ReprintService;
/**
 * @NApiVersion 2.1
 * @NScriptType usereventscript
 */

define(['N/record', 'N/log', 'N/search', 'N/runtime'], (record, log, search, runtime) => {
    const afterSubmit = (context) => {
        if (context.type === context.UserEventType.CREATE ||
            context.type === context.UserEventType.EDIT) {
            const nr = context.newRecord

            processCommission(nr)
        }
    }

    function processCommission(_rec) {
        const _isComm = search.lookupFields({
            type: 'customer',
            id: _rec.getValue('entity'),
            columns: ['custentity_commission_percentage']
        }).custentity_commission_percentage
        let _cummulativeAmt
        const _totalAmt = _rec.getValue('custbody_custom_total')
        const _soComm = _rec.getValue('custbody_viso_commission')
        const _ovgValue = _rec.getValue('custbody_ovg_comm_amt')
        log.debug('Cx Comm', { _isComm, _totalAmt, _soComm, _ovgValue })
        if (_isComm) {

            _cummulativeAmt = (_isComm / 100) * _totalAmt
            if (_ovgValue) {
                _cummulativeAmt += _ovgValue
            }
            log.debug('Cx Cummulative Commission', _cummulativeAmt)
        } else {
            if (_soComm) {
                _cummulativeAmt = (_soComm / 100) * _totalAmt
                if (_ovgValue) {
                    _cummulativeAmt += _ovgValue
                }
                log.debug('SO Cummulative Commission', _cummulativeAmt)
            } else if (_ovgValue) {
                _cummulativeAmt = _ovgValue
                log.debug('Ovg Cummulative Commission', _cummulativeAmt)
            }
        }
    }

    return {
        afterSubmit
    }
})
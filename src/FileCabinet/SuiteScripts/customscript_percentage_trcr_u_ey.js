/**
 * @NApiVersion 2.1
 * @NScriptType usereventscript
 */

define(['N/record', 'N/log', 'N/search', 'N/runtime'], (record, log, search, runtime) => {
    const _FIELD_IDS = {
        _total: 'custbody_custom_total',
        _overage: 'custbody_ovg_comm_amt',
        _linkedPo: 'custbody_linked_po',
        _needsRecalc: 'custbody_p_needs_recalc',
        _changedAfterSubmit: 'custbody_p_changed_after_submit'
    }

    const _EPSILON = 0.0001

    const afterSubmit = (context) => {
        if (context.type === context.UserEventType.CREATE ||
            context.type === context.UserEventType.EDIT) {
            const nr = context.newRecord

            processCommission(nr)
        }
    }

    function processCommission(_rec) {
        let _cummulativeAmt
        const _totalAmt = Number(_rec.getValue(_FIELD_IDS._total))
        const _soComm = Number(_rec.getValue('custbody_viso_commission'))
        const _poSubmitted = _rec.getValue(_FIELD_IDS._linkedPo)
        const _ovgValue = Number(_rec.getValue(_FIELD_IDS._overage))
        if (_poSubmitted) {
            const _poAmt = search.lookupFields({
                type: 'purchaseorder',
                id: _poSubmitted,
                columns: ['fxamount']
            }).fxamount
        }
        if (Math.abs(_poAmt - _totalAmt) > _EPSILON) {
        }
        const _isComm = parseFloat(
            String(search.lookupFields({
                type: 'customer',
                id: _rec.getValue('entity'),
                columns: ['custentity_commission_percentage']
            }).custentity_commission_percentage).replace('%', ''))

        log.debug('Cx Comm', { _isComm: _isComm, _soComm, _ovgValue, _totalAmt })
        if ((_isComm)) {
            _cummulativeAmt = ((_isComm) / 100) * _totalAmt
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
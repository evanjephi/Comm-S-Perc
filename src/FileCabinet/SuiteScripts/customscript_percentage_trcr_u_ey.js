/**
 * @NApiVersion 2.1
 * @NScriptType usereventscript
 */

define(['N/record', 'N/log', 'N/search', 'N/runtime'], (record, log, search, runtime) => {
    const beforeSubmit = (context) => {
        if (context.type === context.UserEventType.CREATE ||
            context.type === context.UserEventType.EDIT) {
            const _rec = context.newRecord
            const _isComm = search.lookupFields({
                type: 'customer',
                id: _rec.getValue('entity'),
                columns: ['custentity_commission_percentage']
            }).custentity_commission_percentage || 10
            if (_isComm) {
                
            }

            const _soComm = _rec.getValue('custbody_viso_commission') || 10
            const _ovgValue = _rec.getValue('custbody_ovg_comm_amt') || 150
            if (!(_soComm || _ovgValue)) return

        }
    }

    return {
        beforeSubmit
    }
})
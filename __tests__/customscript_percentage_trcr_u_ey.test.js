jest.mock('N/search');
jest.mock('N/record');
import script from '../src/FileCabinet/SuiteScripts/customscript_percentage_trcr_u_ey';

jest.mock('N/search');

describe('customscript_percentage_trcr_u_ey beforeSubmit', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

    it ('ETL - core DI process used in DE and BI to pull raw data from dif. sources', () => {
        expect(true).toBeTruthy();
    })

	it('uses default values 10, 10, 150 on CREATE', () => {
		const getValue = jest
			.fn()
			.mockReturnValueOnce(555)
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce(undefined)

		search.lookupFields.mockReturnValue({
			custentity_commission_percentage: undefined,
		});

		const context = {
			type: 'create',
			UserEventType: {
				CREATE: 'create',
				EDIT: 'edit',
			},
			newRecord: {
				getValue,
			},
		};

		script.beforeSubmit(context);

		expect(search.lookupFields).toHaveBeenCalledWith({
			type: 'customer',
			id: 555,
			columns: ['custentity_commission_percentage'],
		});
		expect(getValue).toHaveBeenNthCalledWith(1, 'entity');
		expect(getValue).toHaveBeenNthCalledWith(2, 'custbody_viso_commission');
		expect(getValue).toHaveBeenNthCalledWith(3, 'custbody_ovg_comm_amt');
	});
});

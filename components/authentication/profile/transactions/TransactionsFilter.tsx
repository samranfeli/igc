import CheckboxGroup from "@/components/shared/CheckboxGroup";
import DatePickerM from "@/components/shared/DatePicker";
import { Form, Formik } from "formik";
import { useState } from "react";

type Props = {
    wrapperClassName?: string;
    onFilter: (values: {
        startDate: string;
        endDate: string;
        types: string[];
    }) => void;
    close: () => void;
    filterStartDate:string;
    filterEndDate:string;
    filterType: string[];
}

const TransactionsFilter: React.FC<Props> = props => {

    const formInitialValue = {
        dates: ["", ""]
    }
    const [filteredTypes, setFilteredTypes] = useState<string[]>(props.filterType || []);

    const availableTransactionTypes = ["IncreaseDepositByPaymentGateway", "DecreaseDepositBySale", "IncreaseDepositByRefund", "IncreaseDepositByReverse", "DecreaseDepositByWithdraw", "IncreaseDeposit", "DecreaseDeposit", "ManualIncreaseDeposit", "ManualDecreaseDeposit", "ManualIncreaseDepositByRefund"];

    return (
        <div className={`px-4 ${props.wrapperClassName || ""}`}>

            <Formik
                validate={() => { return {} }}
                initialValues={formInitialValue}
                onSubmit={values => {
                    props.onFilter({
                        startDate: values.dates[0],
                        endDate: values.dates[1],
                        types: filteredTypes
                    })
                }}
            >
                {({isValid, isSubmitting, setFieldValue }) => {

                    if (isSubmitting && !isValid) {
                        setTimeout(() => {
                            const formFirstError = document.querySelector(".has-validation-error");
                            if (formFirstError) {
                                formFirstError.scrollIntoView({ behavior: "smooth" });
                            }
                        }, 100)
                    }

                    return (

                        <Form autoComplete='off' className="py-5" >
                            <div className="overflow-auto max-h-[70vh]">

                                <label className="mb-2 block text-sm">
                                    بازه زمانی
                                </label>

                                <DatePickerM
                                    placeholder="بازه زمانی"
                                    range
                                    initialValue={[props.filterStartDate || "",  props.filterEndDate || ""]}
                                    onChange={v => {
                                         setFieldValue('dates', v, true)
                                    }}
                                    className="mb-6"
                                />

                                <label className="mb-2 block text-sm">
                                    نوع تراکنش
                                </label>
                                <CheckboxGroup
                                    items={availableTransactionTypes.map(item => ({
                                        label: item,
                                        value: item
                                    }))}
                                    onChange={setFilteredTypes}
                                    values={filteredTypes}
                                />
                            </div>

                            <div className="flex gap-4 mt-7">
                                <button
                                    type="button"
                                    className="shrink-0 w-24 rounded-full px-5 py-2.5 bg-[#bbbbbb] dark:bg-[#011425] text-sm"
                                    onClick={props.close}
                                >
                                    بستن
                                </button>
                                <button
                                    type="submit"
                                    className="w-full rounded-full px-5 py-2.5 text-white bg-[#a93aff] text-sm"
                                >
                                    ثبت تغییرات
                                </button>
                            </div>
                        </Form>
                    )
                }}

            </Formik>
        </div>
    )
}

export default TransactionsFilter;
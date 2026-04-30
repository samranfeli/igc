/* eslint-disable  @typescript-eslint/no-explicit-any */

import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";

import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import ModalPortal from "./layout/ModalPortal";
import { useAppDispatch } from "@/hooks/use-store";
import { setBodyScrollPosition, setBodyScrollable } from "@/redux/stylesSlice";
import { dateDisplayFormat, dateFormat } from "@/helpers";
import CalendarIcon from "../icons/CalendarIcon";
import { useIsDesktop } from "@/hooks/use-is-desktop";

const Calendar = dynamic(
    () => import("react-multi-date-picker").then((mod) => mod.Calendar),
    { ssr: false }
);

type Props = {
    className?: string;
    range?: boolean;
    modalLabel?: string;
    onChange: ((v: string[]) => void);
    placeholder?: string;
    initialValue?: (string)[];
}

const DatePickerM: React.FC<Props> = props => {

    let initialValue : any =  null;

    const {isDesktop} = useIsDesktop();
    
    if(props.initialValue){
        initialValue = props.initialValue.map(x => x ? new Date(x) : null);
    }

    const [value, setValue] = useState<any>(initialValue);

    const dispatch = useAppDispatch();

    const [open, setOpen] = useState<boolean>(false);
    const [slideIn, setSlideIn] = useState<boolean>(false);

    const [localeFa, setLocaleFa] = useState<boolean>(true);


    useEffect(() => {
        if (open) {
            setSlideIn(true);
            dispatch(setBodyScrollable(false));
            dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
        } else {
            dispatch(setBodyScrollable(true));
        }
    }, [open]);

    useEffect(() => {
        if (!slideIn) {
            setTimeout(() => { setOpen(false) }, 300)
        }
    }, [slideIn]);


    const toggleLocale = () => {
        setLocaleFa(prev => !prev)
    }

    let text: ReactNode = props.placeholder || "";

    if (Array.isArray(value)) {

        const formatted = value.map((d) => d ? dateFormat(new Date(d)) : null);
        
        let startString = " -- ";
        let endString = " -- ";
        
        if(formatted[0]){
            startString = dateDisplayFormat({
                date: formatted[0],
                format: "yyyy/mm/dd",
                locale: localeFa ? "fa" : "en"
            });

            if(formatted[1]){
                endString = dateDisplayFormat({
                    date: formatted[1],
                    format: "yyyy/mm/dd",
                    locale: localeFa ? "fa" : "en"
                });
            }
            
            text = <span>
                از <span> {startString} </span> تا <span> {endString} </span>
            </span>;
        }

    }

    let modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 ${slideIn ? "bottom-0" : "-bottom-[80vh]"}`

    if (isDesktop) {
        modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-md transition-all top-1/2 right-1/2 translate-x-1/2 ${slideIn ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`
    }

    return (
        <>
            <button
                type="button"
                className={`bg-white border border-neutral-300 dark:bg-[#2e3e4b] rounded-full h-10 w-full dark:border-none outline-none px-5 text-right text-sm ${props.className || ""}`}
                onClick={() => { setOpen(true)}}
            >
                {text}
            </button>

            <ModalPortal
                show={open}
                selector='modal_portal'
            >
                <div className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0" onClick={() => { setSlideIn(false) }} />

                <div className={modalWrapperClass}>

                    <div className="flex justify-between items-center p-4 text-neutral-800 dark:text-white">
                        {props.modalLabel ? <label className="font-semibold text-base block"> {props.modalLabel} </label> : <label className="font-semibold text-sm block" > {text} </label>}
                        <button
                            type="button"
                            className="text-sm text-[#a93aff] flex gap-1 items-center font-semibold"
                            onClick={toggleLocale}
                        >
                            <CalendarIcon className="w-5 h-5 fill-current" />
                            {localeFa ? "تقویم میلادی" : "تقویم شمسی"}
                        </button>
                    </div>

                    <Calendar
                        locale={localeFa ? persian_fa : gregorian_en}
                        calendar={localeFa ? persian : gregorian}
                        range={props.range}
                        shadow={false}
                        rangeHover={props.range}
                        monthYearSeparator="  "
                        value={value}
                        onChange={setValue}
                        weekDays={localeFa ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] : undefined}
                    //weekDays ={ ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']}
                    />
                    <div className="flex gap-4 mt-7 py-2 pb-5 px-4">
                        <button
                            type="button"
                            className="shrink-0 w-24 rounded-full px-5 py-2.5 bg-[#bbbbbb] dark:bg-[#011425] text-sm font-semibold"
                            onClick={() => { setSlideIn(false) }}
                        >
                            بستن
                        </button>
                        <button
                            type="button"
                            className="w-full rounded-full px-5 py-2.5 bg-[#a93aff] text-sm text-white font-semibold"
                            onClick={() => {
                                if (Array.isArray(value)) {
                                    const formatted = value.map((d) => dateFormat(new Date(d)));
                                    props.onChange(formatted);
                                }
                                setSlideIn(false);
                            }}
                        >
                            تایید
                        </button>
                    </div>
                </div>
            </ModalPortal>
        </>
    )
}

export default DatePickerM;
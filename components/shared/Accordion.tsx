import { useEffect, useRef, useState } from "react";
import { DownCaretThick } from "../icons/DownCaretThick";

type Props = {
    content: React.ReactNode;
    title: React.ReactNode;
    extraInTitle?: React.ReactNode;
    WrapperClassName?: string;
    initiallyOpen?: boolean;
    updateContent?: string;
    withArrowIcon?: boolean;
    rotateArrow180?: boolean;
    titleIsSimpleLeft?: boolean;
    titleClassName?: string;
}

const Accordion: React.FC<Props> = props => {

    const contentRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState<boolean>(props.initiallyOpen || false);

    const { content, title, WrapperClassName, withArrowIcon, extraInTitle } = props;

    const toggle = () => { setOpen(prevState => !prevState) }

    useEffect(() => {
        if (open) {
            contentRef.current!.style.maxHeight = contentRef.current!.scrollHeight + "px";
        } else {
            contentRef.current!.style.maxHeight = "0";
        }
    }, [open, props.updateContent]);

    let expandIconClass = `w-[11px] h-[11px] before:absolute before:bg-black/50 dark:before:bg-white/50 before:w-px before:h-full before:left-[5px] before:top-0 before:transition-all ${open ? "before:opacity-0" : "before:opacity-100"}
            after:absolute after:bg-black/50 dark:after:bg-white/50 after:w-full after:h-px after:top-1/2 after:left-0`;

    if (withArrowIcon) {
      expandIconClass = `w-[7px] h-[7px] border block border-[#777777] dark:border-white border-r-transparent border-t-transparent dark:border-r-transparent dark:border-t-transparent  transition-all ${
        !open ? "-rotate-45" : props.rotateArrow180 ? "rotate-135" : "rotate-45"
      }`;
    }

    return (
      <div className={`text-sm ${WrapperClassName || ""}`}>
        {props.titleIsSimpleLeft ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggle}
              className={`flex items-center gap-2 outline-none border-none text-xs ${
                props.titleClassName || ""
              }`}
            >
              {title}
              <DownCaretThick
                className={`w-4 h-4 fill-current transition-all ${
                  !open ? "" : "rotate-180"
                }`}
              />
            </button>
          </div>
        ) : extraInTitle ? (
          <div
            className={`leading-5 relative font-semibold select-none cursor-pointer py-2 pl-12`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <div onClick={toggle}>{title}</div>
              {extraInTitle}
            </div>
            <div
              onClick={toggle}
              className={`absolute left-0 top-2.5 ${expandIconClass}`}
            />
          </div>
        ) : (
          <div
            onClick={toggle}
            className={`leading-5 relative font-semibold select-none cursor-pointer py-2 pl-12`}
          >
            {title}
            <div className={`absolute left-0 top-2.5 ${expandIconClass}`} />
          </div>
        )}

        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-300"
        >
          <div className={`text-justify leading-6 text-xs py-3`}>{content}</div>
        </div>
      </div>
    );
}

export default Accordion;
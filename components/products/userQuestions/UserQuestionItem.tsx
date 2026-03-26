/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useIsDesktop } from "@/hooks/use-is-desktop";
import ModalPortal from "../../shared/layout/ModalPortal";
import UserAnswerItem from "./UserAnswerItem";
import { useAppDispatch } from "@/hooks/use-store";
import { ReactNode, useEffect, useState } from "react";
import { setBodyScrollable, setBodyScrollPosition } from "@/redux/stylesSlice";
import CloseSimple from "../../icons/CloseSimple";
import { QuestionItemType } from "@/types/commerce";
import AddAnswer from "./AddAnswer";
import { DownCaretThick } from "@/components/icons/DownCaretThick";

type Props = {
  question: QuestionItemType;
  inBox?: boolean;
};

const UserQuestionItem: React.FC<Props> = (props) => {
  const { question } = props;

  const {isDesktop} = useIsDesktop();

  const dispatch = useAppDispatch();

  const [showAllAnswers, setShowAllAnswers] = useState<boolean>(false);

  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [slideInDetails, setSlideInDetails] = useState<boolean>(false);
  useEffect(() => {
    if (openDetails) {
      setSlideInDetails(true);
      dispatch(setBodyScrollable(false));
      dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
    } else {
      dispatch(setBodyScrollable(true));
    }
  }, [openDetails]);
  useEffect(() => {
    if (!slideInDetails) {
      setTimeout(() => {
        setOpenDetails(false);
      }, 300);
    }
  }, [slideInDetails]);


  let modalWrapperClass = `bg-white max-h-screen overflow-auto dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 ${slideInDetails ? "bottom-0" : "-bottom-[80vh]"}`;

  if (isDesktop) {
    modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-2xl transition-all top-1/2 right-1/2 translate-x-1/2 ${slideInDetails ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`;
  }


  if(props.inBox){
    
      const questionDetailModal = (
          <ModalPortal show={openDetails} selector="modal_portal">
            <div
              className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0"
              onClick={() => {
                setSlideInDetails(false);
              }}
            />

            <div className={modalWrapperClass}>
                <div className="flex justify-between items-center pt-5 px-4 mb-4 border-b border-neutral-300 dark:border-white/20 pb-5">
                  <h2 className="text-sm block"> جزییات پرسش </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSlideInDetails(false);
                    }}
                  >
                    <CloseSimple className="w-6 h-6 fill-current" />
                  </button>
                </div>
                <div className="p-4">
                    <div className="font-semibold text-xs mb-5"> {question.questionText} </div>

                    {question.answers.map(a => (
                      <UserAnswerItem key={a.id} answer={a} questionId={question.id} />
                    ))}

                  <AddAnswer 
                    questionId={props.question.id} 
                    questionText={props.question.questionText} 
                    buttonClassName="text-white bg-violet-500 rounded-xl p-3 my-3 text-xs w-full"
                  />
                </div>
            </div>
          </ModalPortal>
      );

    const answer = question.answers?.[0];

    return(
      <>
      <div className="relative w-3/4 shrink-0">
        <div 
          className="text-right min-h-44 border-b border-neutral-300 w-full dark:border-white/15 border p-3 rounded-xl bg-white dark:bg-[#011425]"
          onClick={()=>{
            if(answer){
              setOpenDetails(true)
            }
          }}
        >
          
          <div className="font-semibold text-sm mb-3">{question.questionText}</div>                
          
          {answer ? (
            <div className="relative">
              <div className="border dark:border-white/15 rounded-xl p-1 absolute top-2 left-0 right-1.5 -bottom-1.5" />
              <UserAnswerItem inBox answer={answer} questionId={question.id} />
            </div>
          ): (
            <AddAnswer 
              questionId={props.question.id} 
              questionText={props.question.questionText} 
              buttonHtml={(<div>
                برای این پرسش تا کنون پاسخی ثبت نشده
                <div className="mt-3 text-orange-500 text-xs"> ثبت پاسخ </div>
              </div>)}
              buttonClassName="py-5 bg-neutral-100 dark:bg-[#192a39] border border-neutral-200 dark:border-white/15 rounded-xl p-2.5 relative mb-2 text-xs text-right w-full"
            />
          ) }
          
        </div>          

      </div>
      {questionDetailModal}
      </>
    )
  }

  const sortedAnswers = question.answers.sort((a,b) => b.likeCount - a.likeCount);

  let firstAnswersHtml : ReactNode = null;
  let moreAnswersHtml : ReactNode = null;

  if(sortedAnswers.length){
    firstAnswersHtml = <UserAnswerItem answer={sortedAnswers[0]} questionId={question.id} />

    if(sortedAnswers.length > 1){
      moreAnswersHtml = showAllAnswers ? sortedAnswers.slice(1).map(ans => (
        <UserAnswerItem key={ans.id} answer={ans} questionId={question.id} />      
      )):(
        <div className="my-3">
          <div 
            className="select-none text-xs text-orange-500 inline-flex cursor-pointer gap-1 items-center font-semibold"
            onClick={()=>{setShowAllAnswers(true)}}
          >
            مشاهده پاسخ های دیگر
            <DownCaretThick className="w-3 h-3 fill-current" />
          </div>
        </div>
      )
    }
  }

  return (
    <>
      <div className="border-b border-neutral-300 dark:border-white/15 py-6">
        <div className="font-semibold text-sm mb-6">{question.questionText}</div>
        <div className="md:pr-4">

          {firstAnswersHtml}

          {moreAnswersHtml}

          <AddAnswer questionId={props.question.id} questionText={props.question.questionText} />
        </div>
      </div>
    </>
  );
};

export default UserQuestionItem;

/* eslint-disable  @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import ProductDesktopSection from "../productDetailDesktop/ProductDesktopSection";
import UserQuestionItem from "./UserQuestionItem";
import { QuestionItemType } from "@/types/commerce";
import AddQuestion from "./AddQuestion";
import CaretLeft from "@/components/icons/CaretLeft";
import { toPersianDigits } from "@/helpers";
import Loading from "@/components/icons/Loading";
import { useEffect, useState } from "react";
import { getProductQuestions } from "@/actions/commerce";
import SortIcon from "@/components/icons/SortIcon";
import ArrowTopLeft from "@/components/icons/ArrowTopLeft";
import ArrowRight from "@/components/icons/ArrowRight";
import { setBodyScrollable, setBodyScrollPosition } from "@/redux/stylesSlice";
import { useAppDispatch } from "@/hooks/use-store";
import ModalPortal from "@/components/shared/layout/ModalPortal";
import CloseSimple from "@/components/icons/CloseSimple";
import Skeleton from "@/components/shared/Skeleton";
import AddFirstQuestion from "./AddFirstQuestion";

type Props = {
  productId: number;
  items?: QuestionItemType[];
  total?: number;
};

type SortTypes = "Newest" | "MostAnswered";

const UserQuestionAnswer: React.FC<Props> = (props) => {
  const {isDesktop} = useIsDesktop();

  const [sort, setSort] = useState<SortTypes>("MostAnswered");
  const [questions, setQuestions] = useState<QuestionItemType[]>(
    props.items || [],
  );
  const [questionsCount, setQuestionsCount] = useState<number>(
    props.total || 0,
  );
  const [showAll, setShowAll] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isDesktop) {
      setSort("Newest");
    }
  }, [isDesktop]);

  useEffect(() => {
    const fetchData = async (id: number, s: SortTypes, q: number) => {
      setLoading(true);
      const response: any = await getProductQuestions({
        MaxResultCount: q,
        SkipCount: 0,
        ProductId: id,
        SortType: s,
      });
      setLoading(false);
      if (response.data?.result) {
        setQuestions(response.data.result.items);
        setQuestionsCount(response.data.result.totalCount);
      }
    };

    if (props.productId) {
      fetchData(props.productId, sort, showAll ? 30 : 5);
    }
  }, [props.productId, sort, showAll]);

  const dispatch = useAppDispatch();

  const [openAll, setOpenAll] = useState<boolean>(false);
  const [slideInAll, setSlideInAll] = useState<boolean>(false);
  useEffect(() => {
    if (openAll) {
      setSlideInAll(true);
      dispatch(setBodyScrollable(false));
      dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
    } else {
      dispatch(setBodyScrollable(true));
    }
  }, [openAll]);

  useEffect(() => {
    if (!slideInAll) {
      setTimeout(() => {
        setOpenAll(false);
      }, 300);
    }
  }, [slideInAll]);

  const allQuestionsModalWrapperClass = `duration-500 bg-white dark:bg-[#192a39] text-neutral-800 pb-10 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 right-1/2 translate-x-1/2 ${slideInAll ? "bottom-0" : "-bottom-[80vh]"}`;

  const sortTypeObject: {
    label: string;
    keyword: SortTypes;
  }[] = [
    { keyword: "Newest", label: "جدیدترین" },
    { keyword: "MostAnswered", label: "بیشترین پاسخ" },
  ];

  if (!props.productId) return null;

  const sortElement = (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <SortIcon className="w-4 h-4 fill-current" />
        مرتب سازی :
      </div>
      {sortTypeObject.map((s) => (
        <button
          key={s.keyword}
          type="button"
          onClick={() => {
            setSort(s.keyword);
          }}
          className={`outline-none border-none ${sort === s.keyword ? "text-orange-500" : ""} dark:font-semibold`}
        >
          {s.label}
        </button>
      ))}
    </div>
  )

  const questionListElement = questions?.map(question => (
    <UserQuestionItem key={question.id} question={question} />
  ));

  const questionListLoading = [1,2,3].map(l => (
    <div
      key={l}
      className="border-b border-neutral-300 dark:border-white/15 py-7"
    >
      <Skeleton className="h-3 mb-6 w-32" dark />
      <div className="pr-5">
        <div className="flex gap-3">
            <Skeleton className="w-7 h-7 rounded-full" type="image" dark />
            <div className="grow">
              <Skeleton className="h-3 mb-3 mt-1.5 w-1/4" dark />
              <Skeleton className="h-3 mb-3 w-3/4" dark />
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20" dark />
                <Skeleton className="h-3 w-20" dark />
              </div>
            </div>
        </div>
      </div>
    </div>
  ))

  if (isDesktop) {
    return (
      <ProductDesktopSection
        id="userQuestions"
        wrapperClassName="mb-10"
        title="پرسش ها"
        extra={!!questionsCount && <AddQuestion productId={props.productId} />}
      >
        {!!questionsCount && <div className="flex justify-between items-center mb-5 text-xs">
          {sortElement}
          <div>{toPersianDigits(questionsCount + " پرسش ")}</div>
        </div>}
                
        {questionListElement}

        {loading ? questionListLoading : (
          <>
            {questionsCount > questions.length ? (
              <div>
                <button
                  type="button"
                  className="flex items-center gap-2 font-semibold text-xs mt-5 text-orange-500"
                  onClick={() => {
                    setShowAll(true);
                  }}
                >
                  {toPersianDigits(questionsCount - 5 + " پرسش دیگر ")}
                  {showAll ? (
                    <Loading className="w-3.5 h-3.5 fill-current animate-spin" />
                  ) : (
                    <CaretLeft className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>
              </div>
            ) : null}
          </>
        )}

        {!loading && !questionsCount && (<AddFirstQuestion productId={props.productId} />)}

      </ProductDesktopSection>
    );
  }

  return (
    <>
    <section
      id="userQuestions"
      className="bg-[#e8ecf0] dark:bg-[#192b39] py-6 relative"
    >
      <div className="flex justify-between items-center mb-4 px-5">
        <h3 className="text-[#ff7189] font-bold flex gap-2 items-center text-md">
          <Image
            src="/images/icons/curl.svg"
            alt="offer"
            width={36}
            height={36}
            className="w-9 h-9"
          />
          پرسش ها
        </h3>
        {!!questionsCount && <button
          type="button"
          onClick={() => {
            setShowAll(true);
            setOpenAll(true);
          }}
          className="text-xs flex items-center gap-1"
        >
          مشاهده {questionsCount} پرسش
          <ArrowRight className="w-4 h-4 fill-current rotate-180" />
        </button>}
      </div>

      {!!questionsCount && <div className="flex gap-3 hidden-scrollbar overflow-x-auto max-lg:pr-5">
        {questions?.slice(0, 5).map((question) => (
          <UserQuestionItem key={question.id} question={question} inBox />
        ))}
        <button
          type="button"
          onClick={() => {
            setShowAll(true);
            setOpenAll(true);
          }}
          className="flex flex-col gap-2 items-center justify-center text-xs w-32 shrink-0 pl-5"
        >
          <ArrowTopLeft className="w-3.5 h-3.5 fill-current" />
          مشاهده همه
        </button>
      </div>}

      <div className="px-5">
        <AddQuestion productId={props.productId} />
      </div>
    </section>
    
    <ModalPortal show={openAll} selector="modal_portal">
      <div
        className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0"
        onClick={() => {setSlideInAll(false)}}
      />

      <div className={allQuestionsModalWrapperClass}>
          <div className="flex justify-between items-center pt-5 px-4 mb-4 border-b border-neutral-300 dark:border-white/20 pb-5">
            <h2 className="text-sm block"> پرسش و پاسخ  </h2>
            <button
              type="button"
              onClick={() => {setSlideInAll(false)}}
            >
              <CloseSimple className="w-6 h-6 fill-current" />
            </button>
          </div>
          <div className="p-4">
            {loading ? questionListLoading : questionListElement}
          </div>
      </div>
    </ModalPortal>

    </>
  );
};

export default UserQuestionAnswer;

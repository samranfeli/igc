/* eslint-disable  @typescript-eslint/no-explicit-any */

import { getStrapiHighlight } from '@/actions/strapi'
import ArrowTopLeft from '@/components/icons/ArrowTopLeft'
import { ServerAddress } from '@/enum/url'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export type HighlightSliderItemType = {
  id: number
  Title?: string
  IsActive: boolean
  Url?: string | null;
  Subtitle?: string
  Header?: string
  Image?: {
    url?: string;
    [key: string]: any;
  }
}

type Props = {
  keyword: string
  isActive: boolean
  goToNextHighlight: () => void
  goToPreviousHighlight: () => void
  direction: "ltr" | "rtl";
  
  //laterTOdo: remove dummyItems;
  dummyItems?: HighlightSliderItemType[];
}

const HighlightItemSlider: React.FC<Props> = (props) => {
  const duration = 4000

  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [items, setItems] = useState<HighlightSliderItemType[] | undefined>(props.dummyItems);

  const [loading, setLoading] = useState(false)

  const [isPaused, setIsPaused] = useState(false)
  const [remaining, setRemaining] = useState(duration)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startRef = useRef<number>(0)

  const pause = () => {
    if (remaining && !isPaused && timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      const elapsed = Date.now() - startRef.current
      setRemaining((prev) => prev! - elapsed)
      setIsPaused(true)
    }
  }

  const resume = () => {
    if (isPaused) {
      startRef.current = Date.now()
      timeoutRef.current = setTimeout(() => {
        goToNextSlide()
      }, remaining)
      setIsPaused(false)
    }
  }

  const start = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
    startRef.current = Date.now()
    setRemaining(duration)
    timeoutRef.current = setTimeout(() => {
      goToNextSlide()
    }, duration)
  }

  const { isActive } = props

  useEffect(() => {
    if (!items && isActive) {
      const fetchData = async (Keyword?: string) => {
        if (!Keyword) return

        setLoading(true)

        const response: any = await getStrapiHighlight(
          `filters[Keyword][$eq]=${Keyword}&locale=fa&populate[Item][populate][Items][populate]=*`,
        )

        setItems(response?.data?.data?.[0]?.Item?.Items || [])
        
        setTimeout(()=>{setLoading(false)}, 500)
      }

      fetchData(props.keyword)
    }
  }, [items, props.keyword, isActive])

  const goToNextSlide = () => {
    if (items) {
      if (activeIndex < items!.length - 1) {
        setActiveIndex(activeIndex + 1)
      } else {
        props.goToNextHighlight()
      }
    }
  }

  const goToPreviousSlide = () => {
    if (items) {
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1)
      } else {
        props.goToPreviousHighlight()
      }
    }
  }

  useEffect(() => {
    if (isActive && items) {
      start()
    }
  }, [activeIndex, isActive, items])

  useEffect(() => {
    if (isActive) {
      setActiveIndex(0)
    } else {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isActive])

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (loading) {
    return (
      <div
        className={`h-highlight bg-[#011425] mb-10 text-white items-center p-5 justify-center flex flex-col rounded-2xl`}
      >
        <Image
          src="/images/loading.gif"
          className="h-24 w-24 -mt-2"
          alt="loading"
          width={96}
          height={96}
        />
      </div>
    )
  }
  if (!items?.length) {
    return null
  }
  return (
    <>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`absolute top-0 left-0 right-0 transition-all duration-300 ${index === activeIndex ? 'opacity-100 visible blur-none' : 'opacity-0 invisible blur-md'
            }`}
        >
          {index === activeIndex && (
            <div
              dir={props.direction}
              className={`shadow absolute top-3.5 rounded-full overflow-hidden bg-neutral-500 z-10 ${props.direction === "ltr" ? "left-4 right-10" : "left-10 right-4"}`}
            >
              <div
                className={`bg-white h-[3px] highlight-progressbar ${isPaused ? 'animation-paused' : ''
                  }`}
              />
            </div>
          )}

          <div
            className="touch-action-none h-highlight relative"
            onContextMenu={(e) => {
              e.preventDefault()
            }}
            onMouseEnter={pause}
            onMouseLeave={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
          >
            <div className="bg-[#011425] rounded-2xl relative">
              <Image
                src={
                  item.Image?.url
                    ? `${ServerAddress.Type}${ServerAddress.Strapi}${item.Image?.url}`
                    : 'default-game.png'
                }
                alt={item.Title || item.Subtitle || ''}
                width={600}
                height={1000}
                className="rounded-2xl w-full h-highlight object-cover "
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 pt-24 text-white bg-gradient-to-t from-black/90 to-transparent rounded-b-2xl">
                <div className="text-center mb-5">
                  <div className="mb-2 text-xs font-bold">{item.Header}</div>
                  <b className="block mb-2 text-2xl font-bold">{item.Title} </b>
                  {!!item.Subtitle && <p className="text-xs">{item.Subtitle}</p>}
                </div>
                <Link
                  prefetch={false}
                  href={item.Url || '#'}
                  className="mx-4 text-sm block p-2 bg-gradient-to-t from-[#a839fe] to-[#fe81ff] rounded-full flex justify-between items-center"
                >
                  <span className="block w-10" />
                  خرید
                  <span className="block bg-[#a93aff] p-3 rounded-full">
                    <ArrowTopLeft className="w-3.5 h-3.5 fill-current" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div
            className={`absolute w-20 top-0 bottom-0 ${props.direction === "ltr" ? "-right-3" : "-left-3"}`}
            onClick={() => {
              goToNextSlide()
            }}
          />
          <div
            className={`absolute w-20 top-0 bottom-0 ${props.direction === "ltr" ? "-left-3" : "-right-3"}`}
            onClick={() => {
              goToPreviousSlide()
            }}
          />
        </div>
      ))}

      <div className={`flex absolute bottom-5 left-4 max-w-full ${items.length > 10 ? "gap-0.5" : "gap-1"}`}>
        {items.map((item, index) => (
          <button
            key={item.id}
            className={`${items.length > 10 ? "h-2" : "h-2.5"} rounded-[15px] block transition-all ${index === activeIndex ? "w-5 bg-[#a93aff]" : items.length > 10 ? "w-2 bg-[#bbbbbb]" :"w-2.5 bg-[#bbbbbb]"}`}
            onClick={() => { setActiveIndex(index) }}
          />
        ))}
      </div>
    </>
  )
}

export default HighlightItemSlider

/* eslint-disable  @typescript-eslint/no-explicit-any */

import { HighlightSliderItemType } from "@/components/home/highlights/HighlightItemSlider";

export type HighlightItemType = {
    updatedAt:string;
    Keyword: string;
    id: number;
    [key: string]: any;
    Item?: {
        Image: {
            url?: string;
            [key: string]: any;
        };
        Title?: string;
        [key: string]: any;
    };
    dummyItems?: HighlightSliderItemType[]
}
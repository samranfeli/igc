/* eslint-disable  @typescript-eslint/no-explicit-any */

export type PlatformSlugTypes = "playstation-5" | "playstation-4" | "steam" | "xbox-one" | "xbox-series-xs" | "nintendo-switch-2";


export interface ProductItemGenres {
    keyword?: string;
    name?: string
};
export interface ProductItemPlayerPerspective {
    keyword?: string;
    name?: string;
};
export interface ProductItemTheme {
    keyword?: string;
    name?: string;
    id?: number;
};

export interface ProductItemGameplay {
    keyword?: string;
    name?: string;
};

export interface ProductItemDeveloper {
    fileAltAttribute?: string;
    filePath?: string;
    fileTitleAttribute?: string;
    name?: string;
    slug?: string;
};
export interface ProductItemPublisher {
    fileAltAttribute?: string;
    filePath?: string;
    fileTitleAttribute?: string;
    name?: string;
    slug?: string;
}


export interface ProductItem {
    id: number;
    slug?: string;
    filePath?: string;
    name?: string;
    releaseDate?: string;
    fileAltAttribute?: string;
    fileTitleAttribute?: string;
    pegi?: {
        title?: string;
        description?: string;
        keyword?: string;
        name?: string;
        id?: number;
        image?: string;
        items?: {
            description?: string;
            image?: string;
            keyword?: string;
            name?: string;
            // "title": null,
            // "items": null,
            // "id": 0
        }[];
    };
    esrb?: {
        title?: string;
        description?: string;
        keyword?: string;
        name?: string;
        id?: number;
        image?: string;
        items?: {
            description?: string;
            image?: string;
            keyword?: string;
            name?: string;
            // "title": null,
            // "items": null,
            // "id": 0
        }[];
    };
    minVariant?:Omit<ProductVariant, "children">;
}

export interface ProductItemExtented extends ProductItem {
    strapiProductProperties?:{
        url?: string;    
        price?: number;
        oldPrice?: number; 
    }
}

export interface RatingItemType {
    id: number;
    total: number;
    type: "IGN" | "GameSpot" | "Metacritic" | "Eurogamer" | "Steam";
    value: number;
}

export interface ProductVariant {
    id: number;
    name?: string;
    slug?: string;
    value?: string;
    children?: ProductVariant[];
    items?: {
        filePath?: string;
        status?:  "InStock" | "OutOfStock" | "OnBackOrder" | "ComingSoon" | "OnDemand";
        attributes?: {
            value?: string;
        }[];
        regularPrice?: number;
        salePrice?: number;
        profitPercentage?: number;
        profitPrice?: number;
        currencyType?: string;
        sku?: string;
        inventory?: "Unlimited" | "Limited";
        id: number;
        description?: string;
        isVirtual: boolean;
    }[];
}
export interface SingleVariant {
  id:number;
  sku?: string;
  subTitle?: string;
  currencyType?: "IRR"|"USD";
  regularPrice?: number;
  salePrice?: number;
  name?: string;
  status?:  "InStock" | "OutOfStock" | "OnBackOrder" | "ComingSoon";
  inventory?: "Unlimited" | "Limited";
  filePath?: string;
  // "productId": 1242,
  // "netPrice": 22.41,
  // "stockQuantity": 0,
  // "isActive": true,
  // "isVirtual": true,
  // "isDownloadable": false,
  // "fileUniqKey": "8306b3b1-65cd-f011-bf7a-000c29176f1e",
  // "fileAltAttribute": null,
  // "fileTitleAttribute": null,
  // "product": {
  //   "name": "Call of Duty: Mobile",
  //   "slug": "call-of-duty-mobile",
  //   "permalink": "product/call-of-duty-mobile/",
  //   "link": "https://www.irangamecenter.com/product/call-of-duty-mobile/",
  //   "canonicalUrl": "https://www.irangamecenter.com/product/call-of-duty-mobile/"
  // }
}

export interface ProductGalleryItem {
    id:number;
    cdnPath?: string;
    mediaType?: "Image" | "Video";
    filePath?:string;
    thumbnail?: string;
    fileTitleAttribute?: string;
    fileAltAttribute?: string;
    duration?: number;
    creationTime?: string;
//   "isActive": true,
//   "fileUniqKey": "1e5457dc-ce85-f011-bf76-000c29176f1e",
//   "thumbnailUniqKey": "432755c9-ce85-f011-bf76-000c29176f1e",
    cdnThumbnail: string | null,
}

export interface ProductDetailData {
    categories?: {      
      name?: string;
      slug?: "mobile-games" | "console-game";
    }[];
    fileAltAttribute?: string;
    filePath?: string;
    fileTitleAttribute?: string;
    breadcrumbs?: {
        name?: string;
        url?: string;
    }[];
    name?: string;
    faqs?: {
        answer?: string;
        questions?: string;
        id: number;
    }[];
    description?: string;
    shortDescription?: string;
    genres?: {
        keyword?: string;
        name?: string
    }[];

    rating?: RatingItemType[];
    playerPerspective?: {
        keyword?: string;
        name?: string;
    }[];
    pegi?: {
        title?: string;
        description?: string;
        keyword?: string;
        name?: string;
        id?: number;
        image?: string;
        items?: {
            description?: string;
            image?: string;
            keyword?: string;
            name?: string;
            // "title": null,
            // "items": null,
            // "id": 0
        }[];
    };
    pegics?: {
        title?: string;
        description?: string;
        keyword?: string;
        name?: string;
        id?: number;
    }[];
    esrb?: {
        title?: string;
        description?: string;
        keyword?: string;
        name?: string;
        id?: number;
        image?: string;
        items?: {
            description?: string;
            image?: string;
            keyword?: string;
            name?: string;
            // "title": null,
            // "items": null,
            // "id": 0
        }[];
    };
    theme?: {
        keyword?: string;
        name?: string;
        id?: number;
    }[];
    awards?: string[];
    releaseDate?: string;
    gameplay?: {
        keyword?: string;
        name?: string;
    }[];
    developer?: {
        fileAltAttribute?: string;
        filePath?: string;
        fileTitleAttribute?: string;
        name?: string;
        slug?: string;
    };
    publisher?: {
        fileAltAttribute?: string;
        filePath?: string;
        fileTitleAttribute?: string;
        name?: string;
        slug?: string;
    }
    similar?:ProductItem[];
    page?:{
        title?: string;
        richSnippet?: string;
        metas?: {
             [key: string]: string;
        }
    }
    id: number;
    igdb?: string;
    slug: string;
    minVariant?:{
      items?:{
        currencyType?: string;
        salePrice?: number;
      }[];
    }
}

export type GetAllProductsParams = {
  skipCount: number;
  maxResultCount: number;
  search?: string;
  orderBy?: unknown;
  sortBy?: unknown;
  onlyAvailable?: boolean;
  variants?: PlatformSlugTypes[];  
} & {
  [key: string]: string[] | number | string | unknown;
}

export type FilterItems = "publishers" | "developers" | "gameplays" | "genres" | "themes" | "playerPerspectives" | "pegis" | "esrbs" | "variants";

export interface Facet {
    key: string;
    label?: string;
    items?: {
        count: number;
        value: string;
        label?: string;
    }[]
}
export interface GetProductsDataType {
    facets?: Facet[];
    pagedResult?: {
        items?: ProductItem[];
        totalCount?: number;
    };
}
export interface GetProductsResponseType {
    data?: {
        result?: GetProductsDataType;
    }
}


export interface GetCartByProductIdType {
    deviceId?: string,
    id: string;
    items: {
        variantId: number;
        quantity: number;
        id: number;
        // strikePrice: number;
        // unitDiscountAmount: number;
        // totalDiscountAmount: number;
        // totalStrikePrice: number;
        // unitPrice: number;
        // totalPrice: number;
        // variant: VariantType;
    }[];
    payableAmount: number,
    profitAmount : number,
    totalItemsPrice : number,
    totalQuantity: number
}

type VariantAttributeValue = {
  id: number;
  variantId: number;
attributeValueId: number;
  name:string
};
type VariantType = {
  id: number;
  creationTime: string;
  creatorUserId: number | null;
  currencyType: string;
  deleterUserId: number | null;
  deletionTime: string | null;
  description: string | null;
  fileAltAttribute: string | null;
  filePath: string | null;
  fileTitleAttribute: string | null;
  fileUniqKey: string | null;
  isActive: boolean;
  isDeleted: boolean;
  isDownloadable: boolean;
  isVirtual: boolean;
  lastModificationTime: string | null;
  lastModifierUserId: number | null;
  name: string | null;
  netPrice: number;
  productId: number;
    product: ProductItem;
  regularPrice: number;
  salePrice: number;
  status: string;
    stockQuantity: number;
    variantAttributeValues?: VariantAttributeValue[];
    attributes?:string[]
};
export interface GetCurrentProductItemType{
  id: number;
    variantId: number;
    quantity: number;
    profitPercent: number;
    unitPrice: number;            
    unitDiscountAmount: number;   
    strikePrice: number;          
    totalPrice: number;           
    totalDiscountAmount: number; 
    variant: VariantType;
}
export interface GetCurrentProductType {
  id: number;
  deviceId: string;
  payableAmount: number;
  profitAmount: number;
  totalItemsPrice: number;
  totalQuantity: number;
  items: GetCurrentProductItemType []
}
export interface GetCurrentProductResponseType {
    result?: GetCurrentProductType;
}

export interface GetCartByProductIdResponseType {
    result?: GetCartByProductIdType
}

export interface CreateOrderResponseType {
  result?: {
    id?: string;
    orderNumber?: string;
    [key: string]: unknown;
  };
}

export interface OrderListItemItemsType {
    "provider": null,
    "netPrice": 0,
    "product": {
        genres:{
            keyword: string;
            name:string;
            id: number
            }[];
        gameplay: {
            keyword: string;
            name: string;
            id: number;
        }[];
        playerPerspective: {
            keyword: string;
            name: string;
            id: number;
        }[];
        theme: {
            keyword: string;
            name: string;
            id: number;
        }[];
        filePath?:string;
        fileTitleAttribute?: string;
        fileAltAttribute?:string;
        slug: string;
        name?: string;
        id: number;
    },
    variant?:{
      filePath?: string;
    };

    currencyType: "USD" | "IRR";
    id: number;
}

export interface OrderListItemType {
    phoneNumber: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    gender:boolean;
    orderNumber: string;
    currencyType: "IRR" | "USD";
    status: "Pending" | "TODO";
    creationTime: string;
    items: OrderListItemItemsType[];

    "specialRequest": null,
    "totalItemsPrice": 0,
    "payableAmount": 0,
    "totalQuantity": 0,
    "profitAmount": 0,
    "profitPercent": 0,
    "paymentStatus": "None",
    "terminalType": "e8fad149-7a12-44f2-9f15-cde4a242baf0",
    "tenantId": 1040,
    "userId": null,
    "lastModifierUserId": null,
    "timeLines": [
        {
            "orderId": 247403,
            "description": null,
            "status": "Pending",
            "reasonCode": "None",
            "creationTime": "2025-12-14T19:03:45.0712972",
            "creatorUserId": 171734,
            "id": 157
        }
    ],
    "id": 247403
}

export interface OrderDetailItemTimelineItem {
  progressPercent: number;
  nextStep?: string;
  nextStepStr?: string;
  description: string;
  step: "Created" | string;
  stepStr?: string;
  status: "Pending" | string;
  isDone: boolean;
  creationTime: string;
  isFinal:boolean;
  "reasonCode": "None",
  "creatorUserId": 171734,
  "id": 11
}
export interface OrderDetailItemType{
  allowNewLoginSubmission?: boolean;
  //"provider": null,
  currentTimeline?:OrderDetailItemTimelineItem;
  timeLines?:OrderDetailItemTimelineItem[];
  netPrice: number;
  product: {
    "genres": [
      {
        "keyword": "Action",
        "name": "اکشن",
        "id": 0
      },
      {
        "keyword": "Shooter",
        "name": "شوتر / تیراندازی",
        "id": 0
      }
    ],
    "gameplay": [
      {
        "keyword": "OnlineMultiplayer",
        "name": "چندنفره آنلاین",
        "id": 0
      },
      {
        "keyword": "PvPCompetitive",
        "name": "رقابتی",
        "id": 0
      },
      {
        "keyword": "Coop",
        "name": "همکاری تیمی",
        "id": 0
      }
    ],
    "playerPerspective": [
      {
        "keyword": "FirstPerson",
        "name": "[Gameplay:First person]",
        "id": 0
      },
      {
        "keyword": "ThirdPerson",
        "name": "[Gameplay:Third person]",
        "id": 0
      }
    ],
    "theme": [
      {
        "keyword": "ModernMilitary",
        "name": "مدرن / نظامی",
        "id": 0
      }
    ],
    "esrb": {
      "title": "۱۷ سال به بالا",
      "description": "\r\n\t\t  شامل خشونت شدید، خونریزی، محتوای جنسی یا زبان بسیار زننده است. فقط برای بزرگ‌ترها.\r\n\t  ",
      "image": "https://cdn.irangamecenter.com/images/logo/m.svg",
      "items": [
        {
          "title": null,
          "description": "وجود درگیری یا صحنه‌های آسیب فیزیکی",
          "image": null,
          "items": null,
          "keyword": "Violence",
          "name": "خشونت",
          "id": 0
        },
        {
          "title": null,
          "description": "استفاده از الفاظ توهین‌آمیز، رکیک یا ناسزا",
          "image": null,
          "items": null,
          "keyword": "Language",
          "name": "زبان توهین‌آمیز",
          "id": 0
        },
        {
          "title": null,
          "description": "[ESRB:CD:Description:Useof alcohol]",
          "image": null,
          "items": null,
          "keyword": "UseofAlcohol",
          "name": "[ESRB:CD:Useof alcohol]",
          "id": 0
        }
      ],
      "keyword": "M",
      "name": "مناسب برای بزرگسالان",
      "id": 0
    },
    "pegi": {
      "title": "+18",
      "description": "\r\n\t\t  خشونت بسیار شدید، محتوای جنسی صریح، زبان بسیار زشت یا موضوعات غیرقابل قبول برای نوجوانان.\r\n\t  ",
      "image": "https://cdn.irangamecenter.com/images/logo/pegi18.jpg",
      "items": [
        {
          "title": null,
          "description": "\r\n\t\t  نشان می‌دهد که بازی دارای صحنه‌هایی از آسیب جسمی، جنگ یا تخریب است.\r\n\t  ",
          "image": "https://cdn.irangamecenter.com/images/logo/violence.jpg",
          "items": null,
          "keyword": "Violence",
          "name": "خشونت",
          "id": 0
        },
        {
          "title": null,
          "description": "\r\n\t\t  شامل الفاظ رکیک، ناسزا یا زبان توهین‌آمیز.\r\n\t  ",
          "image": "https://cdn.irangamecenter.com/images/logo/badlanguage.jpg",
          "items": null,
          "keyword": "BadLanguage",
          "name": "زبان زشت",
          "id": 0
        },
        {
          "title": null,
          "description": "\r\n\t\t  بازی شامل پرداخت برای آیتم‌ها، DLC یا ویژگی‌های بیشتر از طریق فروشگاه است.\r\n\t  ",
          "image": "https://cdn.irangamecenter.com/images/logo/ingamepurchases.jpg",
          "items": null,
          "keyword": "IngamePurchases",
          "name": "خریدهای درون‌برنامه‌ای",
          "id": 0
        }
      ],
      "keyword": "PEGI18",
      "name": "فقط برای بزرگ‌سالان",
      "id": 0
    },
    "selectedVariant": null,
    "minVariant": null,
    "minVariantItem": null,
    "tags": [],
    "slug": "call-of-duty-mobile",
    "permalink": "product/call-of-duty-mobile/",
    "name": "Call of Duty: Mobile",
    "link": "https://www.irangamecenter.com/product/call-of-duty-mobile/",
    "canonicalUrl": "https://www.irangamecenter.com/product/call-of-duty-mobile/",
    "fileUniqKey": "07009a4f-44b9-f011-bf78-000c29176f1e",
    "filePath": "https://cdn.irangamecenter.com/images/products/1242/call-of-duty-mobile.webp",
    "fileTitleAttribute": "تصویر بازی Call of Duty: Mobile",
    "fileAltAttribute": "بازی Call of Duty: Mobile برای موبایل",
    "shortDescription": null,
    "releaseDate": "2019-10-01T00:00:00",
    "brands": [],
    "awards": [
      "برنده Best Mobile Game در The Game Awards 2019",
      "برنده Mobile Game of the Year در Mobile Games Awards 2020",
      "برنده Mobile Game of the Year در 16th British Academy Games Awards (BAFTA)"
    ],
    "publisher": null,
    "developer": null,
    "id": 1242
  },
  variant?: {
    attributes?: string[];
    "product": null,
    "isActive": true,
    "name": null,
    "status": "InStock",
    "isVirtual": true,
    "isDownloadable": false,
    "description": "۸۰ سی پی",
    "fileUniqKey": "8a06b3b1-65cd-f011-bf7a-000c29176f1e",
    "filePath": "https://cdn.irangamecenter.com/images/products/1242/variants/cp۸۰.png",
    "fileTitleAttribute": null,
    "fileAltAttribute": null,
    "currencyType": "USD",
    "id": 2918
  },
  productId: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
  unitDiscountAmount: number;
  strikePrice: number;
  currencyType: "USD" | "IRR",
  id: number;
}

export interface OrderDetail {
    creationDateStr?: string;
    creationTimeStr?: string;
    phoneNumber: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    gender: boolean;
    specialRequest?: unknown;
    orderNumber: string;
    currencyType: "IRR" | string;
    totalItemsPrice: number;
    payableAmount: number;
    totalDiscountPrice?: number;
    totalQuantity: number;
    profitAmount: number;
    profitPercent: number;
    paymentStatus: "None";
    status: "Pending" | string;
    creationTime: string;
    tenantId: number;
    id: number;
    items: OrderDetailItemType[];
}

export interface OrderFormFields {
    key: "platform";
    type:
      "Select"
      | "Text"
      | "Password"
      | "Checkbox"
      | "InputGroup"
      | "Email"
      | "Textarea";
    isRequired: boolean;
    inputGroupCount?: number;
    extraJson: null;
    order: number;
    sourceDependencies: [];
    targetDependencies: [];
    translations: {
      language: "fa" | "en";
      label: string;
      placeholder?: string;
      info: "";
      id: number;
    }[];
    options?: {
      value: string;
      order: 1;
      translations: {
        language: "fa" | "en";
        displayName?: string;
      }[];
      id: 3;
    }[];

    id: 69;
  }
export interface OrderFormData {
  providerKey: "Konami";
  extraJson: null;
  icon: "https://cdn.irangamecenter.com/images/provider/konami.svg";
  displayName: null;
  description: null;
  productIds: [];
  fields: OrderFormFields[];
  id: 23;
}

export interface CreateOrderParams {
  phoneNumber?:string;
  email?:string;
  firstName?:string;
  lastName?:string;
  gender:boolean;
  specialRequest?:string;
  metaSearchName?:string;
  metaSearchKey?:string;
}

export type StrapiSeoData = {
  PageTitle?: string;
  Schema?: any;
  Metas?: {
    id: number;
    Type?: string;
    Value?: string;
  }[];
};

export interface WishListItemType {
    creationTime: string;
    id: number;
    product: {
        id: number;
      filePath?: string;
      fileTitleAttribute?: string;
      fileAltAttribute?: string;
      name?: string;
      slug?: string;

      categories?: {      
        name?: string;
        slug?: string;
      }[];
    }
}

export type AnswerItemType = {
    id: number;
    questionId: number;
    userId: number;
    userDisplayName?: string;
    isAnonymous: boolean;
    answerText?: string;
    isVerifiedBuyer: boolean;
    status: "Approved" | "Pending" | "Rejected";
    likeCount: number;
    dislikeCount: number;
    creationTime?: string;
}

export type QuestionItemType = {
    productId: number;
    userId: number;
    questionText?: string;
    userDisplayName?: string;
    isAnonymous: boolean;
    isVerifiedBuyer: boolean;
    status: "Approved" | "Pending" | "Rejected";
    likeCount: number;
    dislikeCount: number;
    id: number;
    creationTime?: string;
    answers: AnswerItemType[];
}
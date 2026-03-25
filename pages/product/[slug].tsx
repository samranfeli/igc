/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextPage } from 'next';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { getProductBySlug, getProductGalleries, getProductVariants, getVariantById } from '@/actions/commerce';
import {PlatformSlugTypes, ProductDetailData, ProductGalleryItem, ProductVariant, SingleVariant } from '@/types/commerce';
import FAQ from '@/components/shared/FAQ';
import parse from 'html-react-parser';
import Image from 'next/image';
import RatingItem from '@/components/products/RatingItem';
import { dateDisplayFormat} from '@/helpers';
import Link from 'next/link';
import ProductDetail from '@/components/products/ProductDetail';
import AgeRatingDetail from '@/components/products/AgeRatingDetail';
import ArrowTopLeft from '@/components/icons/ArrowTopLeft';
import VariantSection from '@/components/products/VariantSection';
import Head from 'next/head';
import ProductGalleryCarousel from '@/components/products/ProductGalleryCarousel';
import ProductTabs from '@/components/products/ProductTabs';
import Star from '@/components/icons/Star';
import SimilarProducts from '@/components/products/SimilarProducts';
import { useRouter } from 'next/router';
import Skeleton from '@/components/shared/Skeleton';
import { useAppDispatch, useAppSelector } from '@/hooks/use-store';
import { setHeaderParams } from '@/redux/pages';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import MoreWrapper from '@/components/shared/layout/header/MoreWrapper';
import ProductSpecificationSection from '@/components/products/productDetailDesktop/ProductSpecificationSection';
import ProductDescriptionSection from '@/components/products/productDetailDesktop/ProductDescriptionSection';
import ProductRatingSection from '@/components/products/productDetailDesktop/ProductRatingSection';
import ProductAwardsSection from '@/components/products/productDetailDesktop/ProductAwardsSection';
import ProductFAQSection from '@/components/products/productDetailDesktop/ProductFAQSection';
import UserQuestionAnswer from '@/components/products/userQuestions/UserQuestionAnswer';
import ModalPortal from '@/components/shared/layout/ModalPortal';
import Otp from '@/components/authentication/profile/OTP';
import LoginWithPassword from '@/components/authentication/LoginWithPassword';

type Props = {
  serverSideProductData?: ProductDetailData;
  slug?: string;
  serverSideGalleryData?: ProductGalleryItem[];
  serverSideVariants?:ProductVariant[];
  serverSideVariant?:SingleVariant;
  //serverSideQuestions?: {items:QuestionItemType[], totalCount: number};
}

const DetailProduct: NextPage<Props> = props => {

  const {serverSideGalleryData, serverSideProductData, serverSideVariant, serverSideVariants, slug} = props;

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const getUserLoading = useAppSelector(state => state.authentication.getUserLoading);

  const [detailActiveTab, setDetailActiveTab] = useState<string>('');

  const [productData, setProductData] = useState<ProductDetailData | undefined>(serverSideProductData);

  const [hasSimilar, setHasSimilar] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const isDesktop = useIsDesktop();

  const router = useRouter();

  const {query} = router;

  const queryVariant = query.variant as string|undefined;
  const queryPlatform = query.platform as PlatformSlugTypes | undefined;  

  const queryTorob = query.utm_source === "Torob";

  const [loginType, setLoginType] = useState<"otp" | "password">("otp");
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(()=>{
    if(!isAuthenticated && !getUserLoading && queryTorob){
      setShowLoginModal(true);
    }else{
      setShowLoginModal(false);
    }
  },[isAuthenticated,getUserLoading,queryTorob ]);

  useEffect(()=>{

    dispatch(setHeaderParams({
      headerParams:{
        logo: true,
        cart: true,
        productId: productData?.id,
        share: true,
        productVariantId: queryVariant? +queryVariant : undefined
      }
    }));

  },[productData?.id]);


  useEffect(()=>{
    return(()=>{
      dispatch(setHeaderParams({headerParams: undefined}));
    })
  },[]);

  useEffect(()=>{
    setProductData(serverSideProductData);
  },[serverSideProductData?.id]);

  const breadcrumbsItems: {
    label: string;
    link?: string;
  }[] = [];

  const [variantsData, setVariantsData] = useState<ProductVariant[] | undefined>();
  const [variantsLoading, setVariantsLoading] = useState<boolean>(true);

  const [variantData, setVariantData] = useState<SingleVariant| undefined>(undefined);
  const [variantLoading, setVariantLoading] = useState<boolean>(true);

  useEffect(()=>{
    const fetchProductDataInClientForDebugging = async (s:string) => {
      const response: any = await getProductBySlug({
        acceptLanguage:"fa-IR",
        slug: s,
        platform: queryPlatform,
        variantId: queryVariant ? +queryVariant : undefined
      });  
      if(response?.data?.result && !productData ){
        setProductData(response.data.result);
      }
    }
    
    if(slug){
      fetchProductDataInClientForDebugging(slug);
    }

  },[slug]);

  useEffect(()=>{

    const fetchVariants = async (s:string) => {
        setVariantsLoading(true);
      const response: any = await getProductVariants(s);
      if(response.data?.result){
        setVariantsData(response.data.result)
      }
      setVariantsLoading(false);
    }

    const fetchVariant = async (id: number) => {
        setVariantLoading(true);
        const response: any = await getVariantById(id);
        if(response.data?.result){
          setVariantData(response.data.result)
        }
        setVariantLoading(false);
    }

    if(slug){
      if(queryVariant){
        fetchVariant(+queryVariant)
      }
      fetchVariants(slug);
    }

  },[slug, queryVariant]);

  const sortedGalleryItems = useMemo(() => {
    if (!serverSideGalleryData) return [];
    return [...serverSideGalleryData].sort((a, b) => {
      if (a.mediaType === 'Image' && b.mediaType === 'Video') return 1;
      return -1;
    });
  }, [serverSideGalleryData?.[0]?.filePath]);

  const parsedShortDescription = useMemo(() => {
    if (!productData?.shortDescription) return null;
    return parse(productData.shortDescription);
  }, [productData?.shortDescription]);


  if (!productData) return (
    <div className='p-5'>
      محصول مورد نظر وجود ندارد
    </div>
  );

  if (productData?.breadcrumbs?.length) {
    breadcrumbsItems.push(
      ...productData.breadcrumbs.map((item) => ({
        label: item.name || '',
        link: item.url
      }))
    );
  }

  const metas: { property: string; content: string }[] = [];

  for (const m in productData?.page?.metas) {
    metas.push({
      property: m,
      content: productData.page?.metas[m],
    });
  }

  let firstRatingTag: ReactNode = null;
  if (productData?.rating?.length) {
    firstRatingTag = (
      <div className='text-xs flex items-center gap-2'>
        <Star className='fill-[#ff9800] w-6 h-6' />
        {productData.rating[0].value} از {productData.rating[0].total} <b className='font-semibold'> ({productData.rating[0].type}) </b>
      </div>
    )
  }

  let brandTag: ReactNode = null;
  if (productData.publisher?.name) {
    brandTag = (
      <Link prefetch={false} className='block text-xs text-[#228be6] dark:text-[#68cedb] mt-1.5' href={`/brand/${productData.publisher.slug}`}> {productData.publisher.name} </Link>
    )
  } else if (productData.developer?.name) {
    brandTag = (
      <Link prefetch={false} className='block text-xs text-[#228be6] dark:text-[#68cedb] mt-1.5' href={`/brand/${productData.developer.slug}`}> {productData.developer.name} </Link>
    )
  }

  let mainImage: ReactNode = null;
  if(productData?.filePath){
    mainImage = <Image
      src={productData.filePath}
      alt={productData.fileAltAttribute || productData.name || ''}
      width={400}
      height={200}
      className="h-auto w-24 block rounded-xl object-cover"
      title={productData.fileTitleAttribute || productData.name}
    />
  }

  if(queryVariant){
    if(variantLoading){
      mainImage = <Skeleton 
        dark
        type='image'
        className='w-24 h-24 block rounded-xl'
      />
    }else{
      mainImage = <Image
        src={variantData?.filePath || productData.filePath || "/images/default-game.png"}
        alt={productData.fileAltAttribute || productData.name || ''}
        width={400}
        height={200}
        className="h-auto w-24 block rounded-xl object-cover"
        title={productData.fileTitleAttribute || productData.name}
      />
    }
  }


  function getLeafNodes(nodes: ProductVariant[]): ProductVariant[] {
    const leaves: ProductVariant[] = [];

    function traverse(currentNode: ProductVariant): void {
      if (currentNode.children === null) {
        leaves.push(currentNode);
      } else {
        currentNode.children?.forEach(child => traverse(child));
      }
    }

    nodes.forEach(rootNode => traverse(rootNode));
    
    return leaves;
  }

  const flattedVariants = getLeafNodes(serverSideVariants||[]).filter(v => !!(v.items?.[0]?.sku && v.items?.[0]?.salePrice));


  let schemaOffers : {
      "@type": "Offer";
      "sku": string;
      "price": number;
      "priceCurrency": "IRR" | string;
      "availability": "https://schema.org/InStock" | string;
      "seller": {
        "@type": "Organization",
        "name": "Iran Game Center"
      }
  }[] = [];

  if(flattedVariants?.length){
    schemaOffers =  flattedVariants.map(v => {
      
      let availabilityStatus = ""
      switch(v.items?.[0]?.status){
        case "ComingSoon":
        case "OnBackOrder":
          availabilityStatus = "PreOrder";
          break;
        case 'OutOfStock':
          availabilityStatus = "OutOfStock";
          break; 
        case "InStock":
          if(v.items?.[0]?.inventory === "Unlimited"){
            availabilityStatus = "InStock";
          }else{
            availabilityStatus = "LimitedAvailability";
          }
          break;
        default :
          availabilityStatus = v.items?.[0]?.status || "";
      }

      return ({
      "@type":"Offer",
      priceCurrency: v.items?.[0]?.currencyType || "IRR",
      price: v.items?.[0]?.salePrice || 0,
      seller:{
        "@type":"Organization",
        "name":"Iran Game Center"
      },
      sku: v.items?.[0].sku || "",
      availability: availabilityStatus
    })
    })
  }
  
  if(serverSideVariant){
    let availabilityStatus = ""
    switch(serverSideVariant.status){
      case "ComingSoon":
      case "OnBackOrder":
        availabilityStatus = "PreOrder";
        break;
      case 'OutOfStock':
        availabilityStatus = "OutOfStock";
        break; 
      case "InStock":
        if(serverSideVariant.inventory === "Unlimited"){
          availabilityStatus = "InStock";
        }else{
          availabilityStatus = "LimitedAvailability";
        }
        break;
      default :
        availabilityStatus = serverSideVariant.status || "";
    }

    schemaOffers = [{
      "@type":"Offer",
      sku: serverSideVariant.sku||"no-data",
      price: serverSideVariant.salePrice || 0,
      seller:{
        "@type":"Organization",
        "name":"Iran Game Center"
      },
      availability:availabilityStatus,
      priceCurrency:serverSideVariant.currencyType || "IRR"
    }]
  }

  const schemaGraphs : any[] = [
    {
      "@type": "Product",
      "name": productData.name,
      "description": productData.page?.title || "" ,
      "brand": {
        "@type": "Brand",
        "name": productData.publisher?.name || ""
      },
      "url": `https://irangamecenter.com/product/${productData.slug}`,
      "image": [productData.filePath],
      "category":  productData.categories?.[0]?.name,    
      "audience": {
        "@type": "Audience",
        "audienceType": productData.categories?.[0]?.slug === "console-game" ? "Console Gamers" : productData.categories?.[0]?.slug === "mobile-games" ? "Mobile Gamers" : "Gamers"
      },
      
      "identifier": [
        {
          "@type": "PropertyValue",
          "propertyID": "IGDB ID",
          "value": productData.igdb || ""
        }
      ],                    
      "offers": schemaOffers
    }
  ];

  const schemaVideoItems = serverSideGalleryData?.filter(g => g.mediaType === "Video");

  if(schemaVideoItems?.length){
    for (const v of schemaVideoItems){
      let formattedDuration = "";
      if(v.duration && v.duration > 0){
                      
        const H = Math.floor(v.duration/3600);            
        const M = Math.floor((v.duration % 3600) / 60);              
        const S = Math.floor(v.duration%60 );
        
        formattedDuration = "PT";

        if(H){
          formattedDuration += `${H}H`;
        }
        if(M){
          formattedDuration += `${M}M`;
        }
        if(S){
          formattedDuration += `${S}S`;
        }
        
      }
      schemaGraphs.push(
        {
          "@type": "VideoObject",
          "name": v.fileAltAttribute,
          "description": v.fileTitleAttribute ||"",
          "thumbnailUrl": v.thumbnail || "",
          "uploadDate": v.creationTime ? new Date(v.creationTime).toISOString() : "",
          "duration": formattedDuration,
          "contentUrl": v.filePath,
          "embedUrl": v.cdnPath
        }
      )
    }
  }

  if(productData.faqs?.length){
    const mainEntity : any[] = [];
    for (const f of productData.faqs){
      mainEntity.push({
        "@type": "Question",
        "name": f.questions,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }                    
      })
    }
    schemaGraphs.push({
      "@type": "FAQPage",
      "mainEntity": mainEntity
    })
  }

  if(productData.breadcrumbs?.length){
    const itemListElements : any[] = [{
      "@type": "ListItem",
      "position": 1,
      "name": "خانه",
      "item": "https://irangamecenter.com"
    }];
    for (const [index, element]of productData.breadcrumbs.entries()){
      itemListElements.push({
        "@type": "ListItem",
        "position": index+2,
        "name": element.name,
        "item": element.url?.startsWith("http")
          ? element.url
          : `https://irangamecenter.com${element.url}`
      }) 
    }

    schemaGraphs.push(
      {
        "@type": "BreadcrumbList",
        "itemListElement": itemListElements
      } 
    )
  }

  const breadcrumb = !!breadcrumbsItems.length && (
    <Breadcrumb
      items={breadcrumbsItems}
      wrapperClassName="max-lg:mb-4"
    />
  );

  const intro = (
    <>
      <h2 className="text-lg lg:text-2xl font-semibold block pt-3">
        {productData?.name}
      </h2>
      {!!variantData?.subTitle && <h3 className="font-semibold block mb-2">
        {variantData.subTitle}
      </h3>}
      {firstRatingTag}
      {brandTag}
    </>
  );

  const productTab = (
    <ProductTabs
      tabs={[
        { id: 'specs', label: 'مشخصات', isActive: !!productData },
        { id: 'description', label: 'توضیحات', isActive: !!productData?.shortDescription },
        { id: 'ratings', label: 'امتیازها', isActive: !!productData?.rating?.length },
        { id: 'awards', label: 'جوایز', isActive: !!productData?.awards?.length },
        { id: 'faq', label: 'سوالات متداول', isActive: !!productData?.faqs?.length },
        { id: 'similar', label: 'محصولات مشابه', isActive: hasSimilar },
        { id: 'userQuestions', label: 'پرسش ها', isActive: hasSimilar },
      ]}
    />
  )

  const specs = (
    <>
      <div id="specs" className="px-4">
        <div className="flex justify-between items-top mb-5">
          <strong className="text-sm"> مشخصات بازی </strong>
          <ProductDetail
            productData={productData}
            activeTab={detailActiveTab}
            changeActiveTab={(key) => {
              setDetailActiveTab(key.toString());
            }}
          />
        </div>
      </div>

      <div className="mb-5 max-lg:hidden-scrollbar lg:styled-scrollbar pb-3 overflow-x-auto overflow-y-clip py-3 pl-3">
        <div className="flex gap-3 pr-4">
          {!!productData?.genres?.[0]?.name && (
            <button
              type="button"
              onClick={() => {
                setDetailActiveTab('details');
              }}
              className="shrink-0 text-right block border border-neutral-300 dark:border-white/15 p-3 rounded-xl text-xs max-w-56"
            >
              <div className="flex gap-2 items-center">
                سبک بازی
                <ArrowTopLeft className="w-3.5 h-3.5 fill-current" />
              </div>
              <b className="block font-semibold mt-2 text-xs h-8 overflow-hidden">
                {productData.genres.map((item) => item.name).join('، ')}
              </b>
            </button>
          )}

          {!!productData?.gameplay?.length && (
            <button
              type="button"
              onClick={() => {
                setDetailActiveTab('details');
              }}
              className="shrink-0 text-right block border border-neutral-300 dark:border-white/15 p-3 rounded-xl text-xs max-w-56"
            >
              <div className="flex gap-2 items-center">
                حالت بازی
                <ArrowTopLeft className="w-3.5 h-3.5 fill-current" />
              </div>
              <b className="block font-semibold mt-2 text-xs h-8 overflow-hidden">
                {productData.gameplay.map((item) => item.name).join('، ')}
              </b>
            </button>
          )}

          {!!productData?.playerPerspective?.length && (
            <button
              type="button"
              onClick={() => {
                setDetailActiveTab('details');
              }}
              className="shrink-0 text-right block border border-neutral-300 dark:border-white/15 p-3 rounded-xl text-xs max-w-56"
            >
              <div className="flex gap-2 items-center">
                زاویه دید
                <ArrowTopLeft className="w-3.5 h-3.5 fill-current" />
              </div>
              <b className="block font-semibold mt-2 text-xs h-8 overflow-hidden">
                {productData.playerPerspective
                  .map((item) => item.name)
                  .join('، ')}
              </b>
            </button>
          )}

          {!!productData?.theme?.length && (
            <button
              type="button"
              onClick={() => {
                setDetailActiveTab('details');
              }}
              className="shrink-0 text-right block border border-neutral-300 dark:border-white/15 p-3 rounded-xl text-xs max-w-56"
            >
              <div className="flex gap-2 items-center">
                تم بازی
                <ArrowTopLeft className="w-3.5 h-3.5 fill-current" />
              </div>
              <b className="block font-semibold mt-2 text-xs h-8 overflow-hidden">
                {productData.theme.map((item) => item.name).join('، ')}
              </b>
            </button>
          )}

          {!!productData?.releaseDate && (
            <button
              type="button"
              onClick={() => {
                setDetailActiveTab('details');
              }}
              className="shrink-0 text-right block border border-neutral-300 dark:border-white/15 p-3 rounded-xl text-xs max-w-56"
            >
              <div className="flex gap-2 items-center">
                تاریخ انتشار
                <ArrowTopLeft className="w-3.5 h-3.5 fill-current" />
              </div>
              <b className="block font-semibold mt-2 text-xs h-8 overflow-hidden">
                {dateDisplayFormat({
                  date: productData.releaseDate,
                  locale: 'fa',
                  format: 'dd mm yyyy',
                })}
              </b>
            </button>
          )}

          <div className="w-1 shrink-0" />
        </div>
      </div>
    </>
  );

  const mobileGallery = (serverSideGalleryData?.length && sortedGalleryItems) ? (
    <ProductGalleryCarousel galleries={sortedGalleryItems} galleryLoading={false} />
  ) : null;

  const description = productData?.shortDescription ? (
    <>
      <div id="description" className="pt-2 px-4">
        <h3 className="text-lg font-semibold mb-4"> {productData.name}</h3>
        <div className="inserted-content">
          {parsedShortDescription}

          {!!productData.description && (
            <button
              type="button"
              className="text-violet-500 inline-block text-sm font-semibold"
              onClick={() => {
                setDetailActiveTab('descriptions');
              }}
            >
              بیشتر
            </button>
          )}
        </div>
      </div>
      <div className="px-4">
        <div
          className={`mt-6 bg-[#dddddd] dark:bg-[#192a39] p-2.5 rounded-xl ${
            productData?.developer?.name && productData?.publisher?.name
              ? 'grid grid-cols-2 gap-2.5'
              : ''
          }`}
        >
          {!!productData?.developer?.name && (
            <Link
              prefetch={false}
              href={`/brand/${productData.developer.slug || 'unknown'}`}
              className=" block p-3 bg-[#fafafa] dark:bg-[#011425] rounded-xl text-xs"
            >
              <div className="flex gap-2">
                {productData.developer.filePath && (
                  <Image
                    src={productData.developer.filePath}
                    alt={
                      productData.developer.fileAltAttribute ||
                      productData.developer.fileTitleAttribute ||
                      ''
                    }
                    width={48}
                    height={48}
                    className="w-12 h-12 text-4xs bg-[#dddddd] dark:bg-[#192a39] p-1 rounded-lg"
                  />
                )}
                <div>
                  توسعه دهنده
                  <b className="block font-semibold mt-2 text-xs">
                    {productData.developer.name}
                  </b>
                </div>
              </div>
            </Link>
          )}

          {!!productData?.publisher?.name && (
            <Link
              prefetch={false}
              href={`/brand/${productData.publisher.slug || 'unknown'}`}
              className="block p-3 bg-[#fafafa] dark:bg-[#011425] rounded-xl text-xs"
            >
              <div className="flex gap-2">
                {productData.publisher.filePath && (
                  <Image
                    src={productData.publisher.filePath}
                    alt={
                      productData.publisher.fileAltAttribute ||
                      productData.publisher.fileTitleAttribute ||
                      ''
                    }
                    width={48}
                    height={48}
                    className="w-12 h-12 text-4xs bg-[#dddddd] dark:bg-[#192a39] p-1 rounded-lg"
                  />
                )}
                <div>
                  انتشار دهنده
                  <b className="block font-semibold mt-2 text-xs">
                    {productData.publisher.name}
                  </b>
                </div>
              </div>
            </Link>
          )}
        </div>

        <AgeRatingDetail esrb={productData.esrb} pegi={productData.pegi} />
      </div>      
    </>
  ) : null;

  let variant : ReactNode = null;

  if(variantsData?.length && !variantsLoading){
    variant = (
        <VariantSection 
          productId={productData.id} 
          productVariants={variantsData} 
          platform={queryPlatform || undefined}
        />
    )
  }
  if(variantsLoading){
    variant = (
      <div className='max-lg:px-4'>
        <Skeleton className='w-24 h-5 mb-3 mt-7' dark />
        <div className='flex mb-5 gap-4'>
          {[1,2,3].map(x => (
          <Skeleton className='w-36 h-16 rounded-xl grow-0' dark type='button' key={x} />
          ))}
        </div>

        <Skeleton className='w-24 h-5 mb-3 mt-10' dark />
        <div className='flex mb-5 gap-4'>
          {[1,2].map(x => (
          <Skeleton className='w-36 h-16 rounded-xl grow-0' dark type='button' key={x} />
          ))}
        </div>
      </div>
    )
  }

  const rating = !!productData?.rating?.length && (
    <section id="ratings" className='pt-8'>
      <strong  className="px-4 text-lg font-semibold mb-0 text-[#fd7e14] dark:text-[#ffefb2] block">
        امتیاز در وبسایت های معتبر
      </strong>
      <div className="max-lg:hidden-scrollbar lg:styled-scrollbar lg:pb-2 overflow-x-auto overflow-y-clip py-3 pl-3">
        <div className="flex gap-3 pr-4">
          {productData.rating.map((rating, index) => (
            <RatingItem key={rating.id} rating={rating} index={index} />
          ))}
          <div className="h-2 w-1 shrink-0" />
        </div>
      </div>
    </section>
  )

  const awards = !!productData?.awards?.length && (
    <section id="awards" className="px-4 pt-8">
        <strong className="text-lg font-semibold mb-3  text-[#fd7e14] dark:text-[#ffefb2] block">
          جوایز و دستاوردها
        </strong>
        {productData.awards.map((award) => (
          <div className="flex items-center gap-2 mb-2 text-sm" key={award}>
            <Image
              src="/images/icons/award.svg"
              alt="award"
              className="w-7 h-7 "
              width={28}
              height={28}
            />
            {award}
          </div>
        ))}
    </section>
  )
  const faq = !!productData?.faqs?.length && (
  <section id="faq">
      <h5  className="px-4 text-lg font-semibold mb-4 mt-8 text-[#fd7e14] dark:text-[#ffefb2]">
        سوالات متداول درباره {productData.name}
      </h5>
      <FAQ
        answerParse="parse"
        items={productData.faqs.map((faq) => ({
          id: faq.id,
          Answer: faq.answer,
          Question: faq.questions,
        }))}
      />
    </section>
  )

  const similar = !!slug && <SimilarProducts productSlug={slug} onHasSimilarItems={()=>{setHasSimilar(true)}} />;

  const head = (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@graph": schemaGraphs
            }              
          )
        }}
      />  
      {productData?.page?.title && <title> {productData.page.title} </title>}

      {metas?.map((meta, index) => (
        <meta key={index} property={meta.property} content={meta.content} />
      ))}
      
      {/* {productData?.page?.richSnippet && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(JSON.parse(productData.page.richSnippet)),
          }}
        />
      )} */}

    </Head>
  );

  const userQuestionAnswer = (
    <UserQuestionAnswer 
      productId={productData.id} 
      //items={props.serverSideQuestions?.items} 
      //total={props.serverSideQuestions?.totalCount} 
    />
  );


  const loginModalWrapperClass = `max-sm:w-[90vw] lg:bg-white/75 dark:lg:bg-[#011425]/60 z-[50] text-neutral-800 pb-5 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-lg transition-all top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${showLoginModal ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`;
  const loginModal = (
    <ModalPortal
        show={showLoginModal}
        selector='modal_portal'
    >
        <div className="bg-white/65 dark:bg-black/50 lg:bg-white/25 lg:dark:bg-black/25 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0" />

        <div className={loginModalWrapperClass}>
            <div className="lg:pt-8">
              <div className="pt-10">
                {loginType === "otp" ? (
                  <Otp
                    toggleLoginType={() => {
                      setLoginType("password");
                    }}
                    title={
                      <h3 className="font-semibold text-lg lg:text-xl text-[#ff7189] text-center mb-10 px-5">
                        فقط یه قدم تا دسترسی کامل! <br/>  شماره موبایلت رو وارد کن.
                      </h3>
                    }
                    onLoginSuccess={() => {
                      setShowLoginModal(false);
                    }}
                    hideAllLinks
                  />
                ) : (
                  <LoginWithPassword
                    onLoginSuccess={() => {
                      setShowLoginModal(false);
                    }}
                    toggleLoginType={() => {
                      setLoginType("otp");
                    }}
                    title={
                      <h3 className="font-semibold text-lg lg:text-xl text-[#ff7189] text-center mb-10 px-5">
                        فقط یه قدم تا دسترسی کامل! <br/>  شماره موبایلت رو وارد کن.
                      </h3>
                    }
                    hideAllLinks
                  />
                )}
              </div>
            </div>
        </div>
    </ModalPortal>
  )

  if(isDesktop){
    return(
      <>
      {head}
      {loginModal}
      {breadcrumb}

      <div
        style={{ backgroundImage: serverSideProductData?.filePath ? `url(${serverSideProductData.filePath})` : "linear-gradient(45deg, transparent, #ffe1e37a, transparent)" }}
        className='bg-green-200 bg-cover bg-center relative'
      >
        <div className='backdrop-blur-xl absolute top-0 left-0 right-0 bottom-0' />
        <div className='p-4 2xl:p-10 bg-black/45 grid grid-cols-12 gap-3 2xl:gap-5 relative'>
          
          <div className='col-span-3 self-start sticky top-100'>
            <div className='relative'>
              <Image
                src={serverSideProductData?.filePath || "/images/default-game.png"}
                alt={serverSideProductData?.fileAltAttribute || ""}
                title={serverSideProductData?.fileTitleAttribute || ""}
                className='w-full h-auto aspect-square rounded-3xl'
                width={550}
                height={550}
              />
              <MoreWrapper             
                productId={productData.id}
              />
            </div>
          </div>

          <div className='col-span-6 2xl:col-span-7 text-white min-h-480'>
            {intro}

            {variant}
          </div>

          <div 
            id="variant-footer-desktop-modal" 
            className='flex flex-col justify-end p-4 2xl:p-6 rounded-2xl col-span-3 2xl:col-span-2 bg-gradient-to-t from-[#011426] to-transparent' 
          >
            {variantsLoading && (
              <>
                <div className='text-left'>
                  <Skeleton className='h-4 mb-4 w-17 inline-block' dark />
                </div>
                <Skeleton className='h-11 rounded-full' dark type='button' />
              </>
            )}

          </div>

        </div>
        
      </div>
      
      {productTab}

      <ProductSpecificationSection
        productData={productData}
      />

      <ProductDescriptionSection 
        description={productData.description} 
        shortDescription={productData.shortDescription} 
        esrb={productData.esrb}
        pegi={productData.pegi}
      />

      {!!productData.rating?.length && <ProductRatingSection rating={productData.rating} />}

      {!!productData.awards?.length && <ProductAwardsSection awards={productData.awards} />}

      <ProductFAQSection faqs={productData.faqs} />

      {similar}

      {userQuestionAnswer}

      </>
    )
  }

  return (
    <>
      {head}
      {loginModal}
      {breadcrumb}

      <div className="flex gap-4 p-4">
        {mainImage}
        <div>
            {intro}
        </div>
      </div>
      
      {productTab}

      {specs}

      {mobileGallery}

      {description}

      {variant}

      {rating}

      {awards}

      {faq}

      {similar}

      {userQuestionAnswer}
      
    </>
  );
};

export async function getServerSideProps(context: any) {

  const [response, galleryResponse, variantsResponse, variantResponse] = await Promise.all<any>([
    getProductBySlug({
      acceptLanguage:"fa-IR",
      slug: context?.query?.slug,
      platform: context?.query?.platform,
      variantId:context?.query?.variant
    }),
    context?.query?.slug ? getProductGalleries(context.query.slug): undefined,
    getProductVariants(context.query.slug),
    getVariantById(context.query.variant)
  ]);

  // const QuestionsResponse : any = await getProductQuestions({
  //   MaxResultCount:5,
  //   SkipCount:0,
  //   ProductId: response.data?.result?.id,
  //   SortType:"Newest"
  // });

  return {
    props: {
      serverSideProductData: response.data?.result || null,
      serverSideGalleryData: galleryResponse?.data?.result || null,
      serverSideVariants:variantsResponse?.data?.result || null,
      serverSideVariant:variantResponse?.data?.result || null,
      slug: context?.query?.slug || null,
      platform : context?.query?.platform || null,
      variantId : context?.query?.variant || null,
      //serverSideQuestions: QuestionsResponse?.data?.result || null
    },
  };
}

export default DetailProduct;

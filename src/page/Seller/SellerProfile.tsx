import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "@/contexts/userContext";
import PageHeader from "@/components/header/PageHeader";
import { useInfiniteQuery } from "react-query";
import fetchInfinityProduct from "@/query/product/fetchInfinityProduct";
import { useInView } from "react-intersection-observer";
import { ProductWithId } from "@/models/type";
import ProductCard from "../../components/card/ProductCard";
import { OrderByDirection } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import SEOHelmet from "@/utils/SEOHelmet";

export default function SellerProfile() {
  const user = useUser();
  const params = useParams();
  const paramsId = params.id;
  const { ref, inView } = useInView();

  const category: string = "";
  const option: string = "";
  const direction: OrderByDirection = "desc";

  // react-query
  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery(
    ["product", user?.id, paramsId, category, option, direction],
    ({ pageParam, queryKey }) => fetchInfinityProduct({ pageParam, queryKey }),
    {
      getNextPageParam: (lastPage) => lastPage?.lastVisible,
    }
  );

  // observer
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <>
      {/* header */}
      <SEOHelmet title={`Profile`} description="Manage your information" />

      {/* body  */}
      <PageHeader
        title={`${user?.nickname}`}
        description={`Take care of your products`}
      />

      <div className="w-full h-px bg-slate-300 mb-8"></div>

      {/* 링크 */}
      <section className="flex justify-around items-center mb-10">
        {/* 상품 등록 */}
        <Link to={`/seller/${user?.id}/add-product`} className="w-1/4">
          <Button>Add Proudct</Button>
        </Link>

        {/* 주문 관리 */}
        <Link to={`/seller/order/${user?.id}`} className="w-1/4">
          <Button>Order</Button>
        </Link>
      </section>

      {/* 상품 리스트 */}
      <div className="text-left text-2xl px-10">Product List</div>

      <section className="grid grid-cols-2 gap-5 py-8 px-10 mb-30">
        {data?.pages
          .flatMap((page) => page?.data)
          .filter(
            (productWithId): productWithId is ProductWithId =>
              productWithId !== undefined
          )
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </section>
      <div ref={ref}></div>
    </>
  );
}

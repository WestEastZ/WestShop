import AddImageButton from "@/components/button/AddImageButton";
import CaroselImage from "@/components/carosel/CaroselImage";
import FormProduct from "@/components/form/FormProduct";
import PageHeader from "@/components/header/PageHeader";

import { useUser } from "@/contexts/userContext";
import useAddProduct from "@/hook/product/useAddProduct";
import useChangeInput from "@/hook/useChangeInput";
import useImageUpload from "@/hook/useImageUpload";
import { ProductWithId, UserType } from "@/models/type";
import { ERROR_MESSAGES } from "@/utils/validation";
import { serverTimestamp } from "firebase/firestore";
import { useState } from "react";

export default function AddProduct() {
  const user = useUser() as UserType;
  const [errorProduct, setErrorProduct] = useState<string>("");

  // 상품 상태
  const [product, setProduct] = useState<ProductWithId>({
    docId: "",
    id: "",
    sellerId: "",
    productName: "",
    productPrice: 0,
    productQuantity: 0,
    productDescription: "",
    productCategory: "",
    productImage: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 상품 상태 변경
  const { onChangeInput } = useChangeInput(user, product, setProduct);

  // 이미지 파일 선택
  const { addImageHandler } = useImageUpload(user, product, setProduct);

  // 상품 등록
  const { addProductHandler } = useAddProduct(user, product, setErrorProduct);

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center">
        {/* 안내문구 */}
        <PageHeader
          title={"Add Product"}
          description={"Please add the product"}
        />

        {/* 사진 첨부 */}
        <section className="w-1/2 h-96 relative mb-10">
          {product.productImage.length == 0 ? (
            <div className="w-full h-96  bg-zinc-600"></div>
          ) : (
            <CaroselImage product={product} />
          )}
          <AddImageButton />
          {errorProduct == "errorProductImage" ? (
            <div className="text-left mt-1 ml-2 text-xs text-red-500">
              {ERROR_MESSAGES[errorProduct]}
            </div>
          ) : null}
        </section>

        {/* 입력 */}
        <FormProduct
          onChangeInput={onChangeInput}
          addImageHandler={addImageHandler}
          product={product}
          setProduct={setProduct}
          addProductHandler={addProductHandler}
          errorCode={errorProduct}
        />
      </div>
    </>
  );
}

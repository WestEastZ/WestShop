import { useMutation } from "react-query";
import { storage } from "@/firebase";
import { ProductWithId, UserType } from "@/models/type";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import React from "react";

export default function useUploadImage(
  user: UserType,
  initialProduct: ProductWithId,
  setProduct: (
    value: ProductWithId | ((prevState: ProductWithId) => ProductWithId)
  ) => void
) {
  // 이미지 업로드 mutation
  const addImageMutation = useMutation(
    async (fileList: FileList) => {
      const promises = [];

      // 모든 이미지 파일
      for (let i = 0; i < fileList.length; i++) {
        const timestamp = Date.now();
        const selectImgFile = fileList[i];
        const imgRef = ref(
          storage,
          `${user?.id}/${selectImgFile.name}/${timestamp}`
        );

        // 이미지 파일을 Firebase Storage에 업로드하고 다운로드 URL을 얻는 프로미스 생성
        const uploadPromise = uploadBytes(imgRef, selectImgFile).then(() =>
          getDownloadURL(imgRef)
        );
        promises.push(uploadPromise);
      }

      // 모든 프로미스가 완료될 때까지 기다린 후 다운로드 URL 목록을 반환
      return await Promise.all(promises);
    },
    {
      // 업로드가 성공하면 다운로드 URL을 상품 이미지 URL 목록에 추가
      onSuccess: (downloadImgURL) => {
        setProduct((prev: ProductWithId) => ({
          ...prev,
          productImage: [...prev.productImage, ...downloadImgURL],
        }));
      },
      // 업로드가 실패하면 오류 출력
      onError: (error) => {
        console.log(error);
      },
    }
  );

  // 이미지 파일 선택 핸들러
  const addImageHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const selectImgList = event.target.files; // 선택된 파일 리스트
    if (selectImgList) {
      // 선택된 파일 리스트를 이미지 업로드 mutation에 전달
      addImageMutation.mutate(selectImgList);
    }
  };

  return { addImageHandler };
}

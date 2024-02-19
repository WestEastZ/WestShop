import { Link } from "react-router-dom";
import PageHeader from "@/components/header/PageHeader";
import { useUser } from "@/contexts/userContext";
import SEOHelmet from "@/utils/SEOHelmet";

export default function ConsumerProfile() {
  const user = useUser();
  return (
    <>
      {/* header */}
      <SEOHelmet title="Profile" description="Manage your information" />

      {/* body  */}
      <PageHeader
        title={`${user?.nickname}`}
        description={`구매자 전용 페이지`}
      />

      <div className="w-full h-px bg-slate-300 mb-8"></div>

      <div className="flex justify-center gap-24">
        <section>
          <Link
            to={`/cart/${user?.id}`}
            className="under-line text-custom text-3xl"
          >
            Cart
          </Link>
        </section>
        <section>
          <Link
            to={`/purchase/${user?.id}`}
            className="under-line text-custom text-3xl"
          >
            Purchase
          </Link>
        </section>
      </div>
    </>
  );
}

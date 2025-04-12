import SupportBanner from "../components/supportBanner";
import FAQ from "../components/FAQ";

const SupportPage = () => {
  return (
    <div className="flex flex-col items-center container mx-auto w-full mt-5 px-4 sm:px-0 sm:mt-10">
      <SupportBanner />
      <FAQ />
    </div>
  );
};

export default SupportPage;

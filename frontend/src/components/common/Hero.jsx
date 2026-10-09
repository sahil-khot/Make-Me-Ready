import { IMG } from "../../data/constants.js";

export const Hero = ({
  img,
  kicker,
  children,
  script,
  h = "min-h-[260px]",
}) => {
  const resolvedImg = img || IMG["hero-wardrobe"] || "/BackGround Images/Wardrobe BackGround Image.png";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-line ${h} flex items-center`}
    >
      <img
        src={resolvedImg}
        alt=""
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/BackGround Images/Wardrobe BackGround Image.png";
        }}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 md:via-bg/60 to-transparent" />
      <div className="relative p-6 md:p-10 max-w-xl">
        {kicker && (
          <div className="text-xs tracking-[.25em] text-acc mb-3">{kicker}</div>
        )}
        {children}
      </div>
      {script && (
        <div className="hidden lg:block absolute right-8 top-8 w-52 font-script text-3xl leading-tight text-acc/90 -rotate-6">
          {script}
        </div>
      )}
    </div>
  );
};

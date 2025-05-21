import { CircleArrowRight } from "lucide-react";

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div onClick={onClick} className="absolute top-1/2 right-4 w-6 h-6 z-50 hover:cursor-pointer max-lg:hidden">
      <CircleArrowRight color="#B8B8B8" />
    </div>
  );
};

export default NextArrow;

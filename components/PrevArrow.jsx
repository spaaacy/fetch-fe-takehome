import { CircleArrowLeft } from "lucide-react";

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div onClick={onClick} className="absolute top-1/2 left-4 w-6 h-6 z-50 hover:cursor-pointer max-lg:hidden">
      <CircleArrowLeft color="#B8B8B8" />
    </div>
  );
};

export default PrevArrow;

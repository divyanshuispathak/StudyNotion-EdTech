import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import HighlightText from "../components/Core/HomePage/HighlightText";
import CTAButton from "../components/Core/HomePage/CTAButton";

const Home = () => {
  return (
    <div>
      {/* {Section 1} */}
      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between font-inter">
        <Link to="/signup">
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-100 transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900 ">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="text-center text-4xl font-semibold mt-7">
          Empower your future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className="mt-4 w-[60%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAButton>Learn More</CTAButton>
          <CTAButton>Book a demo</CTAButton>
        </div>
      </div>
    </div>
  );
};

export default Home;

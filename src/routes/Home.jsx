import React from "react";
import logo from "../assets/pig-0.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="
        flex min-h-screen min-h-[100dvh] w-full min-w-0
        flex-col items-center justify-center
        px-4 py-8 sm:px-6 sm:py-12
        text-[#F9F7E8]
      ">
      <figure>
        <img src={logo} alt="Greedy Pig mascot" className="block h-auto w-full object-contain"/>
      </figure>
      <div className="flex w-full max-w-[400px] min-w-0 flex-col gap-6 text-center text-[#F9F7E8] sm:gap-8">
        <h1 className="pri-font text-3xl sm:text-5xl lg:text-6xl ">
          Greedy Pig
        </h1>
        <div className="flex w-full flex-col gap-4">
          {/* <Link
            to={`/play-computer`}
            className=" sec-font text-xl rounded px-8 py-4 bg-[#d30cbcc0] font-bold duration-500 skew-x-6 hover:skew-x-0 hover:scale-95 hover:bg-[#d30cbc] "
          >
            Play Computer
          </Link>
          <Link
            to={`/play-remote-game`}
            className=" sec-font text-xl rounded px-8 py-4 bg-[#d30cbcc0] font-bold duration-500 -skew-x-6 hover:bg-[#d30cbc] hover:skew-x-0 hover:scale-95  "
          >
            Play Friends (Remote)
          </Link> */}
          <Link
            to={`/live-game/setup`}
            className="
              sec-font w-full rounded
              bg-[#d30cbcc0] font-bold
              px-5 py-3 text-base
              sm:px-8 sm:py-4 sm:text-xl
              duration-500 skew-x-6
              hover:bg-[#d30cbc]
              hover:skew-x-0 hover:scale-95
            "
          >
            Play Friends (Live)
          </Link>
          <Link
            to="/live-game/tutorial"
            className="
              sec-font w-full rounded
              border border-white/50 bg-white/10
              px-5 py-3 text-base
              sm:px-8 sm:py-4 sm:text-xl
              font-bold duration-300
              hover:bg-white/20
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-4
            "
          >
            Learn to Play
          </Link>
        </div>
      </div>
    </section>
  );
}

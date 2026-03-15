"use client";

export function Loader() {
  return (
    <div className="relative w-[54px] h-[54px] rounded-[10px]">
      <style>{`
        @keyframes fade458 {
          from {
            opacity: 1;
          }
          to {
            opacity: 0.25;
          }
        }

        .loader-bar {
          width: 8%;
          height: 24%;
          background: var(--qv-primary);
          position: absolute;
          left: 50%;
          top: 30%;
          opacity: 0;
          border-radius: 50px;
          box-shadow: 0 0 3px rgba(30, 64, 175, 0.3);
          animation: fade458 1s linear infinite;
          transform-origin: 50% 130%;
        }

        .bar1 { transform: rotate(0deg) translate(0, -130%); animation-delay: 0s; }
        .bar2 { transform: rotate(30deg) translate(0, -130%); animation-delay: -1.1s; }
        .bar3 { transform: rotate(60deg) translate(0, -130%); animation-delay: -1s; }
        .bar4 { transform: rotate(90deg) translate(0, -130%); animation-delay: -0.9s; }
        .bar5 { transform: rotate(120deg) translate(0, -130%); animation-delay: -0.8s; }
        .bar6 { transform: rotate(150deg) translate(0, -130%); animation-delay: -0.7s; }
        .bar7 { transform: rotate(180deg) translate(0, -130%); animation-delay: -0.6s; }
        .bar8 { transform: rotate(210deg) translate(0, -130%); animation-delay: -0.5s; }
        .bar9 { transform: rotate(240deg) translate(0, -130%); animation-delay: -0.4s; }
        .bar10 { transform: rotate(270deg) translate(0, -130%); animation-delay: -0.3s; }
        .bar11 { transform: rotate(300deg) translate(0, -130%); animation-delay: -0.2s; }
        .bar12 { transform: rotate(330deg) translate(0, -130%); animation-delay: -0.1s; }
      `}</style>
      
      <div className="loader-bar bar1" />
      <div className="loader-bar bar2" />
      <div className="loader-bar bar3" />
      <div className="loader-bar bar4" />
      <div className="loader-bar bar5" />
      <div className="loader-bar bar6" />
      <div className="loader-bar bar7" />
      <div className="loader-bar bar8" />
      <div className="loader-bar bar9" />
      <div className="loader-bar bar10" />
      <div className="loader-bar bar11" />
      <div className="loader-bar bar12" />
    </div>
  );
}

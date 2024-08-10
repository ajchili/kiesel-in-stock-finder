import github from "../../images/github-mark.png";

export const NavBar = (): JSX.Element => {
  return (
    <div className="flex items-center justify-between h-10 p-4 w-full sticky">
      <span className="font-bold md:text-3xl sm:text-xl">
        Kiesel In Stock Finder
      </span>
      <div className="flex items-center gap-2">
        <a
          className="w-5 h-5"
          href="https://github.com/ajchili/kiesel-in-stock-finder"
          target="_blank"
        >
          <img src={github} />
        </a>
        <a
          className="md:text-l"
          href="https://www.kieselguitars.com/"
          target="_blank"
        >
          Kiesel Guitars
        </a>
      </div>
    </div>
  );
};

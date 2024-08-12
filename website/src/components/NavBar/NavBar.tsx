export const NavBar = (): JSX.Element => {
  return (
    <div className="flex-none navbar bg-base-300">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          Kiesel In Stock Finder
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="https://www.kieselguitars.com/" target="_blank">
              Kiesel Guitars
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

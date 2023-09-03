import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { logout } from "store/reducers";

export const Header = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-blue-500 p-4">
      <nav className="container mx-auto flex items-center justify-between flex-wrap">
        <h1 className="text-white text-2xl font-semibold">
          Веб-додаток для управління проектами
        </h1>
        <ul className="flex space-x-4 mt-4 md:mt-0">
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/" legacyBehavior>
                  <a className="text-white hover:underline">Головна</a>
                </Link>
              </li>
              <li>
                <Link href="/projects" legacyBehavior>
                  <a className="text-white hover:underline">Проекти</a>
                </Link>
              </li>
              <li>
                <Link href="/profile" legacyBehavior>
                  <a className="text-white hover:underline">Профіль</a>
                </Link>
              </li>
              <li>
                <a
                  className="text-white hover:underline"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  Вийти
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" legacyBehavior>
                  <a className="text-white hover:underline">Увійти</a>
                </Link>
              </li>
              <li>
                <Link href="/registration" legacyBehavior>
                  <a className="text-white hover:underline">Реєстрація</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

"use client";

import React, { useEffect, useState, useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/store";
import { autoLogin } from "store/reducers";
import { Loader } from "components";
import { getTokenFromLocalStorage } from "store/saga/auth.saga";

type SecurePagePropsTypes = {
  children?: React.ReactNode;
};

const SecurePage: React.FC<SecurePagePropsTypes> = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {}, []);

  useEffect(() => {
    const initializeAuthentication = async () => {
      const token = getTokenFromLocalStorage();
      if (
        token &&
        token !== "undefined" &&
        !auth.isAuthenticated &&
        !auth.isAutoLoggingIn
      ) {
        await dispatch(autoLogin(token));
      } else {
        if (
          !auth.isAuthenticated &&
          pathname !== "/registration" &&
          !auth.loading
        ) {
          router.push("/login");
        }
      }
    };
    initializeAuthentication();
  }, [
    auth.isAuthenticated,
    dispatch,
    router,
    auth.isAutoLoggingIn,
    pathname,
    auth.loading,
  ]);

  if (auth.loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default SecurePage;

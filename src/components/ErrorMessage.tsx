import React from "react";

type ErrorMessageProps = {
  children: React.ReactNode;
};

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <span className="text-red-500 font-bold text-left pt-1 text-sm">
      {children}
    </span>
  );
}

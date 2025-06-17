import { ComponentProps, ElementType } from "react"
import Button from "@mui/material/Button"
import a from "@mui/material/Button"

type Props<E extends ElementType = ElementType> = {
  children: string
  as?: E
}

type ButtonProps<E extends ElementType> = Props<E> & Omit<ComponentProps<E>, keyof Props>

const defaultElement = "button"

export const ButtonAndLink = <E extends ElementType = typeof defaultElement>({
  children,
  as,
  ...otherProps
}: ButtonProps<E>) => {
  const TagName = as || defaultElement
  return <TagName {...otherProps}>{children}</TagName>
}

import styles from "./PageNotFound.module.css"
import { ButtonAndLink } from "@/features/todolists/ui/Todolists/TodolistItem/ButtonAndLink/ButtonAndLink.tsx"

export const PageNotFound = () => (
  <>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <ButtonAndLink as="a" href="http://localhost:3000/">
      Перейти на главную страницу
    </ButtonAndLink>
  </>
)

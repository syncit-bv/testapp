/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-pdf-embed' {
  import { DefineComponent } from 'vue'
  
  interface Props {
    source: string
    page?: number
    width?: number
  }
  
  const component: DefineComponent<Props>
  export default component
}
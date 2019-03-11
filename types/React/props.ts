import { DetailedHTMLFactory, HTMLProps, SVGProps } from 'react';

export type ElementType<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T] extends SVGProps<infer Element>
  ? Element
  : (JSX.IntrinsicElements[T] extends DetailedHTMLFactory<any, infer Element> ? Element : never);

export interface Props<T extends keyof JSX.IntrinsicElements> extends HTMLProps<ElementType<T>> {
}

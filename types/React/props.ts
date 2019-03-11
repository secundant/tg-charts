import { DetailedHTMLFactory, HTMLProps, ReactHTML } from 'react';

export type ElementType<T extends keyof ReactHTML> = ReactHTML[T] extends DetailedHTMLFactory<any, infer Element> ? Element : never;

export interface Props<T extends keyof ReactHTML> extends HTMLProps<ElementType<T>> {
}

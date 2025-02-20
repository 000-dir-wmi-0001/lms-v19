import { ToastType } from './toast.type';

export interface Toast {
  type: ToastType | undefined;
  title: string | undefined;
  body: string | undefined;
  delay: number | undefined;
}

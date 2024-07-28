import type { ButtonProps } from "react-node-insim";
import { Button } from "react-node-insim";

type GlobalButtonProps = Omit<ButtonProps, "UCID">;

export function GlobalButton({ ...props }: GlobalButtonProps) {
  return <Button UCID={255} {...props} />;
}

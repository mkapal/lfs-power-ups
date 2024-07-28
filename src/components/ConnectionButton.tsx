import type { ButtonProps } from "react-node-insim";
import { Button } from "react-node-insim";

import { useConnectionContext } from "@/contexts/ConnectionContext";

type ConnectionButtonProps = Omit<ButtonProps, "UCID">;

export function ConnectionButton({ ...props }: ConnectionButtonProps) {
  const { connection } = useConnectionContext();

  return <Button UCID={connection.UCID} {...props} />;
}

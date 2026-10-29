import { ArrowDownNarrowWide, ArrowUpNarrowWide, LucideIcon } from "lucide-react"
import { Button } from "./animate-ui/components/buttons/button"
import { useState } from "react"
import { cn } from "@/lib/utils";


interface RevertButtonProps {
    className?: string,
    size?: number,
    onToggle?: () => void
}


function RevertButton({ className, size , onToggle }: RevertButtonProps) {

    const [revert, setRevert] = useState(false);

   

    return (
        <Button
            className={className}
            variant="default"
            onClick={() => {
                setRevert((r) => !r);
                onToggle?.();
            }}
            aria-label={revert ? "Orden revertido" : "Orden normal"}
        >
            <ArrowDownNarrowWide
                className={cn(
                    "transition-transform duration-300 motion-reduce:transition-none",
                    revert && "rotate-180"
                )}
            />
        </Button>
    );
}
export default RevertButton
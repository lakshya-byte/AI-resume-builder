import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaletteIcon } from "lucide-react";
import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomization } from "@/lib/permissions";

interface ColourPickerProps {
  color: Color | undefined;
  onchange: ColorChangeHandler;
}

export function ColourPicker({ color, onchange }: ColourPickerProps) {
  const subscriptionLevel = useSubscriptionLevel();

  const premiumModal = usePremiumModal();

  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger>
        <Button
          variant="outline"
          size="icon"
          title="Change Resume Colour"
          onClick={() => {
            if (!canUseCustomization(subscriptionLevel)) {
              premiumModal.setOpen(true);
              return;
            }
            setShowPopover(true);
          }}
        >
          <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="border-none bg-transparent shadow-none"
      >
        <TwitterPicker triangle="top-right" color={color} onChange={onchange} />
      </PopoverContent>
    </Popover>
  );
}

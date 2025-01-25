"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";


export function GetSubscriptionButton() {
    const premiumModal = usePremiumModal();

    return (
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white bg-transparent" onClick={() => premiumModal.setOpen(true)}>
            Get Premium
        </Button>
    )
}

"use client";

import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCustomerPortalSession } from "./actions";

export function ManageSubscriptionButton() {
    const {toast} = useToast();

    const [loading, setLoading] = useState(false);

    async function handleFlick() {
        try {
            setLoading(true);
            const redirectUrl = await createCustomerPortalSession();
            window.location.href = redirectUrl;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to manage subscription",
            });
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
      <LoadingButton className="bg-gradient-to-r from-purple-500 to-pink-500 text-white bg-transparent"  loading={loading} onClick={handleFlick}>
        Manage Subscription
      </LoadingButton>
    )
}
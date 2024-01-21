import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";

export const POST = async (request: NextRequest) => {

    const body = await request.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error?.message, status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return NextResponse.json({ error: "Missing metadata", status: 400 })
        }

        await db.purchase.create({
            data: {
                userId,
                courseId
            }
        });
    } else {
        return NextResponse.json({ error: `Invalid event type ${event.type}`, status: 200 })
    }

    return NextResponse.json({ message: null, status: 200 })
}
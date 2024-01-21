import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from '@/lib/stripe'

export const POST = async (request: NextRequest, { params }: { params: { courseId: string } }) => {

    try {
        const user = await currentUser();

        if (!user || !user?.id || !user.emailAddresses?.[0]?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        };

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true
            }
        });

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        });

        if (purchase) {
            return NextResponse.json({ error: "Already purchased", status: 401 })
        };

        if (!course) {
            return NextResponse.json({ error: "Course not found", status: 404 })
        };

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: course.title,
                        description: course.description
                    },
                    unit_amount: Math.round(course.price! * 100)
                }
            }
        ];

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                stripeCustomerId: true
            }
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses?.[0]?.emailAddress,
            })

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id
                }
            });
        };

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}/?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}/?canceled=true`,
            customer: stripeCustomer?.stripeCustomerId,
            metadata: {
                courseId: course.id,
                userId: user.id
            }
        });

        return NextResponse.json({ message: "Checkout successfull", data: session.url, status: 200 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}
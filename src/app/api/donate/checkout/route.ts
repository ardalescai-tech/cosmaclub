import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { amount, message, isAnonymous } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Donation to CosmaClub",
              description: "Your donation supports our community tennis club.",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "donation",
        message: message ?? "",
        isAnonymous: String(isAnonymous ?? false),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/donate/thank-you`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/donate`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
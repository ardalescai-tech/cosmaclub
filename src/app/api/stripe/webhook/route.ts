import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await prisma.booking.updateMany({
          where: { stripePaymentId: pi.id },
          data: { status: "CONFIRMED" },
        });
        break;
      }

      case "checkout.session.completed": {
        const cs = event.data.object as Stripe.Checkout.Session;
        if (cs.metadata?.type === "donation") {
          await prisma.donation.create({
            data: {
              userId: undefined,
              amount: (cs.amount_total ?? 0) / 100,
              message: cs.metadata.message || undefined,
              isAnonymous: cs.metadata.isAnonymous === "true",
              stripePaymentId: cs.payment_intent as string,
            },
          });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await prisma.booking.updateMany({
          where: { stripePaymentId: pi.id },
          data: { status: "CANCELLED" },
        });
        break;
      }
    }
  } catch (error) {
    console.error("Handler error:", error);
  }

  return NextResponse.json({ received: true });
}
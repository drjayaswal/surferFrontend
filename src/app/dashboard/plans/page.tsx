"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Check, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual"
  );

  const plans = [
    {
      name: "Paddler",
      description: "Ideal for beginners catching their first wave",
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        "100,000 tokens per month",
        "5 AI assistants",
        "Email support",
        "Basic API access",
        "Custom instructions",
        "Data export",
      ],
      popular: false,
      color: "sky",
      icon: <Waves className="h-5 w-5" />,
    },
    {
      name: "Surfer",
      description: "For pros who ride deep and fast",
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        "Unlimited tokens",
        "Unlimited AI assistants",
        "24/7 priority support",
        "Advanced API access",
        "Custom model training",
        "Team collaboration tools",
        "SSO & enhanced security",
        "SLA uptime guarantees",
      ],
      popular: true,
      icon: (
        <Image
          className="h-10 w-15"
          alt="surfer"
          src="/Surf.png"
          width={100}
          height={100}
        />
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-visible">
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center flex items-center justify-between mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Plan Your{" "}
              <span className="bg-gradient-to-r from-sky-200 via-sky-300 to-sky-400 bg-clip-text text-transparent">
                Surfer AI
              </span>{" "}
              Experience
            </h1>
            <div className="flex items-center gap-4 px-6 py-2">
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  billingCycle === "monthly" ? "text-gray-900" : "text-gray-400"
                )}
              >
                Monthly
              </span>
              <Switch
                checked={billingCycle === "annual"}
                onCheckedChange={(checked) =>
                  setBillingCycle(checked ? "annual" : "monthly")
                }
                className="data-[state=checked]:bg-sky-600"
              />
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    billingCycle === "annual"
                      ? "text-gray-900"
                      : "text-gray-400"
                  )}
                >
                  Annual
                </span>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative overflow-visible transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-0",
                  plan.popular
                    ? "ring-0 ring-sky-500 shadow-xl shadow-sky-500/20"
                    : "shadow-none hover:shadow-none"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                        plan.color === "sky"
                          ? "bg-gradient-to-br from-sky-100 to-sky-200 text-sky-600"
                          : "bg-transparent shadow-none"
                      )}
                    >
                      {plan.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-600">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-6">
                  <div className="mb-6">
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        $
                        {billingCycle === "monthly"
                          ? plan.monthlyPrice
                          : plan.annualPrice}
                      </span>
                      <span className="text-gray-500 mb-2 text-lg">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                    {billingCycle === "annual" && (
                      <p className="text-sm font-medium text-green-600">
                        ${plan.monthlyPrice * 12 - plan.annualPrice} savings
                        annually
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    className={cn(
                      "w-full py-4 text-base font-semibold transition-all duration-200 shadow-lg",
                      plan.popular
                        ? "bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white shadow-sky-500/30 hover:shadow-sky-500/40"
                        : "bg-sky-500/10 hover:bg-sky-500/60 text-sky-600 hover:text-white shadow-sky-500/30 hover:shadow-sky-500/40"
                    )}
                  >
                    {plan.popular ? "Upgrade to Enterprise" : "Choose Pro"}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

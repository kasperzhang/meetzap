"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Share2 } from "lucide-react";
import { useLanguage } from "@/i18n";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {t.home.title}
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {t.home.subtitle}
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/create">{t.home.createButton}</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-16">
          <Card>
            <CardHeader className="pb-2">
              <Calendar className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle className="text-lg">{t.home.features.pickDates.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t.home.features.pickDates.description}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Clock className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle className="text-lg">{t.home.features.setTimeRange.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t.home.features.setTimeRange.description}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Share2 className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle className="text-lg">{t.home.features.shareLink.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t.home.features.shareLink.description}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Users className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle className="text-lg">{t.home.features.viewResults.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t.home.features.viewResults.description}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">{t.home.howItWorks.title}</h2>
          <ol className="text-left max-w-xl mx-auto space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-medium">
                1
              </span>
              <div>
                <p className="font-medium">{t.home.howItWorks.step1.title}</p>
                <p className="text-sm text-neutral-600">
                  {t.home.howItWorks.step1.description}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-medium">
                2
              </span>
              <div>
                <p className="font-medium">{t.home.howItWorks.step2.title}</p>
                <p className="text-sm text-neutral-600">
                  {t.home.howItWorks.step2.description}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-medium">
                3
              </span>
              <div>
                <p className="font-medium">{t.home.howItWorks.step3.title}</p>
                <p className="text-sm text-neutral-600">
                  {t.home.howItWorks.step3.description}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-medium">
                4
              </span>
              <div>
                <p className="font-medium">{t.home.howItWorks.step4.title}</p>
                <p className="text-sm text-neutral-600">
                  {t.home.howItWorks.step4.description}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}

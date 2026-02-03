"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Share2, Info } from "lucide-react";
import { useLanguage } from "@/i18n";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#FFF8E7]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-4 text-black">
            {t.home.title}
          </h1>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto font-medium">
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
              <div className="h-12 w-12 bg-[#FFE500] border-2 border-black rounded-xl flex items-center justify-center mb-2 shadow-[3px_3px_0px_0px_#000]">
                <Calendar className="h-6 w-6 text-black" />
              </div>
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
              <div className="h-12 w-12 bg-[#4ECDC4] border-2 border-black rounded-xl flex items-center justify-center mb-2 shadow-[3px_3px_0px_0px_#000]">
                <Clock className="h-6 w-6 text-black" />
              </div>
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
              <div className="h-12 w-12 bg-[#FF6B6B] border-2 border-black rounded-xl flex items-center justify-center mb-2 shadow-[3px_3px_0px_0px_#000]">
                <Share2 className="h-6 w-6 text-black" />
              </div>
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
              <div className="h-12 w-12 bg-[#A8E6CF] border-2 border-black rounded-xl flex items-center justify-center mb-2 shadow-[3px_3px_0px_0px_#000]">
                <Users className="h-6 w-6 text-black" />
              </div>
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
          <h2 className="text-2xl font-bold mb-8">{t.home.howItWorks.title}</h2>
          <ol className="text-left max-w-xl mx-auto space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#FFE500] text-black border-2 border-black rounded-xl flex items-center justify-center font-black shadow-[3px_3px_0px_0px_#000]">
                1
              </span>
              <div>
                <p className="font-bold">{t.home.howItWorks.step1.title}</p>
                <p className="text-sm text-neutral-600">
                  {t.home.howItWorks.step1.description}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#4ECDC4] text-black border-2 border-black rounded-xl flex items-center justify-center font-black shadow-[3px_3px_0px_0px_#000]">
                2
              </span>
              <div>
                <p className="font-bold">{t.home.howItWorks.step2.title}</p>
                <p className="text-sm text-neutral-600">
                  {t.home.howItWorks.step2.description}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#FF6B6B] text-black border-2 border-black rounded-xl flex items-center justify-center font-black shadow-[3px_3px_0px_0px_#000]">
                3
              </span>
              <div>
                <p className="font-bold">{t.home.howItWorks.step3.title}</p>
                <p className="text-sm text-neutral-600">
                  {t.home.howItWorks.step3.description}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#A8E6CF] text-black border-2 border-black rounded-xl flex items-center justify-center font-black shadow-[3px_3px_0px_0px_#000]">
                4
              </span>
              <div>
                <p className="font-bold">{t.home.howItWorks.step4.title}</p>
                <p className="text-sm text-neutral-600">
                  {t.home.howItWorks.step4.description}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* Privacy Info Icon */}
      <div className="fixed bottom-6 right-6 group">
        <div className="h-10 w-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_#000] cursor-help hover:bg-[#4ECDC4] transition-colors">
          <Info className="h-5 w-5 text-black" />
        </div>
        <div className="absolute bottom-14 right-0 w-72 p-3 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <p className="font-bold mb-1">{t.privacy.title}</p>
          <p className="text-neutral-600">
            {t.privacy.description}
          </p>
        </div>
      </div>
    </main>
  );
}

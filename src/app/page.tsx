import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Mic,
  Leaf,
  ShoppingBag,
  Bug,
  Sprout,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Chat Advisor",
    description: "Get instant farming advice powered by GPT-4o in Hindi/English mix",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: Bug,
    title: "Pest & Disease Diagnosis",
    description: "Describe symptoms and get accurate diagnosis with treatment plans",
    color: "bg-red-500/10 text-red-600",
  },
  {
    icon: Sprout,
    title: "Crop Information",
    description: "Complete guides for Rice, Wheat, Potato, Tomato, Jute & more",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: ShoppingBag,
    title: "Product Suggestions",
    description: "Curated seeds, fertilizers & tools with prices and ratings",
    color: "bg-amber-500/10 text-amber-700",
  },
  {
    icon: Mic,
    title: "Voice Input",
    description: "Speak in Hindi or English — no typing needed for easy access",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Leaf,
    title: "Local Knowledge",
    description: "Optimized for West Bengal — Bhātpāra region crops and climate",
    color: "bg-purple-500/10 text-purple-600",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-agriculture.png"
            alt="Lush green rice paddy fields in West Bengal"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-medium">
              <Sparkles size={12} className="text-amber-400" />
              AI-Powered Agricultural Advisor
            </span>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            <span className="block">🌾 AgriBot</span>
            <span className="block text-xl sm:text-2xl lg:text-3xl font-medium text-green-300 mt-2">
              Aapka Digital Krishi Salahkar
            </span>
          </h1>

          <p className="text-center text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Expert farming advice for Indian farmers — pest diagnosis, crop details,
            fertilizer schedules & product recommendations. Speak in Hindi or English!
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/chat"
              id="start-chat-btn"
              className="group flex items-center gap-2 px-8 py-4 rounded-full
                         bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold text-base
                         shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40
                         hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <MessageCircle size={20} />
              Start Chatting with AgriBot
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-20" id="features-section">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Everything You Need for
            <span className="gradient-text"> Smart Farming</span>
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            From pest diagnosis to product recommendations — all in one AI-powered chatbot
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const isChatAdvisor = feature.title === "AI Chat Advisor";
            const isPestDiagnosis = feature.title === "Pest & Disease Diagnosis";
            const isProductSuggestions = feature.title === "Product Suggestions";
            const cardContent = (
              <>
                <div
                  className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mb-3
                             group-hover:scale-110 transition-transform`}
                >
                  <feature.icon size={20} />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {feature.description}
                </p>
              </>
            );

            if (isChatAdvisor) {
              return (
                <Link
                  href="/chat"
                  key={index}
                  className="group p-5 rounded-2xl border border-border bg-surface block
                             hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {cardContent}
                </Link>
              );
            }

            if (isPestDiagnosis) {
              return (
                <Link
                  href="/pest-diagnosis"
                  key={index}
                  className="group p-5 rounded-2xl border border-border bg-surface block
                             hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {cardContent}
                </Link>
              );
            }

            if (isProductSuggestions) {
              return (
                <Link
                  href="/store"
                  key={index}
                  className="group p-5 rounded-2xl border border-border bg-surface block
                             hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {cardContent}
                </Link>
              );
            }

            if (feature.title === "Local Knowledge") {
              return (
                <Link
                  href="/local-knowledge"
                  key={index}
                  className="group p-5 rounded-2xl border border-border bg-surface block
                             hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={index}
                className="group p-5 rounded-2xl border border-border bg-surface
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Ready to get expert farming advice? 🌱
          </h3>
          <p className="text-sm text-muted mb-6 max-w-md mx-auto">
            Ask about any crop, pest, or farming problem. AgriBot is here to help 24/7.
          </p>
          <Link
            href="/chat"
            id="footer-cta-btn"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       bg-primary text-white font-semibold text-sm
                       hover:bg-primary-dark active:scale-95 transition-all duration-200
                       shadow-md hover:shadow-lg"
          >
            <MessageCircle size={16} />
            Start a Conversation
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-muted">
            🌾 AgriBot — AI Agricultural Advisor • Made for Indian Farmers •
            Bhātpāra, West Bengal
          </p>
        </div>
      </footer>
    </div>
  );
}

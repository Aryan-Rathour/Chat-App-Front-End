import { MessageSquareText, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8 text-purple-600" />,
    title: "Real-Time Messaging",
    desc: "Experience lightning-fast delivery with instant syncing across all your devices.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
    title: "End-to-End Encryption",
    desc: "Your privacy is our priority. All chats are secured with top-notch encryption.",
  },
  {
    icon: <MessageSquareText className="w-8 h-8 text-purple-600" />,
    title: "Group & Channel Chat",
    desc: "Stay connected with friends, communities, or teams — all in one place.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Chatter?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <div className="mb-4">{feat.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
              <p className="text-gray-600">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

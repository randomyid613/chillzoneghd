import { Mail, Phone, MessageCircle } from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "office@chillzone.org.uk",
    href: "mailto:office@chillzone.org.uk",
    color: "text-primary",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "0191 648 8918",
    href: "tel:01916488918",
    color: "text-coral",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Message us on WhatsApp",
    href: "https://wa.me/441916488918",
    color: "text-green",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen pt-24">
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h1 className="animate-fade-up font-heading text-4xl font-bold sm:text-5xl">
              Get In <span className="text-gradient-teal">Touch</span>
            </h1>
            <p className="animate-fade-up-delay-1 mt-4 text-muted-foreground text-lg">
              We'd love to hear from you. Reach out through any of the channels below.
            </p>
          </div>

          <div className="mx-auto max-w-lg space-y-6">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                target={method.label === "WhatsApp" ? "_blank" : undefined}
                rel={method.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <method.icon className={method.color} size={22} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{method.label}</p>
                  <p className="font-heading font-semibold">{method.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

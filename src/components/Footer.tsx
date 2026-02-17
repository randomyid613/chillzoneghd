import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-heading text-xl font-bold text-gradient-teal mb-3">ChillZone</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Creating a safe, welcoming, and empowering space for young people within the Jewish community.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Charity number: 1214818</p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
              <Link to="/donate" className="text-sm text-muted-foreground hover:text-primary transition-colors">Donate</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-3">Get In Touch</h4>
            <div className="flex flex-col gap-2">
              <a href="mailto:office@chillzone.org.uk" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail size={14} /> office@chillzone.org.uk
              </a>
              <a href="tel:01916488918" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone size={14} /> 0191 648 8918
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ChillZone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

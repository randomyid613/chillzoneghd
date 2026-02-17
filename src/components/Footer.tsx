import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import logo from "@/assets/chillzone-logo.png";
import lotteryLogo from "@/assets/national-lottery-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <img src={logo} alt="ChillZone" className="h-14 w-auto mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Creating a safe, welcoming, and empowering space for young people within the Jewish community.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Charity number: 1214818</p>
            <img src={lotteryLogo} alt="The National Lottery Community Fund" className="mt-4 h-16 w-auto rounded bg-foreground/90 p-2" />
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

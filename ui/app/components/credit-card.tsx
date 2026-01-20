import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/avatar";
import { Github, Globe, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router";

export function CreditCard() {
  return (
    <Card className="border-none">
      <CardFooter className="text-sm text-muted-foreground flex flex-col items-start gap-2">
        <span>
          Developed by
          <span className="font-semibold text-foreground"> Muhammad Nabil</span>
        </span>
        <ul className="flex items-center gap-2">
          <li>
            <Link to="https://github.com/mnabil1718">
              <button className="opacity-70 hover:opacity-100 hover:bg-accent cursor-pointer p-2 rounded">
                <Github size={18} />
              </button>
            </Link>
          </li>
          <li>
            <Link to="https://www.linkedin.com/in/muhammad-n-3ba978109">
              <button className="opacity-70 hover:opacity-100 hover:bg-accent cursor-pointer p-2 rounded">
                <Linkedin size={18} />
              </button>
            </Link>
          </li>
          <li>
            <Link to="mailto:mnabil1718@gmail.com">
              <button className="opacity-70 hover:opacity-100 hover:bg-accent cursor-pointer p-2 rounded">
                <Mail size={18} />
              </button>
            </Link>
          </li>
          <li>
            <Link to="https://mnabil-porfolio.vercel.app/">
              <button className="opacity-70 hover:opacity-100 hover:bg-accent cursor-pointer p-2 rounded">
                <Globe size={18} />
              </button>
            </Link>
          </li>
        </ul>
      </CardFooter>
    </Card>
  );
}

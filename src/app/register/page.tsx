import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Logo } from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <ScrollArea className="h-[90vh] sm:h-auto">
          <CardHeader className="text-center">
            <Logo className="mb-4 justify-center" />
            <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Start your fitness journey with us today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline text-primary">
                Sign in
              </Link>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}

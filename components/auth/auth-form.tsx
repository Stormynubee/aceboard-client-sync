"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail } from "lucide-react";
import { signIn } from "next-auth/react";

interface AuthFormProps {
  type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const isLogin = type === "login";

  return (
    <Card className="w-full max-w-md shadow-lg border-muted-foreground/10">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">
          {isLogin ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {isLogin 
            ? "Sign in to manage your projects and reviews" 
            : "Join AceBoard and streamline your client feedback"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button 
          variant="outline" 
          className="w-full gap-2 h-11" 
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </Button>
        <Button 
          variant="outline" 
          className="w-full gap-2 h-11" 
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <Mail className="w-5 h-5" />
          Continue with Google
        </Button>
        
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Secure authentication via Auth.js
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-2">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <a 
            href={isLogin ? "/signup" : "/login"} 
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? "Sign up" : "Log in"}
          </a>
        </p>
      </CardContent>
    </Card>
  );
}

"use client";

import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { SIGN_IN_USER } from "../action";
import { SignInSchema } from "../schema";

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter()

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const { mutate: signInUser, isPending } = useMutation({
    mutationFn: SIGN_IN_USER,
    onSuccess: (data) => {
      toast.success("Login successful", {
        id: "sign-in-user",
      });
      router.push(`/redirect?redirectUrl=${callbackUrl}`)
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "sign-in-user",
      });
    },
  });

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignInSchema>) {
    toast.loading("Login...", {
      id: "sign-in-user",
    });
    signInUser({ values, callbackUrl: callbackUrl ? callbackUrl : "/" });
  }

//   const signInWithGoogle = async () => {
//     await SIGN_IN_WITH_GOOGLE({ callback: callbackUrl });
//   };

  return (
    <Card className="w-full max-w-[500px] rounded-sm">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue your journey.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        disabled={isPending}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={togglePassword}
                        type="button"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="submit" className="w-full" disabled={isPending}>
                Continue
              </Button>
              <div className="flex items-center text-sm">
                <p className="text-muted-foreground">Fotgot password?</p>
                <Button
                  variant="link"
                  className="text-md font-bold tracking-wider text-slate-600"
                  asChild
                  disabled={isPending}
                >
                  <Link href="/auth/reset">Reset</Link>
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <div className="flex items-center">
          <div className="h-[1px] w-full bg-slate-500" />
          <Badge variant="outline">OR</Badge>
          <div className="h-[1px] w-full bg-slate-500" />
        </div>
        <Button
          variant="outline"
          className="relative flex w-full items-center justify-center"
          disabled={isPending}
        //   onClick={signInWithGoogle}
        >
          <FcGoogle className="absolute left-5" size={20} />
          Continue with Google
        </Button>
      </CardContent>
      <CardFooter className="flex items-center text-sm">
        <p className="text-muted-foreground">Don&apos;t have an account?</p>
        <Button
          variant="link"
          className="text-md font-bold tracking-wider text-sky-600"
          asChild
          disabled={isPending}
        >
          <Link href="/auth/sign-up">Sign Up</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
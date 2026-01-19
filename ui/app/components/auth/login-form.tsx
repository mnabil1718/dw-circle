import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { userLogin, userRegister } from "~/services/auth";
import { loginFormSchema, registerFormSchema, type LoginDTO, type RegisterDTO } from "~/dto/auth";
import { Button } from "~/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Brand } from "~/components/brand";
import { LoaderDots } from "~/components/loader-dots";


export function LoginForm() {
    let navigate = useNavigate();
    const form = useForm<LoginDTO>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginDTO) {

        await userLogin(values);
        form.reset();
    }

    return (
        <div className="border max-w-md w-full mx-auto p-8 pt-4 rounded-md">
            <div className="w-32.5 mb-1">
                <Brand />
            </div>
            <h1 className="text-2xl font-semibold mb-4">Login To Your Circle Account</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem className="mb-3">
                                <FormControl className="py-5">
                                    <Input placeholder="Email/Username*" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="mb-3">
                                <FormControl className="py-5">
                                    <Input type="password" placeholder="Password*" {...field} />
                                </FormControl>

                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end mb-5">
                        <span className="text-sm text-muted-foreground">Forgot password?</span>
                    </div>


                    <Button
                        type="submit"
                        className="w-full py-3 mb-1"
                    >
                        {
                            form.formState.isSubmitting ? (<LoaderDots />) : "Login"
                        }
                    </Button>
                </form>
            </Form>

            <span className="text-sm text-muted-foreground">Don't have an account yet? <Link to="/register" className="underline text-primary">Register</Link></span>
        </div>
    );
}

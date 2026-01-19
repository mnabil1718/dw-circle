import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { userRegister } from "~/services/auth";
import { registerFormSchema, type RegisterDTO } from "~/dto/auth";
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


export function RegisterForm() {
    let navigate = useNavigate();
    const form = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            user_name: "",
            name: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: RegisterDTO) {

        await userRegister(values);
        form.reset();
        navigate("/login");
    }

    return (
        <div className="border max-w-md w-full mx-auto p-8 pt-4 rounded-md">
            <div className="w-32.5 mb-1">
                <Brand />
            </div>
            <h1 className="text-2xl font-semibold mb-4">Create Your Circle Account</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="mb-3">
                                <FormControl className="py-5">
                                    <Input placeholder="Full Name*" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="user_name"
                        render={({ field }) => (
                            <FormItem className="mb-3">
                                <FormControl className="py-5">
                                    <Input placeholder="User Name*" {...field} required />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="mb-3">
                                <FormControl className="py-5">
                                    <Input placeholder="Email*" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="mb-5">
                                <FormControl className="py-5">
                                    <Input type="password" placeholder="Password*" {...field} />
                                </FormControl>

                                {
                                    form.formState.errors.password ? (
                                        <FormMessage />
                                    ) : (
                                        <FormDescription>
                                            Use at least 8 characters containing letters, numbers, and special characters.
                                        </FormDescription>
                                    )
                                }

                            </FormItem>
                        )}
                    />


                    <Button
                        type="submit"
                        className="w-full py-3 mb-1"
                    >
                        {
                            form.formState.isSubmitting ? (<LoaderDots />) : "Create"
                        }
                    </Button>
                </form>
            </Form>

            <span className="text-sm text-muted-foreground">Already have an account? <Link to="/login" className="underline text-primary">Login</Link></span>
        </div>
    );
}

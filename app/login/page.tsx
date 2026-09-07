"use client";

import { useState } from "react";
import Navbar from "@/components/blocks/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Fault } from "@/lib/fault/fault";
import Image from "next/image";

export default function SignupPage() {
	const [usernameFault, setUsernameError] = useState<Fault | null>(null);
	const [emailFault, setEmailError] = useState<Fault | null>(null);

	return (
		<>
			<Navbar />
			<div className="flex w-full items-center justify-center">
				<Card className="w-96 mt-20 mx-2">
					<CardTitle className="self-center">Sign up to MCBlueprints</CardTitle>
					<CardContent className="p-0 *:px-4 gap-2 flex flex-col ">
						<FieldSet className="pb-2">
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="username">Username</FieldLabel>
									<Input
										id="username"
										autoComplete="off"
										aria-invalid={emailFault !== null}
										placeholder="Enter a username"
									/>
									{usernameFault !== null && (
										<FieldError>
											{usernameFault.message || "Unexpected error."}
										</FieldError>
									)}
								</Field>
								<Field>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										id="email"
										autoComplete="off"
										aria-invalid={emailFault !== null}
										placeholder="Enter your email"
									/>
									{emailFault !== null && (
										<FieldError>
											{emailFault.message || "Unexpected error."}
										</FieldError>
									)}
								</Field>
								<Button className="flex self-center w-36" disabled>
									Sign Up
								</Button>
							</FieldGroup>
						</FieldSet>
						<Separator />
						<p className="self-center text-muted-foreground">Or sign up with</p>
						<div className="flex justify-between mx-4 pt-2">
							<Button variant="outline">
								<Image
									src="https://static.mcbps.com/icons/axiomassets.webp"
									alt="Axiomassets logo"
									width={16}
									height={16}
								/>
								Axiomassets
							</Button>
							<Button variant="outline">
								<Image
									src="https://static.mcbps.com/icons/google.svg"
									alt="Google logo"
									width={16}
									height={16}
									className="invert"
								/>
								Google
							</Button>
							<Button variant="outline">
								<Image
									src="https://static.mcbps.com/icons/discord.svg"
									alt="Discord logo"
									width={16}
									height={16}
									className="invert"
								/>
								Discord
							</Button>
						</div>
					</CardContent>

					<CardFooter>
						<p>Already have an account? Login</p>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}

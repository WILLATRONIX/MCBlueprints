"use client";

import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
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
import { Email } from "@/lib/input/email";
import { Password } from "@/lib/input/password";
import { mcbpsApi } from "@/lib/network/client";
import { FaultService } from "@/lib/fault/faultService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CustomToast } from "@/components/blocks/custom-toast";
import { useAuthZStore } from "@/lib/zustand/auth";

export default function SignupPage() {
	const [emailFault, setEmailFault] = useState<Fault | null>(null);
	const [passwordFault, setPasswordFault] = useState<Fault | null>(null);
	const [passwordRepeatFault, setPasswordRepeatFault] = useState<Fault | null>(
		null,
	);

	const [emailInputValue, setEmailInputValue] = useState<string | null>(null);
	const [passwordInputValue, setPasswordInputValue] = useState<string | null>(
		null,
	);
	const [passwordRepeatInputValue, setPasswordRepeatInputValue] = useState<
		string | null
	>(null);

	const [displayErrors, setDisplayErrors] = useState<boolean>(false);

	const faultService = new FaultService(__filename);
	const authState = useAuthZStore();
	const router = useRouter();

	const validateEmail = (value: string | null) => {
		if (value === null) {
			setEmailFault(null);
			return;
		}

		const email = new Email(value);

		if (!email.valid) {
			setEmailFault(new Fault(email.errors[0], "email_invalid"));
		} else {
			setEmailFault(null);
		}
	};

	const validatePassword = (
		passwordValue: string | null,
		passwordRepeatValue: string | null,
	) => {
		if (passwordValue === null) {
			setPasswordFault(null);
			return;
		}

		const password = new Password(passwordValue);

		if (!password.valid) {
			setPasswordFault(new Fault(password.errors[0], "password_invalid"));
		} else {
			setPasswordFault(null);
		}

		validatePasswordRepeat(passwordValue, passwordRepeatValue);
	};

	const validatePasswordRepeat = (
		passwordValue: string | null,
		passwordRepeatValue: string | null,
	) => {
		if (passwordRepeatValue === null) {
			setPasswordRepeatFault(null);
			return;
		}

		if (passwordRepeatValue !== passwordValue) {
			setPasswordRepeatFault(
				new Fault("Password does not match.", "passwordRepeat_invalid"),
			);
		} else {
			setPasswordRepeatFault(null);
		}
	};

	const onPasswordChange = (value: string | null) => {
		const nextPassword = value;
		const nextRepeat = passwordRepeatInputValue;

		setPasswordInputValue(nextPassword);

		validatePassword(nextPassword, nextRepeat);
	};

	const onPasswordRepeatChange = (value: string | null) => {
		const nextRepeat = value;
		const nextPassword = passwordInputValue;

		setPasswordRepeatInputValue(nextRepeat);

		validatePassword(nextPassword, nextRepeat);
	};

	const onInputChange =
		(
			apply: Dispatch<SetStateAction<string | null>>,
			validate: (value: string | null) => void,
		) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value === "" ? null : event.target.value;

			apply(value);
			validate(value);
		};

	type AuthSuccess = {
		event: string;
		success: boolean;
		user: {
			id: string;
			createdAt: string;
			isCreator: boolean;
			requiresCreation: boolean;
		};
		client: {
			userId: string;
		};
		auth: {
			allVerified: boolean;
			anyVerified: boolean;
			email: string;
		};
	};

	const handleSignupClick = async () => {
		setDisplayErrors(true);

		try {
			const res = await mcbpsApi.post<AuthSuccess>("/auth/register", {
				body: { email: emailInputValue, password: passwordInputValue },
			});

			authState.login(
				{
					id: res.user.id,
					email: res.auth.email,
					isCreator: res.user.isCreator,
					createdAt: res.user.createdAt,
				},
				{
					allVerified: res.auth.allVerified,
					anyVerified: res.auth.anyVerified,
				},
			);

			if (res.success && res.user.requiresCreation) {
				router.push(`/create-account`);
			} else if (res.success) {
				router.push("/");
			}
		} catch (fault) {
			if (fault instanceof Fault) {
				toast.custom(() => (
					<CustomToast
						message="Cannot create user."
						description={fault.message}
						error
					/>
				));
				faultService.raise(fault);
				return;
			}
		}
	};

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
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										value={emailInputValue ?? ""}
										id="email"
										autoComplete="off"
										aria-invalid={displayErrors && emailFault !== null}
										placeholder="Enter your email"
										onChange={onInputChange(setEmailInputValue, validateEmail)}
									/>
									{emailFault !== null && displayErrors && (
										<FieldError>
											{emailFault.message || "Unexpected error."}
										</FieldError>
									)}
								</Field>
								<Field>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Input
										value={passwordInputValue ?? ""}
										id="password"
										type="password"
										autoComplete="off"
										aria-invalid={displayErrors && passwordFault !== null}
										placeholder="Create a password"
										onChange={onInputChange(
											setPasswordInputValue,
											onPasswordChange,
										)}
									/>
									{passwordFault !== null && displayErrors && (
										<FieldError>
											{passwordFault.message || "Unexpected error."}
										</FieldError>
									)}
								</Field>
								<Field>
									<FieldLabel htmlFor="password">Repeat Password</FieldLabel>
									<Input
										value={passwordRepeatInputValue ?? ""}
										id="passwordrepeat"
										type="password"
										autoComplete="off"
										aria-invalid={displayErrors && passwordRepeatFault !== null}
										placeholder="Enter your password again"
										onChange={onInputChange(
											setPasswordRepeatInputValue,
											onPasswordRepeatChange,
										)}
									/>
									{passwordRepeatFault !== null && displayErrors && (
										<FieldError>
											{passwordRepeatFault.message || "Unexpected error."}
										</FieldError>
									)}
								</Field>
								<Button
									className="flex self-center w-36"
									disabled={
										!emailInputValue ||
										!passwordInputValue ||
										!passwordRepeatInputValue
									}
									onClick={handleSignupClick}
								>
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
									src="/icons/google.svg"
									alt="Google logo"
									width={16}
									height={16}
									className="invert"
								/>
								Google
							</Button>
							<Button variant="outline">
								<Image
									src="/icons/discord.svg"
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

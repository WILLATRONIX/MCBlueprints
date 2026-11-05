"use client";

import { CustomToast } from "@/components/blocks/custom-toast";
import Navbar from "@/components/blocks/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardTitle } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Fault } from "@/lib/fault/fault";
import { FaultService } from "@/lib/fault/faultService";
import { DisplayName } from "@/lib/input/displayName";
import { MarkdownInput } from "@/lib/input/markdownInput";
import { Username } from "@/lib/input/username";
import { mcbpsApi } from "@/lib/network/client";
import { MCBPS_UserCreateResponse } from "@/lib/types/apiResponses";
import { useAuthZStore } from "@/lib/zustand/auth";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export default function CreateAccountPage() {
	const [usernameInputValue, setUsernameInputValue] = useState<string | null>(
		null,
	);
	const [displayNameInputValue, setDisplayNameInputValue] = useState<
		string | null
	>(null);
	const [aboutMeInputValue, setAboutMeInputValue] = useState<string | null>(
		null,
	);

	const [usernameFault, setUsernameFault] = useState<Fault | null>(null);
	const [displayNameFault, setDisplayNameFault] = useState<Fault | null>(null);
	const [aboutMeFault, setAboutMeFault] = useState<Fault | null>(null);

	const [displayErrors, setDisplayErrors] = useState<boolean>(false);

	const faultService = new FaultService("/create-account");
	const authState = useAuthZStore();
	const router = useRouter();

	const validateUsername = (value: string | null) => {
		if (value === null) {
			setUsernameFault(null);
			return;
		}

		const username = new Username(value);

		if (!username.valid) {
			setUsernameFault(new Fault(username.errors[0], "username_invalid"));
		} else {
			setUsernameFault(null);
		}
	};

	const validateDisplayName = (value: string | null) => {
		if (value === null) {
			setDisplayNameFault(null);
			return;
		}

		const displayName = new DisplayName(value);

		if (!displayName.valid) {
			setDisplayNameFault(
				new Fault(displayName.errors[0], "display_name_invalid"),
			);
		} else {
			setDisplayNameFault(null);
		}
	};

	const validateAboutMe = (value: string | null) => {
		if (value === null) {
			setAboutMeFault(null);
			return;
		}

		const aboutMe = new MarkdownInput(value);

		if (!aboutMe.valid) {
			setAboutMeFault(new Fault(aboutMe.errors[0], "about_me_invalid"));
		} else {
			setAboutMeFault(null);
		}
	};

	const onInputChange =
		(
			apply: Dispatch<SetStateAction<string | null>>,
			validate: (value: string | null) => void,
		) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const value = event.target.value === "" ? null : event.target.value;

			apply(value);
			validate(value);
		};

	const handleCreateClick = async () => {
		setDisplayErrors(true);

		try {
			const res = await mcbpsApi.post<MCBPS_UserCreateResponse>(
				"/user/create",
				{
					body: {
						username: usernameInputValue,
						displayName: displayNameInputValue,
						aboutMe: aboutMeInputValue,
					},
				},
			);

			authState.updateUser({ ...res.user });

			if (res.success && !res.auth.anyVerified) {
				router.push(`/verify-email`);
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
				<Card className="w-96 mt-20 mx-2 px-4">
					<CardTitle>Create your account</CardTitle>
					<FieldSet className="pb-2">
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="username">Username</FieldLabel>
								<Input
									value={usernameInputValue ?? ""}
									placeholder="Enter a unique name"
									aria-invalid={displayErrors && usernameFault !== null}
									onChange={onInputChange(
										setUsernameInputValue,
										validateUsername,
									)}
								/>
								{usernameFault !== null && displayErrors && (
									<FieldError>
										{usernameFault.message || "Unexpected error."}
									</FieldError>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor="displayname">Display Name</FieldLabel>
								<Input
									value={displayNameInputValue ?? ""}
									placeholder="A name to represent yourself"
									aria-invalid={displayErrors && displayNameFault !== null}
									onChange={onInputChange(
										setDisplayNameInputValue,
										validateDisplayName,
									)}
								/>
								{displayNameFault !== null && displayErrors && (
									<FieldError>
										{displayNameFault.message || "Unexpected error."}
									</FieldError>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor="aboutme">About Me</FieldLabel>
								<Textarea
									value={aboutMeInputValue ?? ""}
									className="h-20 resize-none"
									placeholder="Write something about yourself (optional)"
									aria-invalid={displayErrors && aboutMeFault !== null}
									onChange={onInputChange(
										setAboutMeInputValue,
										validateAboutMe,
									)}
								/>
								<FieldDescription>
									Supports Markdown formatting.
								</FieldDescription>
								{aboutMeFault !== null && displayErrors && (
									<FieldError>
										{aboutMeFault.message || "Unexpected error."}
									</FieldError>
								)}
							</Field>
						</FieldGroup>
					</FieldSet>
					<p className="text-center">
						By Creating an account, you agree to our Terms of Service
					</p>
					<CardAction className="flex justify-end w-full gap-2">
						<Button
							variant="ghost"
							onClick={() => {
								console.log(authState);
							}}
						>
							Cancel
						</Button>
						<Button
							disabled={!usernameInputValue || !displayNameInputValue}
							onClick={handleCreateClick}
						>
							Create Account
						</Button>
					</CardAction>
				</Card>
			</div>
		</>
	);
}

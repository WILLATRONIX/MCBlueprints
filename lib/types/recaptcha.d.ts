declare global {
	interface Window {
		onCaptchaSuccess?: (token: string) => void;
		onCaptchaExpired?: () => void;
	}
}

export {};

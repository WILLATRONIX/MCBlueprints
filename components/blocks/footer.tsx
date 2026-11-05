import Link from "next/link";
import { Separator } from "../ui/separator";
import { getTranslations } from "next-intl/server";

const year = new Date().getFullYear();

export default async function Footer() {
	const t = await getTranslations("mcbps.components.footer");

	return (
		<nav className="min-h-80 flex shrink-0 bg-background bg-texture ring ring-secondary/20">
			<div className="flex flex-col items-center justify-center px-2 gap-4 w-full">
				<div className="flex justify-between gap-16">
					<div className="flex flex-col">
						<p>{t("policies.title")}</p>
						<Separator className="my-0.5" />
						<Link className="text-muted-foreground" href="/policies/privacy">
							{t("policies.privacy")}
						</Link>
						<Link className="text-muted-foreground" href="/policies/terms">
							{t("policies.terms_of_service")}
						</Link>
						<Link className="text-muted-foreground" href="/policies/copyright">
							{t("policies.copyright")}
						</Link>
						<Link className="text-muted-foreground" href="/policies/rules">
							{t("policies.site_rules")}
						</Link>
						<Link className="text-muted-foreground" href="/policies/security">
							{t("policies.security_notice")}
						</Link>
					</div>
					<div className="flex flex-col">
						<p>{t("products.title")}</p>
						<Separator className="my-0.5" />
						<Link className="text-muted-foreground" href="/plugin">
							FAWE Plugin
						</Link>
						<Link className="text-muted-foreground" href="/axiom-addon">
							Axiom Addon
						</Link>
						<Link className="text-muted-foreground" href="/discord">
							Discord Bot
						</Link>
					</div>
				</div>
				<div className="px-4">
					<p>&copy; {year} WILLATRONIX LTD</p>
					<p className="text-muted-foreground">
						NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED
						WITH MOJANG OR MICROSOFT.
					</p>
				</div>
			</div>
		</nav>
	);
}

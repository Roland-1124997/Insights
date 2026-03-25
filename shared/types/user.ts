export type UserDisplay = {
	id: string;
	session: string;
	email: string;
	factors?: {
		verified: boolean;
		enabled: boolean;
	};
	mfa_needs_to_verified?: boolean;
};

export type UserSession = {
	id: string;
	created_at: string;
	updated_at: string;
	ip_address: string | null;
	continent_code: string | null;
	timezone: string | null;
	country_code: string | null;
	region_code: string | null;
	city: string | null;
	screen: string | null;
};

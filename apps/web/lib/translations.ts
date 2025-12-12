// No-op translation functions - returns key as-is
// Replace translation calls with hardcoded strings as needed

export function t(key: string): string {
	// Return the key itself - no translation
	return key;
}

// For compatibility with existing code
export function useTranslations(namespace?: string) {
	return (key: string) => {
		const fullKey = namespace ? `${namespace}.${key}` : key;
		return t(fullKey);
	};
}

export function getTranslations(namespace?: string) {
	return (key: string) => {
		const fullKey = namespace ? `${namespace}.${key}` : key;
		return t(fullKey);
	};
}

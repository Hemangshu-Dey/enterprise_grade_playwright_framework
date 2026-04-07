export const getEnv = () => {
	const email = process.env.EMAIL;
	const password = process.env.PASSWORD;

	if (!email || !password) {
		throw new Error("Missing env variables");
	}

	return { email, password };
};

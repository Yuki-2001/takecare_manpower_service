package com.takecare.common.utils;

import java.security.SecureRandom;
import java.util.concurrent.ThreadLocalRandom;

public class AuthUtil {

	private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "0123456789"
			+ "@#$%&*!";

	private static final SecureRandom RANDOM = new SecureRandom();

	public static String generateOtp() {
		return String.format("%06d", ThreadLocalRandom.current().nextInt(100000, 1000000));
	}

	public static String generatePassword(int length) {
		if (length < 8) {
			throw new IllegalArgumentException("Password length must be at least 8 characters");
		}

		StringBuilder password = new StringBuilder(length);

		for (int i = 0; i < length; i++) {
			password.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
		}

		return password.toString();
	}
}
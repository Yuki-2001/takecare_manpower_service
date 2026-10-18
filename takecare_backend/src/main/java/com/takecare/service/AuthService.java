package com.takecare.service;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.takecare.common.dto.MailRequest;
import com.takecare.common.handler.ApplicationException;
import com.takecare.common.handler.ApplicationException.LayerException;
import com.takecare.common.utils.ApplicationUtils.RecordStatusEnum;
import com.takecare.common.utils.AuthUtil;
import com.takecare.common.utils.MailUtils;
import com.takecare.config.JwtUtil;
import com.takecare.dto.ForgotPasswordReqDto;
import com.takecare.dto.LoginRespDto;
import com.takecare.dto.ResetPasswordRequest;
import com.takecare.dto.VerifyOtpRequest;
import com.takecare.model.UserDetails;
import com.takecare.repository.IUserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {
	
	private static final Logger logger =  LoggerFactory.getLogger(AuthService.class.getName());

	private final IUserRepository userRepo;

	private final PasswordEncoder passwordEncoder;

	private final JwtUtil jwtUtil;

	private final MailUtils mailService;

	private int accessExpiration = 7 * 24 * 60 * 60;

	public LoginRespDto login(String userEmail, String password, HttpServletResponse response)
			throws ApplicationException {

		try {
			Optional<UserDetails> optionalUser = userRepo.findByUserEmailAndStatus(userEmail, RecordStatusEnum.A);

			if (optionalUser.isEmpty()) {
				return null;
			}

			UserDetails user = optionalUser.get();

			if (!passwordEncoder.matches(password, user.getPassword())) {
				return null;
			}

			String accessToken = jwtUtil.generateToken(userEmail);

			Cookie accessCookie = new Cookie("ACCESS_TOKEN", accessToken);
			accessCookie.setHttpOnly(true);
			accessCookie.setPath("/");
			accessCookie.setMaxAge(accessExpiration);
			response.addCookie(accessCookie);

			return LoginRespDto.builder().accessToken(accessToken).userName(user.getUserName()).build();
		} catch (Exception ex) {
			throw new ApplicationException(LayerException.SERVICE_LAYER, ex.getMessage());
		}
	}

	@Override
	public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		UserDetails user = userRepo.findByUserEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		return org.springframework.security.core.userdetails.User.withUsername(user.getUserEmail())
				.password(user.getPassword()).roles("USER").build();
	}

	public Boolean forgotPassword(ForgotPasswordReqDto request) {

		logger.debug("Forgot password request received for email: {}", request.getEmail());
		
		Boolean resp = Boolean.FALSE;
		Optional<UserDetails> userOpt = userRepo.findByUserEmailAndStatus(request.getEmail(), RecordStatusEnum.A);

		if (userOpt.isPresent()) {
			String otp = AuthUtil.generateOtp();
			UserDetails user = userOpt.get();

			user.setForgotPasswordOtp(otp);
			user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(6));
			user.setOtpValidated(false);

			userRepo.save(user);

			String otpMailBody = MailUtils.OtpMailBody.formatted(otp, Year.now().getValue());

			mailService.sendMail(MailRequest.builder().to(new ArrayList<String>(List.of(request.getEmail())))
					.subject("Password Reset OTP - Takecare").body(otpMailBody).html(true).build());
			resp = Boolean.TRUE;
		}
		return resp;
	}

	public String verifyOtp(VerifyOtpRequest request, Map<String, String> errors) {

		String token = null;

		Optional<UserDetails> userOpt = userRepo.findByUserEmailAndOtpExpiryTimeAfterAndStatus(request.getEmail(),
				LocalDateTime.now(), RecordStatusEnum.A);

		if (userOpt.isPresent()) {
			UserDetails user = userOpt.get();

			if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
				errors.put("otp", "OTP expired");
			}

			if (!user.getForgotPasswordOtp().equals(request.getOtp())) {
				errors.put("otp", "Invalid OTP");
			}

			if (errors.isEmpty()) {
				token = UUID.randomUUID().toString();
				user.setOtpToken(token);
				userRepo.save(user);
			}
		}
		return token;
	}

	public Boolean resetPassword(ResetPasswordRequest request) {

		Boolean resp = Boolean.FALSE;
		Optional<UserDetails> userOpt = userRepo.findByOtpTokenAndStatus(request.getResetToken(), RecordStatusEnum.A);

		if (userOpt.isPresent()) {

			UserDetails user = userOpt.get();

			user.setPassword(passwordEncoder.encode(request.getNewPassword()));
			user.setOtpToken(null);
			user.setForgotPasswordOtp(null);
			user.setOtpExpiryTime(null);
			user.setOtpValidated(null);

			userRepo.save(user);
			resp = Boolean.TRUE;

			String passwordChangedMailBody = MailUtils.PasswordChangedMailBody.formatted(Year.now().getValue());

			mailService.sendMail(MailRequest.builder().to(new ArrayList<String>(List.of(user.getUserEmail())))
					.subject("Password Changed Successfully - Takecare").body(passwordChangedMailBody).html(true)
					.build());
		}

		return resp;
	}

	public void logout(HttpServletResponse response) {

		Cookie accessCookie = new Cookie("ACCESS_TOKEN", null);
		accessCookie.setHttpOnly(true);
		accessCookie.setPath("/");
		accessCookie.setMaxAge(0);

		response.addCookie(accessCookie);

	}

	public static String getAuthUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return auth != null ? auth.getName() : null;
	}

	public List<String> getAccessCodesByEmail(String email) {

		List<String> accessCodes = userRepo.findRoleNamesByUserEmail(email);
		
		return accessCodes != null ? accessCodes : new ArrayList<>();
	}

	public boolean hasAccess(List<String> access) {
		return getAccessCodesByEmail(getAuthUser()).stream().anyMatch(access::contains);
	}

}

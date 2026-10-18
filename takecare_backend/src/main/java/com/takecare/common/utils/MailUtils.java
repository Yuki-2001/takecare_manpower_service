package com.takecare.common.utils;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.takecare.common.dto.MailRequest;
import com.takecare.common.handler.ApplicationException;
import com.takecare.common.handler.ApplicationException.LayerException;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MailUtils {

	private static final Logger logger = LoggerFactory.getLogger(MailUtils.class);

	@Value("${spring.profiles.active:dev}")
	private String profile;

	@Value("${spring.mail.username}")
	private String configEmail;

	private final JavaMailSender mailSender;

	@Async
	public void sendMail(MailRequest request) {

		try {

			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			helper.setFrom(new InternetAddress((request.getFrom() != null ? request.getFrom() : configEmail),
					"Takecare Support", "UTF-8"));

			if (profile != null && profile.equals("dev")) {
				if (request.getTo() != null)
					helper.setTo(request.getTo().toArray(new String[0]));

				if (request.getCc() != null)
					helper.setCc(request.getCc().toArray(new String[0]));

				if (request.getBcc() != null)
					helper.setBcc(request.getBcc().toArray(new String[0]));
			} else {
				helper.setTo(configEmail);
			}

			helper.setSubject((profile != null && profile.equals("prod")) ? request.getSubject()
					: "[TEST] - " + request.getSubject());
			helper.setText(request.getBody(), request.isHtml());

			if (request.getAttachments() != null) {
				for (File file : request.getAttachments()) {

					FileSystemResource resource = new FileSystemResource(file);

					helper.addAttachment(file.getName(), resource);
				}
			}

			ClassPathResource logo = new ClassPathResource("static/images/logo.png");
			helper.addInline("logo", logo);

			mailSender.send(message);

			logger.debug("Mail sent successfully to {}", request.getTo());

		} catch (Exception ex) {
			logger.error("Error sending mail", ex);
			throw new ApplicationException(LayerException.INFRASTRUCTURE_LAYER, ex.getMessage());
		}

	}

	public static String OtpMailBody = """
			<!DOCTYPE html>
			<html>
			<head>
			<meta charset="UTF-8">
			<title>Password Reset OTP</title>
			</head>

			<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

			<table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
			<tr>
			<td align="center">

			<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.1);padding:30px;">

			<tr>
			<td align="center" style="padding-bottom:20px;">
			<img src="cid:logo" alt="Company Logo" style="height:50px;">
			</td>
			</tr>

			<tr>
			<td style="font-size:22px;font-weight:bold;color:#333;text-align:center;padding-bottom:10px;">
			Password Reset Request
			</td>
			</tr>

			<tr>
			<td style="font-size:14px;color:#555;text-align:center;padding-bottom:25px;">
			We received a request to reset your password. Use the OTP below to proceed.
			</td>
			</tr>

			<tr>
			<td align="center">
			<div style="font-size:28px;font-weight:bold;background:#f2f4f8;padding:15px 25px;border-radius:6px;letter-spacing:4px;color:#2c3e50;">
			%s
			</div>
			</td>
			</tr>

			<tr>
			<td style="text-align:center;font-size:13px;color:#777;padding-top:15px;">
			This OTP is valid for <b>5 minutes</b>.
			</td>
			</tr>

			<tr>
			<td style="font-size:13px;color:#666;padding-top:25px;text-align:center;">
			If you did not request a password reset, please ignore this email or contact support.
			</td>
			</tr>

			<tr>
			<td style="font-size:12px;color:#aaa;text-align:center;padding-top:30px;">
			© %d Takecare. All rights reserved.
			</td>
			</tr>

			</table>

			</td>
			</tr>
			</table>

			</body>
			</html>
			""";

	public static String PasswordChangedMailBody = """
			<!DOCTYPE html>
			<html>
			<head>
			<meta charset="UTF-8">
			<title>Password Changed Successfully</title>
			</head>

			<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

			<table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
			<tr>
			<td align="center">

			<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.1);padding:30px;">

			<tr>
			<td align="center" style="padding-bottom:20px;">
			<img src="cid:logo" alt="Company Logo" style="height:50px;">
			</td>
			</tr>

			<tr>
			<td style="font-size:22px;font-weight:bold;color:#333;text-align:center;padding-bottom:10px;">
			Password Updated Successfully
			</td>
			</tr>

			<tr>
			<td style="font-size:14px;color:#555;text-align:center;padding-bottom:25px;">
			Your account password has been successfully updated.
			</td>
			</tr>

			<tr>
			<td align="center">
			<div style="font-size:16px;background:#e8f5e9;padding:15px 25px;border-radius:6px;color:#2e7d32;">
			Your password change request has been completed successfully.
			</div>
			</td>
			</tr>

			<tr>
			<td style="text-align:center;font-size:13px;color:#777;padding-top:20px;">
			If you made this change, no further action is required.
			</td>
			</tr>

			<tr>
			<td style="font-size:13px;color:#666;padding-top:20px;text-align:center;">
			If you did not perform this action, please reset your password immediately or contact support.
			</td>
			</tr>

			<tr>
			<td style="font-size:12px;color:#aaa;text-align:center;padding-top:30px;">
			© %d Takecare. All rights reserved.
			</td>
			</tr>

			<tr>
			<td style="font-size:11px;color:#aaa;text-align:center;padding-top:8px;">
			This is an automated message, please do not reply.
			</td>
			</tr>

			</table>

			</td>
			</tr>
			</table>

			</body>
			</html>
			""";
}

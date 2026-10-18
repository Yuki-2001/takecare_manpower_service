package com.takecare.common.handler;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class ApplicationException extends RuntimeException {
	
	/**
	 * Add manual serial value
	 */
	private static final long serialVersionUID = 1L;
	
	
	private LayerException errorType;
	private String message;

    public String getMessage() {
        return errorType.getDescription() + " : " + message;
    }
    
    public enum LayerException {
        CONTROLLER_LAYER("Controller Layer Exception"),
        SERVICE_LAYER("Service Layer Exception"),
        INFRASTRUCTURE_LAYER("Infrastructure Layer Exception");

        private final String description;

        LayerException(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}

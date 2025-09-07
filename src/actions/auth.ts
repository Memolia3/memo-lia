"use server";

import { signIn } from "@/auth";
import {
  AUTH_PROVIDER_NAMES,
  ERROR_CONSTANTS,
  NOTIFICATION_DEFAULTS,
  NOTIFICATION_MESSAGES,
  NOTIFICATION_TYPES,
  OAUTH_PROVIDER,
  ROUTE,
} from "@/constants";
import { globalErrorHandler } from "@/lib/error-handler";
import { authSuccessHandler } from "@/lib/success-handler";

/**
 * 認証結果の型定義
 */
export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
  redirectTo?: string;
  notification?: {
    type: "success" | "error";
    message: string;
    description?: string;
    duration?: number;
    severity?: "low" | "medium" | "high" | "critical";
    category?: string;
    [key: string]: unknown;
  };
}

/**
 * Google認証を行う
 * @returns 認証結果
 */
export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    await signIn(OAUTH_PROVIDER.GOOGLE, {
      redirectTo: ROUTE.DASHBOARD,
    });

    const successConfig = authSuccessHandler("Google");
    return {
      success: true,
      redirectTo: ROUTE.DASHBOARD,
      notification: {
        type: NOTIFICATION_TYPES.SUCCESS,
        message: successConfig.message,
        description: successConfig.description,
        duration: successConfig.duration,
        severity: successConfig.severity,
        category: successConfig.category,
      },
    };
  } catch (error) {
    // リダイレクトエラーの場合は再スロー（NextAuthの正常な動作）
    if (error instanceof Error && error.message === ERROR_CONSTANTS.NEXT_REDIRECT) {
      throw error;
    }

    const errorConfig = globalErrorHandler(error, `${AUTH_PROVIDER_NAMES.GOOGLE}認証`);
    if (!errorConfig) {
      return {
        success: false,
        error: error instanceof Error ? error.message : NOTIFICATION_MESSAGES.AUTH.FAILED.ja,
        notification: {
          type: NOTIFICATION_TYPES.ERROR,
          message: NOTIFICATION_MESSAGES.AUTH.FAILED.ja,
          description: NOTIFICATION_MESSAGES.AUTH.RETRY_DESCRIPTION.ja,
          duration: NOTIFICATION_DEFAULTS.AUTH_ERROR.duration,
          severity: NOTIFICATION_DEFAULTS.AUTH_ERROR.severity,
          category: NOTIFICATION_DEFAULTS.AUTH_ERROR.category,
        },
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : NOTIFICATION_MESSAGES.AUTH.FAILED.ja,
      notification: {
        type: NOTIFICATION_TYPES.ERROR,
        message: errorConfig.message,
        description: errorConfig.description,
        duration: errorConfig.duration,
        severity: errorConfig.severity,
        category: errorConfig.category,
      },
    };
  }
};

/**
 * GitHub認証を行う
 * @returns 認証結果
 */
export const signInWithGitHub = async (): Promise<AuthResult> => {
  try {
    await signIn(OAUTH_PROVIDER.GITHUB, {
      redirectTo: ROUTE.DASHBOARD,
    });

    const successConfig = authSuccessHandler("GitHub");
    return {
      success: true,
      redirectTo: ROUTE.DASHBOARD,
      notification: {
        type: NOTIFICATION_TYPES.SUCCESS,
        message: successConfig.message,
        description: successConfig.description,
        duration: successConfig.duration,
        severity: successConfig.severity,
        category: successConfig.category,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === ERROR_CONSTANTS.NEXT_REDIRECT) {
      throw error;
    }

    const errorConfig = globalErrorHandler(error, `${AUTH_PROVIDER_NAMES.GITHUB}認証`);
    if (!errorConfig) {
      return {
        success: false,
        error: error instanceof Error ? error.message : NOTIFICATION_MESSAGES.AUTH.FAILED.ja,
        notification: {
          type: NOTIFICATION_TYPES.ERROR,
          message: NOTIFICATION_MESSAGES.AUTH.FAILED.ja,
          description: NOTIFICATION_MESSAGES.AUTH.RETRY_DESCRIPTION.ja,
          duration: NOTIFICATION_DEFAULTS.AUTH_ERROR.duration,
          severity: NOTIFICATION_DEFAULTS.AUTH_ERROR.severity,
          category: NOTIFICATION_DEFAULTS.AUTH_ERROR.category,
        },
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : NOTIFICATION_MESSAGES.AUTH.FAILED.ja,
      notification: {
        type: NOTIFICATION_TYPES.ERROR,
        message: errorConfig.message,
        description: errorConfig.description,
        duration: errorConfig.duration,
        severity: errorConfig.severity,
        category: errorConfig.category,
      },
    };
  }
};

/**
 * Discord認証を行う
 * @returns 認証結果
 */
export const signInWithDiscord = async (): Promise<AuthResult> => {
  try {
    await signIn(OAUTH_PROVIDER.DISCORD, {
      redirectTo: ROUTE.DASHBOARD,
    });

    const successConfig = authSuccessHandler("Discord");
    return {
      success: true,
      redirectTo: ROUTE.DASHBOARD,
      notification: {
        type: NOTIFICATION_TYPES.SUCCESS,
        message: successConfig.message,
        description: successConfig.description,
        duration: successConfig.duration,
        severity: successConfig.severity,
        category: successConfig.category,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === ERROR_CONSTANTS.NEXT_REDIRECT) {
      throw error;
    }

    const errorConfig = globalErrorHandler(error, `${AUTH_PROVIDER_NAMES.DISCORD}認証`);
    if (!errorConfig) {
      return {
        success: false,
        error: error instanceof Error ? error.message : NOTIFICATION_MESSAGES.AUTH.FAILED.ja,
        notification: {
          type: NOTIFICATION_TYPES.ERROR,
          message: NOTIFICATION_MESSAGES.AUTH.FAILED.ja,
          description: NOTIFICATION_MESSAGES.AUTH.RETRY_DESCRIPTION.ja,
          duration: NOTIFICATION_DEFAULTS.AUTH_ERROR.duration,
          severity: NOTIFICATION_DEFAULTS.AUTH_ERROR.severity,
          category: NOTIFICATION_DEFAULTS.AUTH_ERROR.category,
        },
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : NOTIFICATION_MESSAGES.AUTH.FAILED.ja,
      notification: {
        type: NOTIFICATION_TYPES.ERROR,
        message: errorConfig.message,
        description: errorConfig.description,
        duration: errorConfig.duration,
        severity: errorConfig.severity,
        category: errorConfig.category,
      },
    };
  }
};

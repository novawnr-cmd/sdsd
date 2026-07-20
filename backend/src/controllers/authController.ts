import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../types";
import prisma from "../config/database";
import { generateTokens, verifyRefreshToken } from "../utils/generateTokens";
import { verifyGoogleToken, verifyFacebookToken } from "../services/authService";
import { AppError } from "../middleware/errorHandler";
import { sendPasswordReset } from "../services/emailService";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ success: false, message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isVerified: true,
      },
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          city: user.city,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    if (!user.password) {
      res.status(400).json({
        success: false,
        message: "This account uses social login. Please sign in with Google or Facebook.",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          city: user.city,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    const googleUser = await verifyGoogleToken(idToken);

    let user = await prisma.user.findUnique({ where: { email: googleUser.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          isVerified: true,
          provider: "google",
          providerId: googleUser.providerId,
        },
      });
    } else if (!user.provider) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: "google",
          providerId: googleUser.providerId,
          avatar: user.avatar || googleUser.picture,
        },
      });
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          city: user.city,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (error: any) {
    console.error("Google login error:", error);
    res.status(400).json({ success: false, message: error.message || "Google login failed" });
  }
};

export const facebookLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accessToken } = req.body;

    const fbUser = await verifyFacebookToken(accessToken);

    let user = await prisma.user.findUnique({ where: { email: fbUser.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: fbUser.email,
          name: fbUser.name,
          avatar: fbUser.picture,
          isVerified: true,
          provider: "facebook",
          providerId: fbUser.providerId,
        },
      });
    } else if (!user.provider) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: "facebook",
          providerId: fbUser.providerId,
          avatar: user.avatar || fbUser.picture,
        },
      });
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Facebook login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          city: user.city,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (error: any) {
    console.error("Facebook login error:", error);
    res.status(400).json({ success: false, message: error.message || "Facebook login failed" });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        backupPhone: true,
        city: true,
        latitude: true,
        longitude: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
        store: {
          select: { id: true, name: true, slug: true, isActive: true, logo: true },
        },
        subscription: {
          select: { id: true, status: true, startDate: true, endDate: true },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, backupPhone, email, city, latitude, longitude, avatar } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (email && email !== user.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        res.status(400).json({ success: false, message: "Email already in use" });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(backupPhone !== undefined && { backupPhone }),
        ...(email && { email }),
        ...(city && { city }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        backupPhone: true,
        city: true,
        latitude: true,
        longitude: true,
        avatar: true,
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      res.status(401).json({ success: false, message: "Refresh token required" });
      return;
    }

    const decoded = verifyRefreshToken(token);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
      return;
    }

    const resetToken = jwt.sign(
      { userId: user.id, purpose: "password-reset" },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    await sendPasswordReset(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: "If the email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; purpose: string };

    if (decoded.purpose !== "password-reset") {
      res.status(400).json({ success: false, message: "Invalid token" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};

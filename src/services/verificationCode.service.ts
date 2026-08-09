import { randomInt } from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../schema/user.schema";
import VerificationToken from "../schema/verification-token.schema";
import { EmailService } from "../utils/email.utils";
import { JWT_SECRET } from "../utils/token.utils";
import { AppError } from "../errors/app.error";

export async function verificationCode(email: string, code: string) {
  const verification = await VerificationToken.findOne({ email }).select(
    "+code",
  );

  if (!verification) throw new AppError("CODE_INVALID_OR_EXPIRED");

  if (verification.attempts >= 5) {
    await VerificationToken.deleteOne({
      email,
    });
    throw new AppError("CODE_TOO_MANY_ATTEMPTS");
  }

  const isValid = await verification.compareCode(code);

  if (!isValid) {
    await VerificationToken.updateOne(
      { email },
      {
        $inc: {
          attempts: 1,
        },
      },
    );
    throw new AppError("CODE_INVALID");
  }

  await VerificationToken.deleteOne({
    email: verification.email,
  });

  const verificationToken = jwt.sign(
    {
      email,
      verified: true,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  return { verificationToken };
}

export async function generateCode(email: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("EMAIL_ALREADY_REGISTERED");

  await VerificationToken.deleteOne({
    email,
  });

  const code = randomInt(100000, 999999).toString();

  const verificationToken = new VerificationToken({
    email,
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await verificationToken.save();
  await EmailService.sendVerificationEmail(email, code);

  return { code };
}

import passport from "passport";
import { userModel } from "../schemas/user.schema";

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userModel.findOne({ userId: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

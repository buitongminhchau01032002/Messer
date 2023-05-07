import { UserType } from "models/User";
import { PlatformOSType } from "react-native";

export type LoginDTO = {
  username: string;
  password: string;
  type: UserType;
  platform: PlatformOSType;
  fcmToken?: string;
};

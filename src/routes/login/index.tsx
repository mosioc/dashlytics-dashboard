import { AuthPage, ThemedTitle } from "@refinedev/antd";
import { authCredentials } from "../../providers";

export const LoginPage = () => {
  return (
    <AuthPage
      type="login"
      registerLink={false}
      forgotPasswordLink={false}
      title={<ThemedTitle collapsed={false} text="Dashlytics" />}
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};

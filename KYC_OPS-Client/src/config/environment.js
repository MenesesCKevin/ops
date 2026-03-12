const environment = {
  current: import.meta.env.MODE || 'development',
  development: {
    ssoEnabled: import.meta.env.VITE_SSO_ENABLED === 'true' || false,
    defaultUserId: import.meta.env.VITE_DEFAULT_USER_ID || '45895623',
    ssoScriptUrl: import.meta.env.VITE_SSO_SCRIPT_URL || null
  },
  production: {
    ssoEnabled: import.meta.env.VITE_SSO_ENABLED === 'true' || true,
    defaultUserId: import.meta.env.VITE_DEFAULT_USER_ID || null,
    ssoScriptUrl: import.meta.env.VITE_SSO_SCRIPT_URL || 'https://ssupdate.global.hsbc/myhsbc/uservariables.ashx'
  }
};

export const getCurrentConfig = () => environment[environment.current];
export const isDevelopment = () => environment.current === 'development';
export const isProduction = () => environment.current === 'production';
export default environment;

export class Constants {
  public static readonly APP_NAME: string = 'SaaS Template';

  public static readonly API_URL_PROD: string = '';
  public static readonly API_URL: string = 'http://localhost:8080';

  //Patterns
  public static readonly EMAIL_PATTERN: RegExp = /^\S+@\S+\.\S+$/;
  public static readonly PASSWORD_PATTERN: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  public static readonly NAME_PATTERN: RegExp = /^[A-Za-z]{1,15}$/;

  public static readonly DEFAULT_MENU = 'dashboard';
  public static readonly PREFERENCE = 'preference';

  public static readonly DEFAULT_GUID = '00000000-0000-0000-0000-000000000001';

  public static readonly GOOGLE_CLIENT_ID: string = '348785308385-nitqhu4qmdeas13717cfrl74fhkdpug0.apps.googleusercontent.com';

  // Paths
  public static readonly BASE_PATH = '/app/dashboard';
  public static readonly LOGIN_PATH = '/app/login';
}

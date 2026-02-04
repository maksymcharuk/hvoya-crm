// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  webSocketUrl: 'http://localhost:3000',
  apiUrl: 'http://localhost:3000/api',
  // Old privat link: 'https://next.privat24.ua/payments/form/%7B%22token%22%20:%20%22410bacd5bfd6274a1d45676afaa6ddc2aue0g3oc%22%7D'
  // Broken link 'https://next.privat24.ua/payments/form/%7B%22companyID%22:%224563786%22%7D'
  privatBankPaymentUrl:
    'https://next.privat24.ua/payments/form/%7B%22token%22%20:%20%22410bacd5bfd6274a1d45676afaa6ddc2aue0g3oc%22%7D',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

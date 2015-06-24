var app = angular.module('leafdrop');
 
app.config(function ($mdThemingProvider) {
     
    $mdThemingProvider.definePalette('leafdropTheme', {
    '50': 'ffebee',
    '100': 'ffcdd2',
    '200': 'ef9a9a',
    '300': 'e57373',
    '400': 'ef5350',
    '500': '358673', // main drk green - main nav clr
    '600': 'e53935',
    '700': 'd32f2f',
    '800': '3AB99C', //md-hue-2
    '900': 'b71c1c',
    'A100': '43D4B3', //light bright green- sidenav header md-hue-3
    'A200': 'ff5252',
    'A400': 'ff1744',
    'A700': 'ffffff',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('leafdropTheme')

    .accentPalette('orange', {
      'default': '200' // use shade 200 for default, and keep all other shades the same
    });
      
});
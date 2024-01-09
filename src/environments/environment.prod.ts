const url = 'apiUrl';

export const environment = {
  production: true,
  tenantCode: '',
  brandName: 'ecom',
  apiURL: `https://${url}/`,
  webSocketUrl: `wss://${url}/`,

  isMultiColorActive: true,
  isDarkSwitchActive: true,
  menuHiddenBreakpoint: 768,
  subHiddenBreakpoint: 1440,
  defaultMenuType: 'menu-default',
  defaultColor: 'light.greysteel',
};

/*
Color Options:
'light.blueyale', 'light.blueolympic',
'light.bluenavy', 'light.greenmoss',
'light.greenlime', 'light.yellowgranola',
'light.greysteel', 'light.orangecarrot',
'light.redruby', 'light.purplemonster'
'dark.blueyale', 'dark.blueolympic',
'dark.bluenavy', 'dark.greenmoss',
'dark.greenlime', 'dark.yellowgranola',
'dark.greysteel', 'dark.orangecarrot',
'dark.redruby', 'dark.purplemonster'
*/

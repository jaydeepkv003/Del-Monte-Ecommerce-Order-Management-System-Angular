import { environment } from 'src/environments/environment';

export const camelCase = (str: string): string => {
  if (str) {
    str = str.replace(/[^a-zA-Z0-9 ]/g, ' ');
    str = str.replace(/([a-z](?=[A-Z]))/g, '$1 ');
    str = str
      .replace(/([^a-zA-Z0-9 ])|^[0-9]+/g, '')
      .trim()
      .toLowerCase();
    str = str.replace(
      /([ 0-9]+)([a-zA-Z])/g,
      (a, b, c) => b.trim() + c.toUpperCase()
    );
  }
  return str;
};

export const getThemeColor = () => {
  let color = environment.defaultColor;
  try {
    color = localStorage.getItem('ThemeColor') || environment.defaultColor;
  } catch (error) {
    console.log('>>>> src/app/utils/util.js : getThemeColor -> error', error);
    color = environment.defaultColor;
  }
  return color;
};

export const setThemeColor = (color) => {
  try {
    if (color) {
      localStorage.setItem('ThemeColor', color);
    } else {
      localStorage.removeItem('ThemeColor');
    }
  } catch (error) {
    console.log('>>>> src/app/utils/util.js : setThemeColor -> error', error);
  }
};

export const getThemeRadius = () => {
  let radius = 'flat';
  try {
    radius = localStorage.getItem('ThemeRadius') || 'flat';
  } catch (error) {
    console.log('>>>> src/app/utils/util.js : getThemeRadius -> error', error);
    radius = 'rounded';
  }
  return radius;
};

export const setThemeRadius = (radius) => {
  try {
    localStorage.setItem('ThemeRadius', radius);
  } catch (error) {
    console.log('>>>> src/app/utils/util.js : setThemeRadius -> error', error);
  }
};

export const getThemeLang = () => {
  let lang = 'en-US';
  try {
    lang = localStorage.getItem('theme_lang') || 'en-US';
  } catch (error) {
    console.log('>>>> src/app/utils/util.js : getThemeLang -> error', error);
    lang = 'en-US';
  }
  return lang;
};

export const setThemeLang = (lang) => {
  try {
    localStorage.setItem('theme_lang', lang);
  } catch (error) {
    console.log('>>>> src/app/utils/util.js : setThemeLang -> error', lang);
  }
};

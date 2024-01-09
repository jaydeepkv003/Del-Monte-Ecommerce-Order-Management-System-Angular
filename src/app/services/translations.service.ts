import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Translations } from '@dynamics/dynamics.interface';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { Modules } from '@urls';
import { Observable, Subject } from 'rxjs';
import { DataService } from './data.service';

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): any {
    if (!params.translateService.defaultLang) {
      return params.key;
    }
    if (
      params.translateService.currentLang ===
      params.translateService.defaultLang
    ) {
      return params.key;
    } else {
      return '(m) ' + params.key;
    }
  }
}

@Injectable({ providedIn: 'root' })
export class TranslationsService implements TranslateLoader {
  private translation = new Subject<any>();
  private isTranslatable = false;
  public renderer: Renderer2;
  public availableLanguages: Translations[];
  public currentLanguage: Translations;

  constructor(
    private translateService: TranslateService,
    private dataService: DataService,
    private rendererFactory: RendererFactory2
  ) {}

  getTranslation(): Observable<any> {
    if (localStorage.Translations) {
      this.setTranslation(JSON.parse(localStorage.Translations));
    } else {
      this.relodeTranslation();
    }
    return this.translation.asObservable();
  }

  public relodeTranslation(): void {
    if (this.dataService && localStorage.AccessToken) {
      this.dataService
        .postData<Translations[]>(Modules.LanguageUrl)
        .then((response) => {
          if (response) {
            localStorage.Translations = JSON.stringify(response);
            this.setTranslation(response);
          }
        });
    }
  }

  public setLanguage(language: Translations): void {
    this.currentLanguage = language;
    this.translateService.use(language.code);
    this.checkForDirectionChange();
  }

  public setDefaultLanguage(): void {
    if (!this.translateService.defaultLang && this.isTranslatable) {
      this.translateService.use('en');
    }
  }

  private setTranslation(translations: Translations[]): void {
    this.translation.next(translations);
    this.availableLanguages = [];
    translations.forEach((language) => {
      this.availableLanguages.push({ ...language, translations: [] });
      if (language.translations) {
        this.translateService.setTranslation(
          language.code,
          language.translations
        );
        if (!this.isTranslatable) {
          this.isTranslatable = language.code === 'en';
        }
      }
    });

    if (
      this.isTranslatable &&
      this.availableLanguages.length &&
      !this.currentLanguage
    ) {
      this.setDefaultLanguage();
      const setLang = this.availableLanguages.find(
        (language) => language.code === 'en'
      );
      this.setLanguage(setLang ? setLang : this.availableLanguages[0]);
    }
  }

  checkForDirectionChange(): void {
    if (!this.renderer) {
      this.renderer = this.rendererFactory.createRenderer(null, null);
    }
    this.renderer.removeClass(document.body, 'ltr');
    this.renderer.removeClass(document.body, 'rtl');
    this.renderer.addClass(document.body, this.currentLanguage.direction);
    this.renderer.setAttribute(
      document.documentElement,
      'direction',
      this.currentLanguage.direction
    );
  }
}

import { OpaqueToken } from '@angular/core';
import { LANG_DE_NAME, LANG_DE_TRANS } from './lang-de';
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';

// translation token
export const TRANSLATIONS = new OpaqueToken('translations');

export const dictionary = {};

dictionary[LANG_DE_NAME] = LANG_DE_TRANS;
dictionary[LANG_EN_NAME] = LANG_EN_TRANS;

// providers
export const TRANSLATION_PROVIDERS = [
	{ provide: TRANSLATIONS, useValue: dictionary }
];
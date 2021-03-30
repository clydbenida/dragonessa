/*
 Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

 override.js uses the version of the setState method of the button object that was updated in
 CKEditor 4.11. Prior versions appended the string '(Selected)' to the button label, which we
 found undesirable. This updated code sets the 'aria-expanded' attribue instead.
*/
CKEDITOR.ui.button.prototype.setState=function(a){if(this._.state==a)return!1;this._.state=a;var b=CKEDITOR.document.getById(this._.id);return b?(b.setState(a,"cke_button"),b.setAttribute("aria-disabled",a==CKEDITOR.TRISTATE_DISABLED),this.hasArrow?b.setAttribute("aria-expanded",a==CKEDITOR.TRISTATE_ON):a===CKEDITOR.TRISTATE_ON?b.setAttribute("aria-pressed",!0):b.removeAttribute("aria-pressed"),!0):!1};
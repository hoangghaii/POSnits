/**
 * システム共通定数
 */
// tslint:disable-next-line: no-namespace
export namespace GlobalConst {
  export namespace LocalStorageKeyMapping {
    export const token = 'TOKEN';
    export const currentUser = 'CURRENT-USER';
  }
}

/**
 * Setting
 */
// tslint:disable-next-line: no-namespace
export namespace SystemSetting {
  export const imageUrl = './assets/images/icon/no-img.svg';
}

// tslint:disable-next-line: no-namespace
export namespace RegexValidator {
  export const datePattern = /^[2-9][0-9]\d{2}-(0[1-9]|1[012])-(0[1-9]|[1-2][0-9]|3[01])$/;
  export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  export const numberOnlyRegex = /^-?[0-9]+(?:\.[0-9]+)?$/;
  export const jaAlphabetRegex = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B|^[a-zA-Z0-9]*$/;
  export const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  export const characterKatakana = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
}

// tslint:disable-next-line: no-namespace
export namespace ColorTypeSetting {
  export const defaultColors = [
    '#ffffff', '#000000', '#ff0000', '#ffff00', '#0000ff', '#00ff00',
    '#f4f6f6', '#212f3d', '#ff00ff', '#f7dc6f', '#000080', '#008000',
    '#ecf0f1', '#566573', '#4a235a', '#f1c40f', '#0066ff', '#808000',
    '#c0c0c0', '#abb2b9', '#9b59b6', '#f39c12', '#6633ff', '#33cc66',
    '#7b7d7d', '#eceff1', '#641e16', '#ff5733', '#00ffff', '#00cc00'];
}

/**
 * Setting
 */
// tslint:disable-next-line: no-namespace
export namespace ContractSetting {
  export const fee = {
    standard: 3000,
    web: 1000,
    payment: 1000
  };
}

/**
 * Setting
 */
// tslint:disable-next-line: no-namespace
export namespace VisitFlg {
  export const notYetVisit = 0;
  export const visited = 1;
}

